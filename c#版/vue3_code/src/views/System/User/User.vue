<template>
  <div>
    <el-card class="box-card">
      <template #header>
        <el-alert
          title="只有 <root> 顶级账号才拥有设置账号为 <超管admin角色> 的权限!"
          type="info"
          :closable="false"
          effect="dark"
        />
      </template>
      <el-table
        highlight-current-row
        row-key="uuid"
        ref="tableRef"
        :data="tableData"
        default-expand-all
        style="width: 100%"
      >
        <el-table-column type="index" width="55" />
        <el-table-column
          label="ID"
          align="center"
          width="55"
          prop="id"
        ></el-table-column>
        <el-table-column
          label="用户名"
          min-width="100"
          prop="user_name"
          align="center"
        >
          <template #default="{ row }">
            <div class="">
              <span>{{ row.user_name }}</span>
              <span class="ml-2 text-[#296bd4] font-bold">
                {{ row.is_admin ? "超管" : "" }}
              </span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="网名" prop="nick_name" align="center">
        </el-table-column>
        <el-table-column label="是否冻结" prop="is_del" align="center">
          <template #default="{ row }">
            <div
              v-if="row.is_del"
              class="ml-2 bg-[var(--el-color-error)] text-[white]"
            >
              已冻结
            </div>
            <div v-else class="flex items-center">
              <div
                class="ml-4 w-[3px] h-[10px] bg-[var(--el-color-success)] mr-2"
              ></div>
              正常
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="创建时间"
          width="180"
          prop="createdAt"
          align="center"
        >
          <template #default="{ row }">
            {{ dayjs(row.createdAt).format("YYYY-MM-DD HH:mm:ss") }}
          </template>
        </el-table-column>

        <el-table-column
          width="180"
          label="更新时间"
          prop="updatedAt"
          align="center"
        >
          <template #default="{ row }">
            {{ dayjs(row.updatedAt).format("YYYY-MM-DD HH:mm:ss") }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="380" align="center" fixed="right">
          <template #default="{ row }">
            <el-button
              @click="editRoleBtnHandle(row)"
              class="table-btn-none"
              type="primary"
              size="small"
            >
              <svg-icon icon-class="setting" class="mr-1"></svg-icon>
              设置角色
            </el-button>

            <el-button
              @click="disableBtnHandle(row)"
              class="table-btn-none"
              type="danger"
              size="small"
            >
              <svg-icon icon-class="donjie" class="mr-1"></svg-icon>
              冻结
            </el-button>
            <el-button
              @click="relieveBtnHandle(row)"
              type="success"
              size="small"
              class="table-btn-none"
            >
              <svg-icon icon-class="jiedon" class="mr-1"></svg-icon>
              解冻
            </el-button>
            <el-button
              @click="editUserToRoot(row)"
              class="table-btn-none"
              type="info"
              size="small"
            >
              <svg-icon icon-class="key" class="mr-1"></svg-icon>
              设为超管
            </el-button>
            <el-button
              @click="editUserRemoveRoot(row)"
              class="table-btn-none"
              type="warning"
              size="small"
            >
              <svg-icon icon-class="key" class="mr-1"></svg-icon>
              撤销超管
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!--  -->
    <el-dialog
      draggable
      destroy-on-close
      v-model="dialogVisible"
      :title="dialogTitle"
      width="70%"
    >
      <div>
        <div class="header_ flex items-center justify-center gap-5 mb-[20px]">
          <el-select v-model="roleFormData.role_id" placeholder="请选择角色">
            <el-option
              v-for="item in roleList"
              :key="item.id"
              :label="item.role_name"
              :value="item.id"
            />
          </el-select>
          <el-button @click="tagaddBtnHandle" type="primary">添加</el-button>
        </div>
        <hr />
        <div class="h-[20px]"></div>
        <div class="min-h-[100px]">
          <el-tag
            v-for="item in hasRoleList"
            :key="item.id"
            type="success"
            closable
            effect="dark"
            @close="tagCloseBtnHandle(item.id)"
            class="pl-[8px]"
          >
            {{ item.role_name }}
          </el-tag>
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="dialogVisible = false">
            好了!
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts" name="usermanage">
import dayjs from "dayjs";
import {
  tableData,
  initPage,
  dialogTitle,
  disableBtnHandle,
  roleList,
  hasRoleList,
  roleFormData,
  tagaddBtnHandle,
  relieveBtnHandle,
  tagCloseBtnHandle,
  refreshPage,
  dialogVisible,
  editRoleBtnHandle,
  editUserRemoveRoot,
  editUserToRoot,
} from "./user";
import useShareStore from "../../../common/share/share.pinia";
import { routePaths } from "../../../plugins/router/paths";

const sotre = useShareStore();

watch(
  () => sotre.refreshNum,
  () => {
    if (sotre.currentRoutePath == routePaths.usermanage.path) {
      refreshPage();
    }
  }
);

console.log("用户管理");

initPage();
</script>
