export type MenuApiRes = {
  id: number;
  createdAt: string; // 创建时间
  updatedAt: string; // 跟新时间
  description: string; // 描述
  icon: string; // 图标
  uuid: string; // 菜单id
  parent_uuid: string; // 父级菜单id
  menu_name: string; // 菜单名称
  order_num: number; // 排序
  shown: boolean; // 是否显示
  is_cache: boolean; // 是否缓存
};

export type UserInfoApiRes = {
  id: number;
  user_name: string;
  nick_name: string;
  avatar: string;
  qq: string;
  wechat: string;
  email: string;
  github: string;
  updateTime: string;
};
