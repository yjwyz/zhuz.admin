import { CreateMenuReq } from '../../types/dto/SysMenuDto';

const menus: CreateMenuReq[] = [
  {
    description: '一些内置的设置',
    icon: 'setting',
    is_cache: true,
    menu_name: '系统管理',
    order_num: 3,
    parent_uuid: '',
    shown: true,
    uuid: 'system'
  },
  {
    description: '用户账号增删改查',
    icon: 'setting',
    is_cache: true,
    menu_name: '用户管理',
    order_num: 1,
    parent_uuid: 'system',
    shown: true,
    uuid: 'systemusermana'
  },
  {
    description: '菜单增删改查',
    icon: 'setting',
    is_cache: true,
    menu_name: '菜单管理',
    order_num: 6,
    parent_uuid: 'system',
    shown: true,
    uuid: 'systemmenus'
  },
  {
    description: '角色增删改查,并给角色分配菜单',
    icon: 'setting',
    is_cache: true,
    menu_name: '角色管理',
    order_num: 3,
    parent_uuid: 'system',
    shown: true,
    uuid: 'systemcrolemanage'
  }
];

export default menus;
