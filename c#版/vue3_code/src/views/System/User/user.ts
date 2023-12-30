import {
  appMessage_ElConfirm,
  appMessage_ElNotificationBox,
} from "../../../plugins/extends/zhuz_message";
import {
  deleteUserRoleApi,
  disableUserApi,
  findAllRoleApi,
  findAllUserApi,
  findUserHasRoleApi,
  relieveUserApi,
  userAddRoleApi,
  userToRootApi,
  userRemoveRootApi,
} from "./user.api";
import {
  TFindAllRoleRes,
  TFindUserHasRoleRes,
  TUserAddRoleParam,
  TUserRes,
} from "./user.type";

export const tableData = ref<TUserRes[]>();
export const roleFormData = reactive<TUserAddRoleParam>(
  {} as TUserAddRoleParam
);
export const roleList = ref<TFindAllRoleRes[]>([]);
export const hasRoleList = ref<TFindUserHasRoleRes[]>([]);
export const dialogVisible = ref(false);
export const dialogTitle = ref("设置角色");

export function initPage() {
  _getUserList();
  _getAllRole();
}

/**
 * 冻结按钮事件
 */
export function disableBtnHandle(row: TUserRes) {
  if (!row.id) {
    appMessage_ElConfirm("此项没有ID,无法操作!", "warning");
    return;
  }
  appMessage_ElConfirm(
    `请再次确认是否要冻结此账户?\n账户名:${row.user_name}`,
    "info",
    async () => {
      await _disableUser(row.id);
      _getUserList();
    },
    undefined,
    true
  );
}

/**
 * tag关闭事件
 */
export async function tagCloseBtnHandle(roleId: number) {
  try {
    if (!roleFormData.user_id) {
      appMessage_ElConfirm("此项没有用户ID,无法操作!", "warning");
      return;
    }
    const result = await deleteUserRoleApi({
      role_id: roleId,
      user_id: roleFormData.user_id,
    });
    appMessage_ElNotificationBox("系统提示", result.message, "success");
    _getUserRole(roleFormData.user_id);
  } catch (error) {}
}

/**
 * tag添加事件
 */
export async function tagaddBtnHandle() {
  try {
    if (!roleFormData.user_id) {
      appMessage_ElConfirm("此项没有用户ID,无法操作!", "warning");
      return;
    }
    const result = await userAddRoleApi({
      role_id: roleFormData.role_id,
      user_id: roleFormData.user_id,
    });
    appMessage_ElNotificationBox("系统提示", result.message, "success");
    _getUserRole(roleFormData.user_id);
  } catch (error) {}
}

/**
 * 设置角色按钮事件
 */
export async function editRoleBtnHandle(row: TUserRes) {
  if (!row.id) {
    appMessage_ElConfirm("此项没有用户ID,无法操作!", "warning");
    return;
  }
  try {
    dialogTitle.value = "正在设置账号为[ " + row.user_name + " ]的角色信息!";
    await _getUserRole(row.id);
    roleFormData.user_id = row.id;
    dialogVisible.value = true;
  } catch (error) {
    console.log(error);
  }
}
/**
 * 设为超管按钮事件
 */
export async function editUserToRoot(row: TUserRes) {
  if (!row.id) {
    appMessage_ElConfirm("此项没有用户ID,无法操作!", "warning");
    return;
  }
  try {
    await _userToRoot(row.id);
    _getUserList();
  } catch (error) {
    console.log(error);
  }
}

/**
 * 撤销超管按钮事件
 */
export async function editUserRemoveRoot(row: TUserRes) {
  if (!row.id) {
    appMessage_ElConfirm("此项没有用户ID,无法操作!", "warning");
    return;
  }
  try {
    await _userRemoveRoot(row.id);
    _getUserList();
  } catch (error) {
    console.log(error);
  }
}

/**
 * 解冻按钮事件
 */
export async function relieveBtnHandle(row: TUserRes) {
  if (!row.id) {
    appMessage_ElConfirm("此项没有ID,无法操作!", "warning");
    return;
  }
  await _relieveUser(row.id);
  _getUserList();
}

export async function refreshPage() {
  try {
    await Promise.all([_getUserList(), _getAllRole()]);
    appMessage_ElNotificationBox("系统提示", "刷新成功!", "success");
  } catch (error) {
    console.log(error);
  }
}

/**
 * 冻结某账户
 */
async function _disableUser(userId: number) {
  try {
    const res = await disableUserApi(userId);
    appMessage_ElNotificationBox("系统提示", res.message, "success");
  } catch (error) {
    console.log(error);
  }
}

/**
 * 解冻某账户
 */
async function _relieveUser(userId: number) {
  try {
    const res = await relieveUserApi(userId);
    appMessage_ElNotificationBox("系统提示", res.message, "success");
  } catch (error) {
    console.log(error);
  }
}

/**
 * 获取所有角色
 */
async function _getAllRole() {
  const result = await findAllRoleApi();
  roleList.value = result.data;
}

/**
 * 获取用户列表
 */
async function _getUserList() {
  const result = await findAllUserApi();
  tableData.value = result.data;
}

/**
 * 获取某账号的角色
 */
async function _getUserRole(userId: number) {
  const result = await findUserHasRoleApi(userId);
  hasRoleList.value = result.data;
}

/**
 * 将某账号设置成为超管
 */
async function _userToRoot(userId: number) {
  const result = await userToRootApi(userId);
  if (result.code == 1200) {
    appMessage_ElNotificationBox("系统提示", result.message, "success");
  }
}

/**
 * 将某账号撤销超管身份
 */
async function _userRemoveRoot(userId: number) {
  const result = await userRemoveRootApi(userId);
  if (result.code == 1200) {
    appMessage_ElNotificationBox("系统提示", result.message, "success");
  }
}
