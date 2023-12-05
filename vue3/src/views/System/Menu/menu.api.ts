import request from "../../../plugins/axios/http";
import {
  AddMenuApiParamsType,
  MenuType,
  PutMenuApiParamsType,
} from "./menu.type";

/**
 * 获取所有菜单
 */
export function findAllMenusApi(): Promise<AxiosResponseDataType<MenuType[]>> {
  return request({
    url: "/menu/admin/findallmenu",
    method: "GET",
    isAuth: true,
  });
}

/**
 * 添加一条菜单
 */
export function addMenuApi(
  params: AddMenuApiParamsType
): Promise<AxiosResponseDataType<MenuType>> {
  return request({
    url: "/menu/admin/addonemenu",
    method: "POST",
    isAuth: true,
    data: params,
  });
}

/**
 * 删除菜单
 */
export function delMenuApi(
  menuId: number
): Promise<AxiosResponseDataType<string>> {
  return request({
    url: `/menu/admin/delonemenu/${menuId}`,
    method: "DELETE",
    isAuth: true,
  });
}

/**
 * 修改菜单
 */
export function putMenuApi(
  params: PutMenuApiParamsType
): Promise<AxiosResponseDataType<string>> {
  return request({
    url: `/menu/admin/putmenu`,
    method: "PUT",
    isAuth: true,
    data: params,
  });
}
