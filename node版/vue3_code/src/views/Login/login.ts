import usePerssionStore from "../../common/perssion/perssion.pinia";
import {
  appError_CatchCallback,
  appError_Throw,
} from "../../plugins/extends/zhuz_error";
import { appMessage_ElConfirm } from "../../plugins/extends/zhuz_message";
import { appUtil_IsEmpty } from "../../plugins/extends/zhuz_utils";
import { GetCaptchaApi } from "./login.api";
import { LoginApiParam, RegisterApiParam } from "./login.type";
import type { FormInstance, FormRules } from "element-plus";
import { Fail, Success } from "@/constants/error_code.ts";

export const loginFormRef = ref();
export const registerFormRef = ref();
export const currentTab = ref("login");
export const loading = ref(false);
export const formData = reactive({
  username: "",
  password: "",
} as LoginApiParam);

const perssionStore = usePerssionStore();

export const formDataRule: FormRules<LoginApiParam> = {
  username: [
    { required: true, message: "您忘记填写用户名了!", trigger: "blur" },
  ],
  password: [{ required: true, message: "您忘记填写密码了!", trigger: "blur" }],
  code: [{ required: true, message: "您忘记填写验证码了!", trigger: "blur" }],
};

export const registerFormData = reactive<RegisterApiParam>({
  username: "",
  password: "",
  repeat_password: "",
  code: "",
  uuid: "",
});

export const registerFormDataRule: FormRules<RegisterApiParam> = {
  username: [
    { required: true, message: "您忘记填写用户名了!", trigger: "blur" },
  ],
  password: [{ required: true, message: "您忘记填写密码了!", trigger: "blur" }],
  code: [{ required: true, message: "您忘记填写验证码了!", trigger: "blur" }],
  repeat_password: [
    { required: true, message: "您忘记填写确认密码了!", trigger: "blur" },
  ],
  uuid: [{ required: true, message: "您忘记填写UUID了!", trigger: "blur" }],
};

export const captchaImg = ref("");

// 登录
export async function login(formEl: FormInstance | undefined) {
  if (!formEl) return;
  try {
    await formEl.validate((valid) => {
      if (valid) {
        if (appUtil_IsEmpty(formData.uuid)) {
          appError_Throw("此次登录缺少UID!");
        }
        loading.value = true;
        perssionStore
          .login({
            code: formData.code,
            password: formData.password,
            username: formData.username,
            uuid: formData.uuid,
          })
          .catch((e) => {
            if (e.code == Fail) {
              GetCaptcha();
            }
          })
          .finally(() => {
            loading.value = false;
          });
      }
    });
  } catch (error) {
    appError_CatchCallback((error as any).toString(), (msg) => {
      appMessage_ElConfirm(msg, "warning");
    });
  }
}

// 注册
export async function register(formEl: FormInstance | undefined) {
  if (!formEl) return;
  try {
    await formEl.validate((valid) => {
      if (valid) {
        if (appUtil_IsEmpty(registerFormData.uuid)) {
          appError_Throw("此次注册缺少UID!");
        }
        loading.value = true;
        perssionStore
          .register(registerFormData)
          .then((res) => {
            if (res.code == Success) {
              appMessage_ElConfirm("注册成功,可前往登录!", "success", () => {
                currentTab.value = "login";
                GetCaptcha();
              });
            }
          })
          .catch((e) => {
            if (e.code == Fail) {
              GetCaptcha();
            }
          })
          .finally(() => {
            loading.value = false;
          });
      }
    });
  } catch (error) {
    appError_CatchCallback((error as any).toString(), (msg) => {
      appMessage_ElConfirm(msg, "warning");
    });
  }
}

export function initPage() {
  GetCaptcha();
}

// 获取验证码
export async function GetCaptcha() {
  const result = await GetCaptchaApi();
  formData.uuid = result.headers["x-uuid"];
  registerFormData.uuid = result.headers["x-uuid"];
  captchaImg.value = window.URL.createObjectURL(result.data);
}

export function dispose() {
  window.URL.revokeObjectURL(captchaImg.value);
}
