export type CreateMenuReq = {
  menu_name: string;
  description: string;
  icon: string;
  uuid: string;
  parent_uuid: string;
  order_num: number;
  shown: boolean;
  is_cache: boolean;
};

export type PutMenuReq = {
  id: number;
  menu_name: string;
  description: string;
  icon: string;
  uuid: string;
  parent_uuid: string;
  order_num: number;
  shown: boolean;
  is_cache: boolean;
};

export type RoleAddMenusReq = {
  role_id: number;
  menus_id: number[];
};

export type RoleDelMenusReq = RoleAddMenusReq;
