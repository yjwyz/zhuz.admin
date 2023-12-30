import type { MessageParams, ElMessageBoxOptions } from "element-plus";
import SuccessIcon from "@/components/MessageIcons/MessageSuccessIcon.vue";
import WaningIcon from "@/components/MessageIcons/MessageWaningIcon.vue";
import WenHaoIcon from "@/components/MessageIcons/MessageWenHaoIcon.vue";
import ErrorIcon from "@/components/MessageIcons/MessageErrorIcon.vue";

export const appMessage_ElNotificationBox = (
  title = "注意",
  message = "",
  type: "success" | "warning" | "info" | "error",
  position:
    | "top-left"
    | "top-right"
    | "bottom-right"
    | "bottom-left"
    | null = null
) => {
  if (!position) {
    if (type === "success") {
      position = "bottom-right";
    } else {
      position = "bottom-left";
    }
  }
  ElNotification({
    title: title,
    message: message,
    type,
    duration: 2000,
    position: position || "top-right",
  });
};

export const appMessage_ElConfirm = (
  msg = "You have unsaved changes, save and proceed?",
  type: "success" | "warning" | "info" | "error",
  callback?: () => void,
  title?: string,
  showCancel = false,
  extend: ElMessageBoxOptions = {}
) => {
  let option: ElMessageBoxOptions = {
    title: title || "系统提示",
    distinguishCancelAndClose: true,
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    showCancelButton: showCancel,
    draggable: true,
  };
  Object.assign(option, extend);
  switch (type) {
    case "warning":
      option.icon = markRaw(WaningIcon);
      break;
    case "success":
      option.icon = markRaw(SuccessIcon);
      break;
    case "info":
      option.icon = markRaw(WenHaoIcon);
      break;
    default:
      option.icon = markRaw(ErrorIcon);
      break;
  }
  ElMessageBox.confirm(msg, "Confirm", option)
    .then(() => {
      callback && callback();
    })
    .catch(() => {});
};

export const appMessage_ElMessage = (
  msg = "You have unsaved changes, save and proceed?",
  type: "success" | "warning" | "info" | "error",
  extend: MessageParams = {}
) => {
  let option: MessageParams = {
    message: msg,
    type,
    duration: 1000,
    offset: 100,
  };
  switch (type) {
    case "success":
      option.icon = SuccessIcon;
      break;
    case "warning":
      option.icon = WaningIcon;
      break;
    case "info":
      break;
    case "error":
      option.icon = ErrorIcon;
      break;
    default:
      break;
  }
  Object.assign(option, extend);
  ElMessage(option);
};
