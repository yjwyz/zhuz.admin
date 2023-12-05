import request from "../../plugins/axios/http";
import { RegisterApiParam } from "../../views/Login/login.type";
import { MenuApiRes, UserInfoApiRes } from "./perssion.type";

// 获取当前用户菜单
export function menusApi(): Promise<AxiosResponseDataType<MenuApiRes[]>> {
  return request({
    url: "/menu/auth/readcurrentusermenus",
    method: "GET",
    isAuth: true,
  });
}

// 获取用户信息
export function userinfoApi(): Promise<AxiosResponseDataType<UserInfoApiRes>> {
  return request({
    url: "/user/auth/getuserinfo",
    method: "GET",
    isAuth: true,
  });
}

// 修改头像
export function setAvatarApi(
  params: FormData
): Promise<AxiosResponseDataType<string>> {
  return request({
    url: "/user/auth/putavatar",
    method: "PUT",
    isAuth: true,
    data: params,
  });
}

/**
 * 注册
 */
export function registerApi(
  params: RegisterApiParam
): Promise<AxiosResponseDataType<any>> {
  return request({
    url: "/user/release/register",
    method: "POST",
    isAuth: true,
    data: params,
  });
}
