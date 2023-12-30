import request from "../../../plugins/axios/http";
import {
  TFindRoleMenuRes,
  TRoleUpdateMenusParams,
  TRoleParams,
  TRoleRes,
} from "./role.type";

/**
 * 获取所有角色
 */
export function roleAllListApi(): Promise<AxiosResponseDataType<TRoleRes[]>> {
  return request({
    url: "/role/admin/findallrole",
    isAuth: true,
    method: "GET",
  });
}

/**
 * 删除某个角色
 */
export function delRoleApi(
  roleId: number
): Promise<AxiosResponseDataType<TRoleRes>> {
  return request({
    url: `/role/admin/removerolecategory/${roleId}`,
    isAuth: true,
    method: "DELETE",
  });
}

/**
 * 添加某个角色
 */
export function addRoleApi(
  params: Omit<TRoleParams, "role_id">
): Promise<AxiosResponseDataType<string>> {
  return request({
    url: "/role/admin/addrolecategory",
    isAuth: true,
    method: "POST",
    data: params,
  });
}

/**
 * 修改某个角色
 */
export function putRoleApi(
  params: TRoleParams
): Promise<AxiosResponseDataType<string>> {
  return request({
    url: "/role/admin/putrolecategory",
    isAuth: true,
    method: "PUT",
    data: params,
  });
}

/**
 * 查找某角色拥有的菜单
 */
export function findRoleMenusApi(
  roleId: number
): Promise<AxiosResponseDataType<TFindRoleMenuRes[]>> {
  return request({
    url: `/menu/admin/readroleallmenu/${roleId}`,
    method: "GET",
    isAuth: true,
  });
}

/**
 * 为某角色批量添加菜单
 */
export function roleUpdateMenusApi(
  body: TRoleUpdateMenusParams
): Promise<AxiosResponseDataType<string>> {
  return request({
    url: `/menu/admin/roleupdatemenus`,
    method: "POST",
    isAuth: true,
    data: body,
  });
}
