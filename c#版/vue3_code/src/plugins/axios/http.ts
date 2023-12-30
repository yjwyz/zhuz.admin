import Axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import {
  appMessage_ElConfirm,
  appMessage_ElNotificationBox,
} from "../extends/zhuz_message";
import {
  BadFail,
  BadFailMsg,
  Fail,
  Forbidden,
  ForbiddenMsg,
  NoAuth,
  NotFound,
  NotFoundMsg,
} from "../../constants/error_code";
import usePerssionStore from "../../common/perssion/perssion.pinia";
const request = Axios.create({
  baseURL: "/api",
  // timeout: 3000,
});

request.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (config.isAuth) {
      const token = usePerssionStore().token;
      if (token) {
        config.headers["Authorization"] = "Bearer " + token;
      }
    }
    return config;
  },
  (error: AxiosError) => {
    console.log("请求异常", error);
    return error;
  }
);
let isNoAuthPopupShown = false; // 添加标志位

request.interceptors.response.use(
  (response: AxiosResponse) => {
    if (response.config.isResHeader) {
      return response;
    } else {
      const res: AxiosResponseDataType<any> = response.data;
      switch (res.code) {
        case Fail:
          appMessage_ElNotificationBox("系统提示", res.message, "warning");
          return Promise.reject(response.data);
        case NoAuth:
          if (!isNoAuthPopupShown) {
            // 检查标志位
            isNoAuthPopupShown = true; // 设置标志位为已弹出
            appMessage_ElConfirm(
              "抱歉,您其中一个请求并没有权限访问!",
              "error",
              () => {
                usePerssionStore().loginOut();
                isNoAuthPopupShown = false; // 重新设置标志位
              },
              "",
              false,
              {
                closeOnClickModal: false,
                showClose: false,
                confirmButtonText: "重新登录",
              }
            );
          }
          return Promise.reject(response.data);
          break;
        case Forbidden:
          appMessage_ElNotificationBox("系统提示", ForbiddenMsg, "warning");
          return Promise.reject(response.data);
          break;
        case BadFail:
          appMessage_ElNotificationBox("系统提示", BadFailMsg, "warning");
          return Promise.reject(response.data);
          break;
        case NotFound:
          appMessage_ElNotificationBox("系统提示", NotFoundMsg, "warning");
          return Promise.reject(response.data);
          break;
        default:
          break;
      }
      return response.data;
    }
  },
  (res) => {
    console.log("响应异常", res);
    const { response } = res;
    if (res.message.indexOf("timeout") >= 0) {
      appMessage_ElNotificationBox("系统提示", "请求超时!", "warning");
      return Promise.reject("请求超时!");
    } else if (
      response.status == 500 &&
      response.statusText.indexOf("Server Error") >= 0
    ) {
      appMessage_ElNotificationBox("系统提示", "与服务器通信失败!", "warning");
      usePerssionStore().loginOut();
    }

    const resData = response.data as AxiosResponseDataType<any>;

    return Promise.reject(resData);
  }
);

export default request;
