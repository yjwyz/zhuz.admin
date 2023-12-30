using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Zhuz.net.BaseModels.Role;
using Zhuz.net.BaseModels.RoleList;
using Zhuz.net.BaseServices;
using Zhuz.net.SysHelpers;
using Zhuz.net.SysMiddleware.SysRequirements;
using Zhuz.net.SysModels.Result;
using Zhuz.net.SysServices;
using Zhuz.net.ZhuzEntitys;

namespace Zhuz.net.BaseControllers;


#region 用户级路由

[ApiController]
[Route("role/auth")]
public class RoleAuthController : ControllerBase
{
    private readonly IRoleService _roleService;
    private readonly ISysCommonService _sysCommonService;
    public RoleAuthController(IRoleService roleService,ISysCommonService sysCommonService)
    {
        _roleService = roleService;
        _sysCommonService = sysCommonService;
    }
    /// <summary>
    /// 获取当前用户的所有角色
    /// </summary>
    /// <returns></returns>
    [HttpGet("getcurrentuserrole")]
    [Authorize(Policy = SysPolicyInfo.User)]
    public async Task<SysResultModel<List<sys_role>>> GetCurrentRoles()
    {
        int sid = _sysCommonService.GetTokenSid(HttpContext);
        bool isAdmin =await _sysCommonService.IsAdmin(sid);
        List<sys_role> rolels;
        if (isAdmin)
        {
            rolels= await _roleService.ReadAllRoles();
        }
        else
        {
            rolels= await _roleService.ReadUserHasRoles(sid);
        }
        return SysResultHelper<List<sys_role>>.Ok(rolels);
    }
}


#endregion


#region 超管级路由

[ApiController]
[Route("role/admin")]
public class RoleAdminController:ControllerBase
{
    private readonly IRoleService _roleService;
    private readonly ISysCommonService _sysCommonService;
    public RoleAdminController(IRoleService roleService,ISysCommonService sysCommonService)
    {
        _roleService = roleService;
        _sysCommonService = sysCommonService;
    }
    /// <summary>
    /// 添加一个角色分类
    /// </summary>
    /// <returns></returns>
    [HttpPost("addrolecategory")]
    [Authorize(Policy = SysPolicyInfo.Admin)]
    public async Task<SysResultModel<string>> AddRoleCategory(AddRoleReq req)
    {
        await SysValidatorHelper.Check<AddRoleReq>(new AddRoleVali(), req);
        string roleName = await _roleService.AddRoleCategory(req);
        return SysResultHelper<string>.Ok(roleName, "添加成功");
    }
    /// <summary>
    /// 删除一个角色分类
    /// </summary>
    /// <param name="roleId"></param>
    /// <returns></returns>
    [HttpDelete("removerolecategory/{roleId}")]
    [Authorize(Policy = SysPolicyInfo.Admin)]
    public async Task<SysResultModel<string>> DelRoleCategory(int roleId)
    {
        string roleName = await _roleService.DelRoleCategory(roleId);
        return SysResultHelper<string>.Ok("", $"角色-{roleName}-已被删除!");
    }
    /// <summary>
    /// 修改一个角色分类
    /// </summary>
    /// <param name="req"></param>
    /// <returns></returns>
    [HttpPut("putrolecategory")]
    [Authorize(Policy = SysPolicyInfo.Admin)]
    public async Task<SysResultModel<sys_role>> PutRoleCategory(PutRoleReq req)
    {
        await SysValidatorHelper.Check(new PutRoleVali(), req);
        sys_role role = await _roleService.PutRoleCategory(req);
        return SysResultHelper<sys_role>.Ok(role,"修改成功!");
    }
    /// <summary>
    /// 查看单个角色信息
    /// </summary>
    /// <param name="roleId"></param>
    /// <returns></returns>
    [HttpGet("findrole/{roleId}")]
    [Authorize(Policy = SysPolicyInfo.Admin)]
    public async Task<SysResultModel<sys_role>> ReadRoleCategory(int roleId)
    {
        sys_role role = await _roleService.ReadRoleCategory(roleId);
        return SysResultHelper<sys_role>.Ok(role);
    }
    /// <summary>
    /// 查看所有的角色信息
    /// </summary>
    /// <returns></returns>
    [HttpGet("findallrole")]
    [Authorize(Policy = SysPolicyInfo.Admin)]
    public async Task<SysResultModel<List<sys_role>>> ReadAllRoles()
    {
        List<sys_role> roles = await _roleService.ReadAllRoles();
        return SysResultHelper<List<sys_role>>.Ok(roles);
    }

    /// <summary>
    /// 为某个账户添加某个角色
    /// </summary>
    /// <returns></returns>
    [HttpPost("addroletheuser")]
    [Authorize(Policy = SysPolicyInfo.Admin)]
    public async Task<SysResultModel<sys_role_list>> AddRolel(AddRoleListReq req)
    {
        await SysValidatorHelper.Check<AddRoleListReq>(new AddRoleListVali(), req);
        sys_role_list rolel = await _roleService.AddRolelist(req);
        return SysResultHelper<sys_role_list>.Ok(rolel);
    }
    /// <summary>
    /// 删除某账号的某个角色
    /// </summary>
    /// <param name="req"></param>
    /// <returns></returns>
    [HttpPost("delroletheuser")]
    [Authorize(Policy = SysPolicyInfo.Admin)]
    public async Task<SysResultModel<sys_role_list>> DelRolel(DelRoleListReq req)
    {
        await SysValidatorHelper.Check<DelRoleListReq>(new DelRoleListVali(), req);
        sys_role_list rolel = await _roleService.DelRolelist(req);
        
        return SysResultHelper<sys_role_list>.Ok(rolel, "删除成功!");
    }
    /// <summary>
    /// 查找某用户拥有的所有角色
    /// </summary>
    /// <param name="userId"></param>
    /// <returns></returns>
    [HttpGet("getuserallrole/{userId}")]
    [Authorize(Policy = SysPolicyInfo.Admin)]
    public async Task<SysResultModel<List<sys_role>>> ReadUserAllRoles(int userId)
    {
        bool isAdmin =await _sysCommonService.IsAdmin(userId);
        List<sys_role> rolels;
        if (isAdmin)
        {
            rolels= await _roleService.ReadAllRoles();
        }
        else
        {
            rolels = await _roleService.ReadUserHasRoles(userId);
        }
        return SysResultHelper<List<sys_role>>.Ok(rolels);
    }
}

#endregion