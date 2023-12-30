using AutoMapper;
using SqlSugar;
using Zhuz.net.BaseModels.Menu;
using Zhuz.net.BaseModels.MenuList;
using Zhuz.net.SysConstants;
using Zhuz.net.SysModels.Result;
using Zhuz.net.ZhuzEntitys;

namespace Zhuz.net.BaseServices;

public class MenuServiceImp : IMenuService
{
    private readonly ISqlSugarClient _sqlSugarClient;
    private readonly IMapper _mapper;

    public MenuServiceImp(ISqlSugarClient sqlSugarClient, IMapper mapper)
    {
        _sqlSugarClient = sqlSugarClient;
        _mapper = mapper;
    }

    public async Task<sys_menu> AddMenu(BaseAddMenuReq req)
    {
        var wh = Expressionable.Create<sys_menu>();
        wh.Or(it => it.menu_name == req.menu_name);
        wh.Or(it => it.uuid == req.uuid);
        bool isExists = await _sqlSugarClient.Queryable<sys_menu>().Where(wh.ToExpression()).AnyAsync();
        if (isExists)
        {
            throw new Exception("此菜单已经存在!");
        }

        sys_menu newMenu = await _sqlSugarClient.Insertable<sys_menu>(new sys_menu
        {
            menu_name = req.menu_name,
            description = req.description,
            icon = req.icon,
            uuid = req.uuid,
            parent_uuid = req.parent_uuid,
            order_num = req.order_num,
            shown = req.shown,
            is_cache = req.is_cache,
        }).ExecuteReturnEntityAsync();
        return newMenu;
    }

    public async Task<sys_menu> DelMenu(int menuId)
    {
        sys_menu? menu = await _sqlSugarClient.Queryable<sys_menu>().FirstAsync(it => it.id == menuId);
        if (menu == null)
        {
            throw new Exception("未查询到菜单信息!");
        }

        bool isSysMenu = InitDbData.InitMenus.Exists(it => it.uuid == menu.uuid);
        if (isSysMenu)
        {
            throw new Exception(SysResultStatusText.DisSkipLevelOperation);
        }

        int rowNum = await _sqlSugarClient.Deleteable<sys_menu>(menu).ExecuteCommandAsync();
        if (rowNum <= 0)
        {
            throw new Exception("删除了0条记录!");
        }

        return menu;
    }

    public async Task<sys_menu> PutMenu(PutMenuReq req)
    {
        sys_menu? menu = await _sqlSugarClient.Queryable<sys_menu>().FirstAsync(it => it.id == req.id);
        if (menu == null)
        {
            throw new Exception("未查询到菜单信息!");
        }

        menu.menu_name = req.menu_name;
        menu.description = req.description;
        menu.icon = req.icon;
        menu.uuid = req.uuid;
        menu.parent_uuid = req.parent_uuid;
        menu.order_num = req.order_num;
        menu.shown = req.shown;
        menu.is_cache = req.is_cache;
        int rowNum = await _sqlSugarClient.Updateable<sys_menu>(menu).ExecuteCommandAsync();
        if (rowNum <= 0)
        {
            throw new Exception("更新了0条记录!");
        }

        return menu;
    }

    public async Task<sys_menu> ReadMenu(int menuId)
    {
        sys_menu? menu = await _sqlSugarClient.Queryable<sys_menu>().FirstAsync(it => it.id == menuId);
        if (menu == null)
        {
            throw new Exception("未查询到菜单信息!");
        }

        return menu;
    }

    public async Task<List<MenuRes>> ReadAllMenu(bool isTree)
    {
        List<sys_menu> menus = await _sqlSugarClient.Queryable<sys_menu>().ToListAsync();
        List<MenuRes> treeMenus;
        if (isTree)
        {
            treeMenus = HandleTreeMenus(_mapper.Map<List<MenuRes>>(menus));
        }
        else
        {
            treeMenus = _mapper.Map<List<MenuRes>>(menus);
        }
        return treeMenus;
    }

    public async Task<string> RolePutMenus(PutMenuListReq req)
    {
        await _sqlSugarClient.Deleteable<sys_menu_list>().Where(it => it.role_id == req.role_id).ExecuteCommandAsync();
        List<sys_menu_list> menul = req.menus_id.Select(it => new sys_menu_list
        {
            menu_id = it,
            role_id = req.role_id
        }).ToList();
        int rowN = await _sqlSugarClient.Insertable<sys_menu_list>(menul).ExecuteCommandAsync();
        return $"更新了{rowN}条记录";
    }

    public async Task<string> RoleDelMenus(PutMenuListReq req)
    {
        var wh = Expressionable.Create<sys_menu_list>();
        foreach (int menuId in req.menus_id)
        {
            wh.Or(it => it.menu_id == menuId);
        }

        int rowN = await _sqlSugarClient.Deleteable<sys_menu_list>().Where(it => it.role_id == req.role_id)
            .Where(wh.ToExpression()).ExecuteCommandAsync();

        return $"删除了{rowN}条记录";
    }

    public async Task<List<MenuRes>> RoleHasMenus(int roleId)
    {
        sys_role? role = await _sqlSugarClient.Queryable<sys_role>()
            .FirstAsync(it => it.id == roleId);
        if (role == null)
        {
            throw new Exception("未查询到角色信息!");
        }

        if (role.role_name == InitDbData.AdminRoleName)
        {
            List<MenuRes> allMenus = await ReadAllMenu(false);
            return allMenus;
        }

        List<sys_menu> menus = await _sqlSugarClient.Queryable<sys_menu_list>().Where(it => it.role_id == roleId)
            .LeftJoin<sys_menu>(
                (ml, m) => (ml.menu_id == m.id)).Select((ml, m) => new sys_menu
            {
                created_at = m.created_at,
                description = m.description,
                icon = m.icon,
                id = m.id,
                is_cache = m.is_cache,
                menu_name = m.menu_name,
                order_num = m.order_num,
                parent_uuid = m.parent_uuid,
                shown = m.shown,
                updated_at = m.updated_at,
                uuid = m.uuid
            }).ToListAsync();

        // return HandleTreeMenus(_mapper.Map<List<MenuRes>>(menus));
        return _mapper.Map<List<MenuRes>>(menus);
    }

    public async Task<List<MenuRes>> ReadUserHasMenus(int userId)
    {
        List<sys_role> roles = await _sqlSugarClient.Queryable<sys_role_list>().Where(rl => rl.user_id == userId)
            .LeftJoin<sys_role>((rl, r) => (rl.role_id == r.id)).Select((rl, r) => new sys_role
            {
                id = r.id,
                role_name = r.role_name
            }).ToListAsync();
        if (roles.Count <= 0)
        {
            return new List<MenuRes>();
        }
        var wh = Expressionable.Create<sys_menu_list>();
        foreach (sys_role role in roles)
        {
            wh.Or(ml => ml.role_id == role.id);
        }

        List<sys_menu> menus = await _sqlSugarClient.Queryable<sys_menu_list>().Where(wh.ToExpression())
            .LeftJoin<sys_menu>((ml, m) => (ml.menu_id == m.id)).Select((ml, m) =>new sys_menu
            {
                created_at = m.created_at,
                description = m.description,
                icon = m.icon,
                id = m.id,
                is_cache = m.is_cache,
                menu_name = m.menu_name,
                order_num = m.order_num,
                parent_uuid = m.parent_uuid,
                shown = m.shown,
                updated_at = m.updated_at,
                uuid = m.uuid
            }).ToListAsync();
        List<MenuRes> mapperMenus =
            _mapper.Map<List<MenuRes>>(menus.GroupBy(m => m.uuid).Select(m => m.FirstOrDefault()).ToList());
        // return HandleTreeMenus(mapperMenus);
        return mapperMenus;
    }

    /// <summary>
    ///  将平面数据处理成树形结构数据返回给前端
    /// </summary>
    /// <returns></returns>
    private List<MenuRes> HandleTreeMenus(List<MenuRes> flatList)
    {
        var lookup = flatList.ToLookup(menu => menu.parent_uuid);
        foreach (var menu in flatList)
        {
            menu.children = lookup[menu.uuid].ToList();
        }

        return flatList.Where(menu => string.IsNullOrEmpty(menu.parent_uuid)).ToList();
    }
}