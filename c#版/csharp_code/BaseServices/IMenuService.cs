using Zhuz.net.BaseModels.Menu;
using Zhuz.net.BaseModels.MenuList;
using Zhuz.net.ZhuzEntitys;

namespace Zhuz.net.BaseServices;

public interface IMenuService
{
    /// <summary>
    /// 添加一条菜单
    /// </summary>
    /// <param name="req"></param>
    /// <returns></returns>
    public Task<sys_menu> AddMenu(BaseAddMenuReq req);
    /// <summary>
    /// 删除一条菜单
    /// </summary>
    /// <param name="menuId"></param>
    /// <returns></returns>
    public Task<sys_menu> DelMenu(int menuId);
    /// <summary>
    /// 修改一条菜单
    /// </summary>
    /// <param name="req"></param>
    /// <returns></returns>
    public Task<sys_menu> PutMenu(PutMenuReq req);
    /// <summary>
    /// 查看一条菜单
    /// </summary>
    /// <param name="menuId"></param>
    /// <returns></returns>
    public Task<sys_menu> ReadMenu(int menuId);
    /// <summary>
    /// 查看所有的菜单
    /// </summary>
    /// <returns></returns>
    public Task<List<MenuRes>> ReadAllMenu(bool isTree);
    /// <summary>
    /// 为某角色批量更新菜单
    /// </summary>
    /// <param name="req"></param>
    /// <returns></returns>
    public Task<string> RolePutMenus(PutMenuListReq req);
    /// <summary>
    /// 为某角色批量删除某些菜单
    /// </summary>
    /// <param name="req"></param>
    /// <returns></returns>
    public Task<string> RoleDelMenus(PutMenuListReq req);
    /// <summary>
    /// 查找某角色拥有的菜单
    /// </summary>
    /// <param name="roleId"></param>
    /// <returns></returns>
    public Task<List<MenuRes>> RoleHasMenus(int roleId);
    /// <summary>
    /// 查找某用户拥有的菜单
    /// </summary>
    /// <param name="userId"></param>
    /// <returns></returns>
    public Task<List<MenuRes>> ReadUserHasMenus(int userId);
} 