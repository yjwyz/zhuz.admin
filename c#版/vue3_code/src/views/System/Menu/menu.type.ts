import { MenuApiRes } from "../../../common/perssion/perssion.type";

export type MenuType = MenuApiRes & {
  children?: MenuType[];
};

export type DialogFormType = {
  id?: number;
  description: string; // 描述
  icon: string; // 图标
  uuid: string; // 菜单id
  parent_uuid: string; // 父级菜单id
  menu_name: string; // 菜单名称
  order_num: number; // 排序
  shown: boolean; // 是否显示
  is_cache: boolean; // 是否缓存
};

export type ParentUUIDTreeType = {
  label: string;
  value: string;
  children?: ParentUUIDTreeType[];
};

export type AddMenuApiParamsType = {
  menu_name: string;
  description: string;
  icon: string;
  uuid: string;
  parent_uuid: string;
  order_num: number;
  shown: boolean;
  is_cache: boolean;
};

export type PutMenuApiParamsType = {
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
