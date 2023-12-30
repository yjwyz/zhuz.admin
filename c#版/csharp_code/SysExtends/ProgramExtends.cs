using System.Configuration;
using System.Text;
using Autofac;
using AutoMapper;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using SqlSugar;
using Zhuz.net.BaseModels.Edit;
using Zhuz.net.BaseModels.Menu;
using Zhuz.net.BaseModels.User;
using Zhuz.net.BaseServices;
using Zhuz.net.SysHelpers;
using Zhuz.net.SysMiddleware;
using Zhuz.net.SysMiddleware.SysRequirements;
using Zhuz.net.SysModels.Result;
using Zhuz.net.SysModels.SysJWT;
using Zhuz.net.SysServices;
using Zhuz.net.SysServices.Imp;
using Zhuz.net.ZhuzEntitys;

namespace Zhuz.net.SysExtends;

public static class ProgramExtends
{
    /// <summary>
    /// 扩展 WebApplication
    /// </summary>
    /// <param name="app"></param>
    public static void AddWebApplicationModule(this WebApplication app,IConfiguration configuration)
    {
        #region 注册中间件
        {
            app.UseMiddleware<SysExceptionMiddleware>();
        }
        #endregion

        #region 注册授权
        {
            app.UseAuthentication();
            app.UseAuthorization();
        }
        #endregion

        #region 开启静态资源服务,并创建相应目录

        {
            app.UseStaticFiles();
            SysFileHelper.CreateStaticFinder("");
            SysFileHelper.CreateStaticFinder(configuration.GetSection("EditSysOptions:TempFinderName").Value);
            SysFileHelper.CreateStaticFinder(configuration.GetSection("EditSysOptions:AvatarFinderName").Value);
        }

        #endregion
    }
    /// <summary>
    /// 扩展 IServiceCollection
    /// </summary>
    /// <param name="serviceCollection"></param>
    /// <param name="configuration"></param>
    public static void AddServiceCollectionModule(this IServiceCollection serviceCollection,
        IConfiguration configuration)
    {
        string jwtOptionKey = "JWTTokenOptions";// jwt配置属性名

        #region 配置关联
        
        serviceCollection.Configure<SysJwtOptionModel>(configuration.GetSection(jwtOptionKey));
        serviceCollection.Configure<EditOptionsModel>(configuration.GetSection("EditSysOptions"));
        
        #endregion
        
        #region 控制器首字母小写

        {
            serviceCollection.AddRouting(options => { options.LowercaseUrls = true; });
        }

        #endregion

        #region automapper

        {
            serviceCollection.AddAutoMapper(typeof(AutoMapperConfigs));
        }

        #endregion

        #region jwt
        {
            var section= configuration.GetSection(jwtOptionKey);
            if (!section.Exists())
            {
                throw new ConfigurationErrorsException("请前往配置文件配置JWT授权!");
            }
            serviceCollection.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer(option =>
            {
                option.TokenValidationParameters = new TokenValidationParameters
                {
                    // jwt的一些默认值
                    ValidateIssuer = true,// 是否验证颁发者
                    ValidateAudience = true,// 是否验证受众者
                    ValidateLifetime = true,// 是否验证失效时间
                    ValidateIssuerSigningKey = true,// 是否验证密钥
                    ValidAudience = section.GetSection("Audience").Value,
                    ValidIssuer = section.GetSection("Issuer").Value,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(section.GetSection("SecurityKey").Value))// 拿到SecurityKey
                };
            });
        }

        #endregion

        #region 新增策略
        {
            serviceCollection.AddAuthorization(option =>
            {
                option.AddPolicy(SysPolicyInfo.User, policyBuilder =>
                {
                    policyBuilder.AddRequirements(new SysUserLevelRequirement());
                });
                option.AddPolicy(SysPolicyInfo.Admin, policyBuilder =>
                {
                    policyBuilder.AddRequirements(new SysAdminLevelRequirement());
                });
                option.AddPolicy(SysPolicyInfo.Root, policyBuilder =>
                {
                    policyBuilder.AddRequirements(new SysRootLevelRequirement());
                });
            });
        }
        #endregion

        #region 自定义内置模型校验异常结果

        {
            serviceCollection.Configure<ApiBehaviorOptions>(options =>
            {
                string smsg="未知:参数校验失败";
                options.InvalidModelStateResponseFactory = (context) =>
                {
                    foreach (var key in context.ModelState.Keys) {
                        var errors = context.ModelState[key]?.Errors;
                        if (errors != null && errors.Any()) {
                            smsg = errors[0].ErrorMessage;
                            break;
                        }
                    }
                    SysResultModel<string> result = SysResultHelper<string>.Error(smsg);
                    return  new JsonResult(result);
                };
            });
        }

        #endregion

    }

    /// <summary>
    /// 扩展 ContainerBuilder
    /// </summary>
    /// <param name="builder"></param>
    public static void AddAutofacModule(this ContainerBuilder builder, IConfiguration configuration)
    {
        #region mysql

        {
            // mysql
            SqlSugarScope sqlSugarScope = new SqlSugarScope(new ConnectionConfig()
            {
                DbType = SqlSugar.DbType.MySql,
                ConnectionString = configuration.GetSection("SqlConnectString:Default").Value,
                IsAutoCloseConnection = true,
            }, db =>
            {
                db.Aop.OnLogExecuting = (sql, pars) =>
                {
                    // Console.WriteLine(sql);
                };
                db.Aop.OnError = (exp) =>
                {
                    if (exp.Message.Contains("Connect Timeout"))
                    {
                        throw new Exception("数据库连接超时:" + exp.Message);
                    }
                    Console.WriteLine("数据库操作出错：" + exp.Message);
                };
            });
            builder.Register<ISqlSugarClient>(c => sqlSugarScope);
        }

        #endregion

        #region redis

        {
            var _redisConfig = configuration.GetSection("Redis");
            string _redisConnectionString = _redisConfig.GetSection("Connection").Value;
            string _instanceName = _redisConfig.GetSection("InstanceName").Value;
            int _defaultDb = int.Parse(_redisConfig.GetSection("DefaultDB").Value ?? "0");
            builder.Register(c => new SysRedisServiceImp(_redisConnectionString, _instanceName, _defaultDb))
                .As<ISysRedisService>().SingleInstance();
        }

        #endregion

        #region JWT服务跟授权策略注册

        {
            builder.RegisterType<SysAuthorizationResultHandleMiddleware>().As<IAuthorizationMiddlewareResultHandler>();
            builder.RegisterType<SysJWTServiceImp>().As<ISysJWTService>();
            builder.RegisterType<SysUserLevelAuthorizationHandler>().As<IAuthorizationHandler>();
            builder.RegisterType<SysAdminLevelAuthorizationHandler>().As<IAuthorizationHandler>();
            builder.RegisterType<SysRootLevelAuthorizationHandler>().As<IAuthorizationHandler>();
        }

        #endregion
        
        #region 注册服务

        {
            builder.RegisterType<SysCommonServiceImp>().As<ISysCommonService>();
            builder.RegisterType<SysFileServiceImp>().As<ISysFileService>();
            builder.RegisterType<UserServiceImp>().As<IUserService>();
            builder.RegisterType<RoleServiceImp>().As<IRoleService>();
            builder.RegisterType<MenuServiceImp>().As<IMenuService>();
        }
        #endregion
    }
}

public class AutoMapperConfigs : Profile
{
    public AutoMapperConfigs()
    {
        #region mapper绑定

        CreateMap<sys_user, AddUserRes>();
        CreateMap<sys_menu, MenuRes>();

        #endregion
    }
}