import type { FormInstance, FormRules } from "element-plus";
import {
  addMenuApi,
  delMenuApi,
  findAllMenusApi,
  putMenuApi,
} from "./menu.api";
import { DialogFormType, MenuType, ParentUUIDTreeType } from "./menu.type";
import {
  appMessage_ElConfirm,
  appMessage_ElNotificationBox,
} from "../../../plugins/extends/zhuz_message";

export const tableData = ref<MenuType[]>([]);
export const tableRef = ref();
export const loading = ref(false);
export const showChooseIcon = ref(false);
export const iconSelectRef = ref(null);
export const dialogVisible = ref(false);
export const dialogFormRef = ref<FormInstance>();
export const isEdit = ref(false);
export const dialogForm = reactive<DialogFormType>({} as DialogFormType);
export const dialogFormRule: FormRules<DialogFormType> = {
  icon: [{ required: true, message: "选择图标~" }],
  menu_name: [{ required: true, message: "填写菜单名称~" }],
  uuid: [{ required: true, message: "填写UUID~" }],
  description: [{ required: true, message: "填写描述~" }],
};
export const parentUuidsTreeSelect = ref<ParentUUIDTreeType[]>();

export async function refreshPage() {
  await getMenuList();
  appMessage_ElNotificationBox("系统提示", "刷新成功!", "success");
}

/**
 * 展示下拉图标
 */
export function showSelectIcon(eve: any) {
  eve?.reset();
}

/** 选择图标 */
export function selected(name: string) {
  dialogForm.icon = name;
  showChooseIcon.value = false;
}

/**
 * 添加菜单事件
 */
export function addBtnHandle(row: MenuType) {
  isEdit.value = false;
  dialogVisible.value = true;
  _resetDialogForm();
}
/**
 * 编辑菜单事件
 */
export function editBtnHandle(row: MenuType) {
  if (!row.uuid) {
    appMessage_ElConfirm("请先选择要编辑的菜单!", "warning");
    return;
  }

  isEdit.value = true;
  dialogVisible.value = true;
  _resetDialogForm();
  Object.assign(dialogForm, row, {});
}

/**
 * table 单行点击事件
 */
export function tableRowClickHandle(row: any, column: any) {
  Object.assign(dialogForm, row, {});
}

function _resetDialogForm() {
  dialogFormRef.value?.resetFields();
  dialogForm.description = "";
  dialogForm.icon = "";
  dialogForm.icon = "";
  dialogForm.id = 0;
  dialogForm.is_cache = false;
  dialogForm.shown = false;
  dialogForm.menu_name = "";
  dialogForm.order_num = 0;
  dialogForm.uuid = "";
  dialogForm.parent_uuid = "";
}

/**
 * 删除菜单事件
 */
export function delBtnHandle(row: MenuType) {
  if (!row.uuid) {
    appMessage_ElConfirm("请先选择要删除的菜单!", "warning");
    return;
  }
  if (!row.id) {
    appMessage_ElConfirm("此菜单没有ID,无法删除!", "warning");
    return;
  }
  appMessage_ElConfirm(
    `请再次确认是否要删除此菜单?\n菜单名:${row.menu_name}`,
    "info",
    () => {
      delMenuApi(row.id)
        .then((res) => {
          appMessage_ElNotificationBox("系统提示", res.message, "success");
          getMenuList();
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
 * 添加菜单接口处理
 */
async function _addMenuApiHanlde() {
  const res = await addMenuApi({
    description: dialogForm.description ?? "",
    icon: dialogForm.icon ?? "",
    menu_name: dialogForm.menu_name,
    order_num: dialogForm.order_num || 1,
    is_cache: dialogForm.is_cache || false,
    shown: dialogForm.shown || false,
    parent_uuid: dialogForm.parent_uuid ?? "",
    uuid: dialogForm.uuid,
  });
  getMenuList();
  appMessage_ElNotificationBox("系统提示", res.message, "success");
}

/**
 * 编辑菜单接口处理
 */
async function _editMenuApiHanlde() {
  if (!dialogForm.id) {
    appMessage_ElConfirm("此菜单没有ID,无法编辑!", "warning");
    return;
  }
  const res = await putMenuApi({
    id: dialogForm.id,
    description: dialogForm.description ?? "",
    icon: dialogForm.icon ?? "",
    menu_name: dialogForm.menu_name,
    order_num: dialogForm.order_num || 1,
    is_cache: dialogForm.is_cache || false,
    shown: dialogForm.shown || false,
    parent_uuid: dialogForm.parent_uuid ?? "",
    uuid: dialogForm.uuid,
  });
  getMenuList();
  appMessage_ElNotificationBox("系统提示", res.message, "success");
}

/**
 * dialog确认提交
 */
export async function dialogConfirmHandle(formEl: FormInstance | undefined) {
  if (!formEl) return;
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      try {
        loading.value = true;
        if (isEdit.value) {
          await _editMenuApiHanlde();
        } else {
          await _addMenuApiHanlde();
        }
        dialogVisible.value = false;
        loading.value = false;
        _resetDialogForm();
      } catch (error) {
        loading.value = false;
      }
    }
  });
}

export function initPage() {
  getMenuList();
}

/**
 * 查看所有菜单信息
 */
async function getMenuList() {
  const result = await findAllMenusApi();
  tableData.value = result.data;
  parentUuidsTreeSelect.value = _generateTreeSelect(result.data);
  parentUuidsTreeSelect.value.unshift({ label: "Root", value: "" });
}

/**
 * 生成树形uuid选择数据
 */
function _generateTreeSelect(data: MenuType[]) {
  let result: ParentUUIDTreeType[] = [];
  for (const menu of data) {
    let item: ParentUUIDTreeType = { label: menu.menu_name, value: menu.uuid };
    if (menu.children && menu.children.length) {
      item.children = _generateTreeSelect(menu.children);
    }
    result.push(item);
  }
  return result;
}
