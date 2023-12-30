import { MenuApiRes } from "../../../common/perssion/perssion.type";

export type TRoleRes = {
  id: number;
  role_name: string;
};

export type TRoleParams = {
  role_id: number;
  role_name: string;
};

/**
 * 查找某角色的菜单
 */
export type TFindRoleMenuRes = MenuApiRes;

/**
 * 为某角色批量添加菜单
 */
export type TRoleUpdateMenusParams = {
  role_id: number;
  menus_id: number[];
};
