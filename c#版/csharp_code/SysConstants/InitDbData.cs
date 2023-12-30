using Zhuz.net.SysHelpers;
using Zhuz.net.ZhuzEntitys;

namespace Zhuz.net.SysConstants;

public static class InitDbData
{
    // SSS级超管账号
    public static string RootUserName { get; } = "root";

    // 超管账号
    public static string AdminUserName { get; } = "admin";

    // 超管角色名
    public static string AdminRoleName { get; } = "admin";

    // 初始用户
    public static List<sys_user> InitUsers { get; } = new List<sys_user>
    {
        new sys_user
        {
            user_name = RootUserName,
            nick_name = "root",
            password = SysCryptoHelper.EncryptPassword("123456"),
            is_admin = true
        },
        new sys_user
        {
            user_name = AdminUserName,
            nick_name = "admin",
            password = SysCryptoHelper.EncryptPassword("123456"),
            is_admin = true
        }
    };

    // 初始角色
    public static List<sys_role> InitRoles { get; } = new List<sys_role>
    {
        new sys_role
        {
            role_name = AdminRoleName
        }
    };

    // 初始菜单
    public static List<sys_menu> InitMenus { get; } = new List<sys_menu>
    {
        new sys_menu
        {
            description = "一些内置的设置",
            icon = "setting",
            is_cache = true,
            menu_name = "系统管理",
            order_num = 3,
            parent_uuid = "",
            shown = true,
            uuid = "system"
        },
        new sys_menu
        {
            description = "用户账号增删改查",
            icon = "setting",
            is_cache = true,
            menu_name = "用户管理",
            order_num = 1,
            parent_uuid = "system",
            shown = true,
            uuid = "systemusermana"
        },
        new sys_menu
        {
            description = "菜单增删改查",
            icon = "setting",
            is_cache = true,
            menu_name = "菜单管理",
            order_num = 6,
            parent_uuid = "system",
            shown = true,
            uuid = "systemmenus"
        },
        new sys_menu
        {
            description = "角色增删改查,并给角色分配菜单",
            icon = "setting",
            is_cache = true,
            menu_name = "角色管理",
            order_num = 3,
            parent_uuid = "system",
            shown = true,
            uuid = "systemcrolemanage"
        },
    };
}