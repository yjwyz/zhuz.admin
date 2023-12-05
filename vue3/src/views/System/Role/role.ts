import type { FormInstance, FormRules } from "element-plus";
import {
  appMessage_ElConfirm,
  appMessage_ElNotificationBox,
} from "../../../plugins/extends/zhuz_message";
import {
  addRoleApi,
  delRoleApi,
  findRoleMenusApi,
  putRoleApi,
  roleUpdateMenusApi,
  roleAllListApi,
} from "./role.api";
import { TRoleRes } from "./role.type";
import { findAllMenusApi } from "../Menu/menu.api";
import { MenuType } from "../Menu/menu.type";

export const tableRoleList = ref<TRoleRes[]>([]);
export const dialogForm = reactive<TRoleRes>({} as TRoleRes);
export const loading = ref(false);
export const treeRef = ref();
export const dialogFormRule: FormRules<TRoleRes> = {
  role_name: [{ required: true, message: "请填写角色名~" }],
};
export const dialogVisible = ref(false);
export const dialogFenpeiVisible = ref(false);
export const isEdit = ref(false);
export const dialogFormRef = ref<FormInstance>();
export const treeDefaultProps = {
  children: "children",
  label: "menu_name",
};
export const treeDefaultCheckList = ref<number[]>([]);
export const treeData = ref<MenuType[]>([]);

/**
 * 分配事件
 */
export async function fenpeiBtnHandle(row: TRoleRes) {
  if (!row.id) {
    appMessage_ElConfirm("请先选择要分配的角色!", "warning");
    return;
  }
  try {
    loading.value = true;
    await _findRoleMenu(row.id);
    _resetDialogForm();
    Object.assign(dialogForm, row, {});
    loading.value = false;
    dialogFenpeiVisible.value = true;
  } catch (error) {
    loading.value = false;
    console.log(error);
  }
}

export async function refreshPage() {
  await Promise.all([_getRoleList(), _finAllMenu()]);
  appMessage_ElNotificationBox("系统提示", "刷新成功!", "success");
}

/**
 * 分配提交
 */
export async function fenpeiSubmit(el: any) {
  if (!dialogForm.id) {
    appMessage_ElConfirm("请先选择要分配的角色!", "warning");
    return;
  }
  try {
    loading.value = true;
    let checkListIds = el!.getCheckedNodes(false, false).map((v: any) => v.id);
    checkListIds = _findParentId(checkListIds, treeData.value);
    await roleUpdateMenusApi({
      menus_id: checkListIds,
      role_id: dialogForm.id,
    });
    dialogFenpeiVisible.value = false;
    loading.value = false;
  } catch (error) {
    loading.value = false;
    console.log(error);
  }
}

/**
 * 添加事件
 */
export function addBtnHandle() {
  isEdit.value = false;
  dialogVisible.value = true;
  _resetDialogForm();
}
/**
 * 编辑事件
 */
export function editBtnHandle(row: TRoleRes) {
  if (!row.id) {
    appMessage_ElConfirm("请先选择要编辑的角色!", "warning");
    return;
  }

  isEdit.value = true;
  dialogVisible.value = true;
  _resetDialogForm();
  Object.assign(dialogForm, row, {});
}

/**
 * dialog确认提交
 */
export async function dialogConfirmBtnHandle(formEl: FormInstance | undefined) {
  if (!formEl) return;
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      if (isEdit.value) {
        await _editRole();
      } else {
        await _addRole();
      }
      dialogVisible.value = false;
      _resetDialogForm();
    }
  });
}

/**
 * 删除事件
 */
export function delBtnHandle(row: TRoleRes) {
  if (!row.id) {
    appMessage_ElConfirm("请先选择要删除的角色!", "warning");
    return;
  }
  appMessage_ElConfirm(
    `请再次确认是否要删除此角色?\n角色名:${row.role_name}`,
    "info",
    () => {
      delRoleApi(row.id)
        .then((res) => {
          appMessage_ElNotificationBox("系统提示", res.message, "success");
          _getRoleList();
        })
        .catch((e) => {
          console.log(e);
        });
    },
    undefined,
    true
  );
}

/**
 * table 单行点击事件
 */
export function tableRowClickHandle(row: any, column: any) {
  Object.assign(dialogForm, row, {});
}

export function initPage() {
  _getRoleList();
  _finAllMenu();
}

async function _getRoleList() {
  const result = await roleAllListApi();
  tableRoleList.value = result.data;
}

function _resetDialogForm() {
  dialogFormRef.value?.resetFields();
  dialogForm.id = 0;
  dialogForm.role_name = "";
}

async function _editRole() {
  if (!dialogForm.id) {
    appMessage_ElConfirm("此角色没有ID,无法编辑!", "warning");
    return;
  }
  const res = await putRoleApi({
    role_id: dialogForm.id,
    role_name: dialogForm.role_name,
  });
  _getRoleList();
  appMessage_ElNotificationBox("系统提示", res.message, "success");
}

async function _addRole() {
  const res = await addRoleApi({
    role_name: dialogForm.role_name,
  });
  _getRoleList();
  appMessage_ElNotificationBox("系统提示", res.message, "success");
}

async function _findRoleMenu(roleId: number) {
  const result = await findRoleMenusApi(roleId);
  treeDefaultCheckList.value.splice(0, treeDefaultCheckList.value.length);

  treeDefaultCheckList.value = _filterApiCheckParentId(
    result.data.map((v) => v.id),
    treeData.value
  );
}

async function _finAllMenu() {
  const result = await findAllMenusApi();
  treeData.value = result.data;
}

/**
 * fix: 因为选中的菜单中,存在未勾选的子项时父id是没有的,这是不行的,所有需要将那些没有获取到的父id补上
 */
function _findParentId(
  currentIds: number[],
  data: MenuType[],
  parentId: number = 0
) {
  for (const item of data) {
    if (parentId) {
      const ischecked = currentIds.includes(item.id); // 是否被选中
      if (ischecked) {
        const hasParent = currentIds.includes(parentId); // 如果被选中,父id是否存在
        if (!hasParent) {
          // 没有的话需要加上
          currentIds.push(parentId);
        }
      }
    }
    if (item.children && item.children.length) {
      currentIds = _findParentId(currentIds, item.children, item.id);
    }
  }
  return currentIds;
}

/**
 * fix: 因为选中的菜单中,存在未勾选的子项,但是在提交的时候会将父节点也保存,所以在展示树形数据时需要将子节点位选全的父节点从默认选中中删除
 */
function _filterApiCheckParentId(
  currentIds: number[],
  data: MenuType[],
  parentId: number = 0
) {
  for (const item of data) {
    if (parentId) {
      if (!currentIds.includes(item.id)) {
        // 如果没有被选中,需要将父节点从默认选中中删除
        const index = currentIds.findIndex((v) => v == parentId);
        if (index >= 0) {
          currentIds.splice(index, 1);
        }
      }
    }

    if (item.children && item.children.length) {
      currentIds = _filterApiCheckParentId(currentIds, item.children, item.id);
    }
  }
  return currentIds;
}
