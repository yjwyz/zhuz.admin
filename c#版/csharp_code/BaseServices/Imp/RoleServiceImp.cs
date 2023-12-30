using SqlSugar;
using Zhuz.net.BaseModels.Role;
using Zhuz.net.BaseModels.RoleList;
using Zhuz.net.SysConstants;
using Zhuz.net.SysModels.Result;
using Zhuz.net.ZhuzEntitys;

namespace Zhuz.net.BaseServices;

public class RoleServiceImp:IRoleService
{
    private readonly ISqlSugarClient _sqlSugarClient;
    public RoleServiceImp(ISqlSugarClient sqlSugarClient)
    {
        _sqlSugarClient = sqlSugarClient;
    }
    public async Task<string> AddRoleCategory(AddRoleReq req)
    {
        sys_role? role = await _sqlSugarClient.Queryable<sys_role>().FirstAsync(it => it.role_name == req.role_name);
        if (role != null)
        {
            throw new Exception("此角色已经存在!");
        }

        sys_role? newRole = await _sqlSugarClient.Insertable<sys_role>(new sys_role
        {
            role_name = req.role_name
        }).ExecuteReturnEntityAsync();
        return newRole.role_name;
    }

    public async Task<string> DelRoleCategory(int roleId)
    {
        sys_role? role = await _sqlSugarClient.Queryable<sys_role>().FirstAsync(it => it.id == roleId);
        if (role == null)
        {
            throw new Exception("这是一个无效的角色!");
        }

        if (role.role_name == InitDbData.AdminRoleName)
        {
            throw new Exception(SysResultStatusText.DisSkipLevelOperation);
        }
        int rowNum = await _sqlSugarClient.Deleteable<sys_role>(role).ExecuteCommandAsync();
        if (rowNum <= 0)
        {
            throw new Exception("删除失败!");
        }
        return role.role_name;
    }

    public async Task<sys_role> PutRoleCategory(PutRoleReq req)
    {
        sys_role? role = await _sqlSugarClient.Queryable<sys_role>().FirstAsync(it => it.id == req.role_id);
        if (role == null)
        {
            throw new Exception("这是一个无效的角色!");
        }
        if (role.role_name == InitDbData.AdminRoleName)
        {
            throw new Exception(SysResultStatusText.DisSkipLevelOperation);
        }
        role.role_name = req.role_name;
        int rowNum = await _sqlSugarClient.Updateable<sys_role>(role).UpdateColumns(it=>new {it.role_name}).ExecuteCommandAsync();
        if (rowNum <= 0)
        {
            throw new Exception("更新了0条记录!");
        }

        return role;
    }

    public async Task<sys_role> ReadRoleCategory(int roleId)
    {
        sys_role? role = await _sqlSugarClient.Queryable<sys_role>().FirstAsync(it => it.id == roleId);
        if (role == null)
        {
            throw new Exception("这是一个无效的角色!");
        }
        return role;
    }

    public async Task<List<sys_role>> ReadAllRoles()
    {
        List<sys_role> roles = await _sqlSugarClient.Queryable<sys_role>().ToListAsync();
        return roles;
    }

    public async Task<sys_role_list> AddRolelist(AddRoleListReq req)
    {
        sys_role? role = await _sqlSugarClient.Queryable<sys_role>().FirstAsync(it => it.id == req.role_id);
        if (role == null)
        {
            throw new Exception("未查询到角色信息!");
        }

        if (role.role_name == InitDbData.AdminRoleName)
        {
            throw new Exception(SysResultStatusText.DisSkipLevelOperation);
        }
        sys_user? user = await _sqlSugarClient.Queryable<sys_user>().FirstAsync(it => it.id == req.user_id);
        if (user == null)
        {
            throw new Exception("未查询到用户信息!");
        }
        bool isExists = await _sqlSugarClient.Queryable<sys_role_list>()
            .AnyAsync(it => it.role_id == role.id && it.user_id == user.id);
        if (isExists)
        {
            throw new Exception("此用户已经拥有该角色信息!");
        }

        sys_role_list rolel = await _sqlSugarClient.Insertable<sys_role_list>(new sys_role_list
        {
            role_id = req.role_id,
            user_id = req.user_id
        }).ExecuteReturnEntityAsync();
        return rolel;
    }

    public async Task<sys_role_list> DelRolelist(DelRoleListReq req)
    {
        sys_role? role = await _sqlSugarClient.Queryable<sys_role>().FirstAsync(it => it.id == req.role_id);
        if (role!=null&&role.role_name == InitDbData.AdminRoleName)
        {
            throw new Exception(SysResultStatusText.DisSkipLevelOperation);
        }
        sys_role_list? rolel = await _sqlSugarClient.Queryable<sys_role_list>()
            .FirstAsync(it => it.role_id == req.role_id && it.user_id == req.user_id);
        if (rolel==null)
        {
            throw new Exception("未查询到此用户的权限信息!");
        }

        int rowNum = await _sqlSugarClient.Deleteable<sys_role_list>(rolel).ExecuteCommandAsync();
        if (rowNum <= 0)
        {
            throw new Exception("删除了0条记录!");
        }

        return rolel;
    }

    public async Task<List<sys_role>> ReadUserHasRoles(int userId)
    {
        List<sys_role> rolels = await _sqlSugarClient.Queryable<sys_role_list>().Where((rl) => rl.user_id == userId)
            .LeftJoin<sys_role>(
                (rl, sl) =>
                    (rl.role_id == sl.id)).Where((rl,sl) => sl.role_name!=null).Select((rl, sl)=>new sys_role
            {
                id = sl.id,
                role_name = sl.role_name
            }).ToListAsync();
        return rolels;
    }
}