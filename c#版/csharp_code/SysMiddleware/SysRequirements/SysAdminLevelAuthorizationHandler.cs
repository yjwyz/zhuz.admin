using Microsoft.AspNetCore.Authorization;
using SqlSugar;
using Zhuz.net.SysConstants;
using Zhuz.net.SysModels.SysJWT;
using Zhuz.net.SysServices;
using Zhuz.net.ZhuzEntitys;

namespace Zhuz.net.SysMiddleware.SysRequirements;

public class SysAdminLevelAuthorizationHandler:AuthorizationHandler<SysAdminLevelRequirement>
{
    private readonly ISysCommonService _sysCommonService;
    private readonly ISqlSugarClient _sqlSugarClient;
    public SysAdminLevelAuthorizationHandler(ISysCommonService sysCommonService,ISqlSugarClient sqlSugarClient)
    {
        _sysCommonService = sysCommonService;
        _sqlSugarClient = sqlSugarClient;
    }
    protected override async Task<Task> HandleRequirementAsync(AuthorizationHandlerContext context, SysAdminLevelRequirement requirement)
    {
        if (context.User.Claims.Count()!=0)
        {
            string? sidValue = context.User.Claims.FirstOrDefault(c=>c.Type==SysTokenModel.SidFieldName)?.Value;
            string? passVersion = context.User.Claims.FirstOrDefault(c=>c.Type==SysTokenModel.PassVersionFieldName)?.Value;
            if (!string.IsNullOrEmpty(sidValue)&& !string.IsNullOrEmpty(passVersion))
            {
                // redis密码版本校验
                string pv=await _sysCommonService.GetUserPassVersion(int.Parse(sidValue));
                if(pv==passVersion)
                {
                    // 存在并且没有冻结
                    sys_user? user = await _sqlSugarClient.Queryable<sys_user>()
                        .FirstAsync(it => it.id == int.Parse(sidValue));
                    if (user!=null&&!user.is_del)
                    {
                        // 如果是root则通过
                        if (user.user_name == InitDbData.RootUserName)
                        {
                            context.Succeed(requirement);
                            return Task.CompletedTask;
                        }
                        else
                        {
                            // 不是root检查是否有超管角色
                            sys_role? role = await _sqlSugarClient.Queryable<sys_role>()
                                .FirstAsync(it => it.role_name == InitDbData.AdminRoleName);
                            if (role != null)
                            {
                                bool isExists = await _sqlSugarClient.Queryable<sys_role_list>()
                                    .AnyAsync(it => it.role_id == role.id && it.user_id == user.id);
                                if (isExists)
                                {
                                    context.Succeed(requirement);
                                    return Task.CompletedTask;  
                                }
                            }
                        }
                    }
                }
            }
        }
        context.Fail();
        return Task.CompletedTask;
    }
}