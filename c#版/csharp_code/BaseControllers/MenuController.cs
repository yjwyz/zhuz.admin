using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Zhuz.net.BaseModels.Menu;
using Zhuz.net.BaseModels.MenuList;
using Zhuz.net.BaseServices;
using Zhuz.net.SysHelpers;
using Zhuz.net.SysMiddleware.SysRequirements;
using Zhuz.net.SysModels.Result;
using Zhuz.net.SysServices;
using Zhuz.net.ZhuzEntitys;

namespace Zhuz.net.BaseControllers;

#region 用户级路由

[ApiController]
[Route("menu/auth")]
public class MenuAuthController : ControllerBase
{
    private readonly IMenuService _menuService;
    private readonly ISysCommonService _sysCommonService;

    public MenuAuthController(IMenuService menuService,ISysCommonService sysCommonService)
    {
        _menuService = menuService;
        _sysCommonService = sysCommonService;
    }
    /// <summary>
    /// 获取当前用户的菜单
    /// </summary>
    /// <returns></returns>
    [HttpGet("readcurrentusermenus")]
    [Authorize(Policy = SysPolicyInfo.User)]
    public async Task<SysResultModel<List<MenuRes>>> GetCurrentUserMenus()
    {
        int sid = _sysCommonService.GetTokenSid(HttpContext);
        bool isAdmin = await _sysCommonService.IsAdmin(sid);
        List<MenuRes> menus;
        if (isAdmin)
        {
            menus = await _menuService.ReadAllMenu(false);
        }
        else
        {
            menus = await _menuService.ReadUserHasMenus(sid);
        }

        return SysResultHelper<List<MenuRes>>.Ok(menus);
    }
}
#endregion

#region 超管级路由

[ApiController]
[Route("menu/admin")]
public class MenuAdminController:ControllerBase
{
    private readonly IMenuService _menuService;
    public MenuAdminController(IMenuService menuService)
    {
        _menuService = menuService;
    }
    /// <summary>
    /// 添加一条菜单
    /// </summary>
    /// <param name="req"></param>
    /// <returns></returns>
    [HttpPost("addonemenu")]
    [Authorize(Policy = SysPolicyInfo.Admin)]
    public async Task<SysResultModel<sys_menu>> AddMenu(BaseAddMenuReq req)
    {
        await SysValidatorHelper.Check<BaseAddMenuReq>(new BaseAddMenuVali(), req);
        sys_menu menu = await _menuService.AddMenu(req);
        return SysResultHelper<sys_menu>.Ok(menu);
    }
    /// <summary>
    /// 删除一条菜单
    /// </summary>
    /// <param name="menuId"></param>
    /// <returns></returns>
    [HttpDelete("delonemenu/{menuId}")]
    [Authorize(Policy = SysPolicyInfo.Admin)]
    public async Task<SysResultModel<sys_menu>> DelMenu(int menuId)
    {
        sys_menu menu = await _menuService.DelMenu(menuId);
        return SysResultHelper<sys_menu>.Ok(menu);
    }
    /// <summary>
    /// 修改一条菜单
    /// </summary>
    /// <returns></returns>
    [HttpPut("putmenu")]
    [Authorize(Policy = SysPolicyInfo.Admin)]
    public async Task<SysResultModel<sys_menu>> PutMenu(PutMenuReq req)
    {
        await SysValidatorHelper.Check<PutMenuReq>(new PutMenuVali(), req);
        sys_menu menu = await _menuService.PutMenu(req);
        return SysResultHelper<sys_menu>.Ok(menu);
    }
    /// <summary>
    /// 查询一条菜单
    /// </summary>
    /// <param name="menuId"></param>
    /// <returns></returns>
    [HttpGet("findmenu/{menuId}")]
    [Authorize(Policy = SysPolicyInfo.Admin)]
    public async Task<SysResultModel<sys_menu>> ReadMenu(int menuId)
    {
        sys_menu menu = await _menuService.ReadMenu(menuId);
        return SysResultHelper<sys_menu>.Ok(menu);
    }
    /// <summary>
    /// 查看所有的菜单信息
    /// </summary>
    /// <returns></returns>
    [HttpGet("findallmenu")]
    [Authorize(Policy = SysPolicyInfo.Admin)]
    public async Task<SysResultModel<List<MenuRes>>> ReadAllMenu()
    {
        List<MenuRes> menus = await _menuService.ReadAllMenu(true);
        return SysResultHelper<List<MenuRes>>.Ok(menus);
    }
    /// <summary>
    /// 为某角色批量更新菜单
    /// </summary>
    /// <param name="req"></param>
    /// <returns></returns>
    [HttpPost("roleupdatemenus")]
    [Authorize(Policy = SysPolicyInfo.Admin)]
    public async Task<SysResultModel<string>> PutMenuList(PutMenuListReq req)
    {
        await SysValidatorHelper.Check<PutMenuListReq>(new PutMenuListVali(), req);
        string msg = await _menuService.RolePutMenus(req);
        return SysResultHelper<string>.Ok("",msg);
    }
    /// <summary>
    /// 为某角色批量删除某些菜单
    /// </summary>
    /// <param name="req"></param>
    /// <returns></returns>
    [HttpPost("roledelmenu")]
    [Authorize(Policy = SysPolicyInfo.Admin)]
    public async Task<SysResultModel<string>> DelMenuList(PutMenuListReq req)
    {
        await SysValidatorHelper.Check<PutMenuListReq>(new PutMenuListVali(), req);
        string msg = await _menuService.RoleDelMenus(req);
        return SysResultHelper<string>.Ok("",msg);
    }
    /// <summary>
    /// 查找某角色拥有的菜单
    /// </summary>
    /// <param name="roleId"></param>
    /// <returns></returns>
    [HttpGet("readroleallmenu/{roleId}")]
    [Authorize(Policy = SysPolicyInfo.Admin)]
    public async Task<SysResultModel<List<MenuRes>>> ReadRoleHasMenus(int roleId)
    {
        List<MenuRes> menus = await _menuService.RoleHasMenus(roleId);
        return SysResultHelper<List<MenuRes>>.Ok(menus);
    }
}

#endregion