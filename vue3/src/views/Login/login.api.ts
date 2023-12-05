import { AxiosResponse } from "axios";
import request from "../../plugins/axios/http";
import { LoginApiParam } from "./login.type";

// 获取验证码
export function GetCaptchaApi(): Promise<AxiosResponse<Blob, any>> {
  return request({
    url: "/user/release/getcaptcha",
    method: "GET",
    isResHeader: true,
    responseType: "blob",
  });
}

// 登录
export function loginApi(
  params: LoginApiParam
): Promise<AxiosResponseDataType<string>> {
  return request({
    url: "/user/release/login",
    method: "POST",
    data: params,
  });
}
