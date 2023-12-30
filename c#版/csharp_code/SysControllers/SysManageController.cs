using Microsoft.AspNetCore.Mvc;
using SqlSugar;
using Zhuz.net.SysHelpers;
using Zhuz.net.SysModels.Result;
using Zhuz.net.SysConstants;
using Zhuz.net.ZhuzEntitys;


namespace Zhuz.net.SysControllers;

[ApiController]
[Route("db")]
public class SysManageController : ControllerBase
{
    private readonly ISqlSugarClient _sqlSugarClient;

    public SysManageController(ISqlSugarClient sqlSugarClient)
    {
        _sqlSugarClient = sqlSugarClient;
    }

    /// <summary>
    /// 初始化数据库数据
    /// </summary>
    /// <param name="secret"></param>
    /// <returns></returns>
    [HttpGet("initdbbasedata/{secret}")]
    public async Task<SysResultModel<int>> InitDbDatas(string secret)
    {
        string resultString = "已成功初始化;";
        // 用户
        int oldUserCount = await _sqlSugarClient.Queryable<sys_user>().CountAsync();
        if (oldUserCount<=0)
        {
            int userCount= await _sqlSugarClient.Insertable(InitDbData.InitUsers).ExecuteCommandAsync();
            resultString += userCount + "个用户信息;";
        }
        // 角色
        int oldRoleCount = await _sqlSugarClient.Queryable<sys_role>().CountAsync();
        if (oldRoleCount <= 0)
        {
            int roleCount = await _sqlSugarClient.Insertable(InitDbData.InitRoles).ExecuteCommandAsync();
            resultString += roleCount+ "个角色信息;";
        }
         // 赋予用户角色
         sys_user oldAdminUser= await _sqlSugarClient.Queryable<sys_user>().FirstAsync(it=>it.user_name==InitDbData.AdminUserName);
         sys_role oldAdminRole = await _sqlSugarClient.Queryable<sys_role>()
             .FirstAsync(it => it.role_name == InitDbData.AdminRoleName);
         if (oldAdminUser!=null&&oldAdminRole!=null)
         {
             bool isExists = await _sqlSugarClient.Queryable<sys_role_list>().Where(it => it.role_id == oldAdminRole.id)
                 .Where(it => it.user_id == oldAdminUser.id).AnyAsync();
             if (!isExists)
             {
                 int roleLCount = await _sqlSugarClient.Insertable(new sys_role_list
                 {
                     role_id = oldAdminRole.id,
                     user_id = oldAdminUser.id
                 }).ExecuteCommandAsync();
                 resultString += "已添加1位超管账户;";
             }
         }
         // 菜单
         int menuCount = await _sqlSugarClient.Queryable<sys_menu>().CountAsync();
         if (menuCount <= 0)
         {
             await _sqlSugarClient.Insertable<sys_menu>(InitDbData.InitMenus).ExecuteCommandAsync();
         }
        return SysResultHelper<int>.Ok(1, resultString);
    }

    /// <summary>
    /// 创建数据库表
    /// </summary>
    /// <param name="secret"></param>
    [HttpGet("createbasetables/{secret}")]
    public async Task<SysResultModel<int>> InitDbTables(string secret)
    {
        if (!HasPerssion(secret))
        {
            throw new Exception("请输入正确的密钥!");
        }

        _sqlSugarClient.CodeFirst.InitTables(typeof(sys_user),typeof(sys_role),typeof(sys_role_list),typeof(sys_menu),typeof(sys_menu_list));
        return SysResultHelper<int>.Ok(1, "数据库表创建成功!");
    }

    /// <summary>
    /// 生成实体
    /// </summary>
    /// <param name="secret"></param>
    /// <returns></returns>
    [HttpGet("generateentitys/{secret}")]
    public async Task<SysResultModel<string>> GenerateEntitys(string secret)
    {
        _sqlSugarClient.DbFirst.SettingNamespaceTemplate(old =>
        {
            // return old + "\r\nusing SqlSugar;"; //追加引用SqlSugar
            return "using SqlSugar;"; 
        }).SettingPropertyTemplate((columns, temp, type) =>
        {
            var columnattribute = "\r\n           [SugarColumn({0})]";
            List<string> attributes = new List<string>();

            if (columns.IsPrimarykey) attributes.Add("IsPrimaryKey=true");
            if (columns.IsIdentity) attributes.Add("IsIdentity=true");
            if (columns.IsNullable) attributes.Add("IsNullable=true");
            
            attributes.Add($"ColumnName=\"{columns.DbColumnName}\"");
            attributes.Add($"ColumnDataType=\"{columns.DataType}\"");

            if (columns.Length != null) attributes.Add($"Length={columns.Length}");
            if (!string.IsNullOrEmpty(columns.ColumnDescription)) attributes.Add($"ColumnDescription=\"{columns.ColumnDescription}\"");
            
            columnattribute = attributes.Count > 0 ? string.Format(columnattribute, string.Join(", ", attributes)) : "";
            
            return temp.Replace("{PropertyType}", type)
                .Replace("{PropertyName}", columns.DbColumnName)
                .Replace("{SugarColumn}", columnattribute);
        }).CreateClassFile("G:\\packages.me\\pro.net\\Zhuz.net\\Zhuz.net\\ZhuzEntitys", "Zhuz.net.ZhuzEntitys");
        return SysResultHelper<string>.Ok("");
    }
    
    private bool HasPerssion(string secret)
    {
        if (string.IsNullOrEmpty(secret) || secret != "88888888")
        {
            return false;
        }

        return true;
    }
}