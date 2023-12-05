import request from "../../../plugins/axios/http";
import {
  TDeleteUserRoleParams,
  TFindAllRoleRes,
  TFindUserHasRoleRes,
  TUserAddRoleParam,
  TUserRes,
} from "./user.type";

/**
 * 获取所有用户列表
 */
export function findAllUserApi(): Promise<AxiosResponseDataType<TUserRes[]>> {
  return request({
    url: "/user/admin/readallusers",
    method: "GET",
    isAuth: true,
  });
}

/**
 * 禁用冻结某个账号
 */
export function disableUserApi(
  userId: number
): Promise<AxiosResponseDataType<string>> {
  return request({
    url: `/user/admin/disuser/${userId}`,
    method: "PUT",
    isAuth: true,
  });
}

/**
 * 解冻某个账号
 */
export function relieveUserApi(
  userId: number
): Promise<AxiosResponseDataType<string>> {
  return request({
    url: `/user/admin/enbuser/${userId}`,
    method: "PUT",
    isAuth: true,
  });
}

/**
 * 获取所有角色信息
 */
export function findAllRoleApi(): Promise<
  AxiosResponseDataType<TFindAllRoleRes[]>
> {
  return request({
    url: `/role/admin/findallrole`,
    method: "GET",
    isAuth: true,
  });
}

/**
 * 为某个账户添加某个角色
 */
export function userAddRoleApi(
  params: TUserAddRoleParam
): Promise<AxiosResponseDataType<any>> {
  return request({
    url: `/role/admin/addroletheuser`,
    method: "POST",
    isAuth: true,
    data: params,
  });
}

/**
 * 删除账户某个角色
 */
export function deleteUserRoleApi(
  params: TDeleteUserRoleParams
): Promise<AxiosResponseDataType<any>> {
  return request({
    url: `/role/admin/delroletheuser`,
    method: "POST",
    isAuth: true,
    data: params,
  });
}

/**
 * 查看账户拥有的角色
 */
export function findUserHasRole(
  userId: number
): Promise<AxiosResponseDataType<TFindUserHasRoleRes[]>> {
  return request({
    url: `/role/admin/getuserallrole/${userId}`,
    method: "GET",
    isAuth: true,
  });
}
