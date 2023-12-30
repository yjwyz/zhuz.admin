using Zhuz.net.BaseModels.Role;
using Zhuz.net.BaseModels.RoleList;
using Zhuz.net.ZhuzEntitys;

namespace Zhuz.net.BaseServices;

public interface IRoleService
{
    /// <summary>
    /// 添加一个角色分类
    /// </summary>
    /// <param name="req"></param>
    /// <returns></returns>
    public Task<string> AddRoleCategory(AddRoleReq req);
    /// <summary>
    /// 删除一个角色分类
    /// </summary>
    /// <param name="roleId"></param>
    /// <returns></returns>
    public Task<string> DelRoleCategory(int roleId);
    /// <summary>
    /// 修改一个角色分类
    /// </summary>
    /// <param name="req"></param>
    /// <returns></returns>
    public Task<sys_role> PutRoleCategory(PutRoleReq req);
    /// <summary>
    /// 查看单个角色信息
    /// </summary>
    /// <param name="roleId"></param>
    /// <returns></returns>
    public Task<sys_role> ReadRoleCategory(int roleId);
    /// <summary>
    /// 查看所有的角色信息
    /// </summary>
    /// <returns></returns>
    public Task<List<sys_role>> ReadAllRoles();
    /// <summary>
    /// 为某个账户添加某个角色
    /// </summary>
    /// <param name="req"></param>
    /// <returns></returns>
    public Task<sys_role_list> AddRolelist(AddRoleListReq req);
    /// <summary>
    /// 删除某账号的某个角色
    /// </summary>
    /// <param name="req"></param>
    /// <returns></returns>
    public Task<sys_role_list> DelRolelist(DelRoleListReq req);
    /// <summary>
    /// 查找某用户拥有的所有角色
    /// </summary>
    /// <param name="userId"></param>
    /// <returns></returns>
    public Task<List<sys_role>> ReadUserHasRoles(int userId);
}