<template>
  <div>
    <el-card class="box-card" v-loading="loading">
      <template #header>
        <el-button
          type="primary"
          @click="
            fenpeiBtnHandle(JSON.parse(JSON.stringify(dialogForm as any)))
          "
          class="table-btn"
        >
          <svg-icon icon-class="fenpei" class="mr-1"></svg-icon>
          分配菜单
        </el-button>
        <el-button type="success" @click="addBtnHandle" class="table-btn">
          <svg-icon icon-class="add" class="mr-1"></svg-icon>
          新增
        </el-button>

        <el-button
          @click="editBtnHandle(JSON.parse(JSON.stringify(dialogForm as any)))"
          type="primary"
          class="table-btn"
        >
          <svg-icon icon-class="set" class="mr-1"></svg-icon>
          编辑
        </el-button>
        <el-button
          @click="delBtnHandle(dialogForm as any)"
          type="danger"
          class="table-btn"
        >
          <svg-icon icon-class="del" class="mr-1"></svg-icon>
          删除
        </el-button>
      </template>
      <el-table
        highlight-current-row
        @row-click="tableRowClickHandle"
        row-key="uuid"
        ref="tableRef"
        :data="tableRoleList"
        style="width: 100%"
      >
        <el-table-column type="index" width="25">
          <template #default="{ row }">
            <el-icon v-show="row.id == dialogForm.id" color="teal">
              <i-ep-select></i-ep-select>
            </el-icon>
          </template>
        </el-table-column>
        <el-table-column label="ID" width="125px" prop="id"></el-table-column>
        <el-table-column label="角色名称" prop="role_name"></el-table-column>
        <el-table-column label="操作" fixed="right" width="260px">
          <template #default="{ row }">
            <el-button
              @click.prevent.stop="fenpeiBtnHandle(row)"
              class="table-btn-none"
              type="primary"
              size="small"
            >
              <svg-icon icon-class="fenpei"></svg-icon>
              分配菜单
            </el-button>
            <el-button
              @click.prevent.stop="editBtnHandle(row)"
              class="table-btn-none"
              type="primary"
              size="small"
            >
              <svg-icon icon-class="set" class="mr-1"></svg-icon>
              编辑
            </el-button>
            <el-button
              type="success"
              @click.prevent.stop="addBtnHandle"
              size="small"
              class="table-btn-none"
            >
              <svg-icon icon-class="add" class="mr-1"></svg-icon>
              新增
            </el-button>
            <el-button
              @click.prevent.stop="delBtnHandle(row)"
              class="table-btn-none"
              type="danger"
              size="small"
            >
              <svg-icon icon-class="del" class="mr-1"></svg-icon>
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- dialog  -->
      <el-dialog
        v-model="dialogVisible"
        :title="isEdit ? '编辑角色' : '添加角色'"
        width="60%"
        draggable
      >
        <el-form
          :model="dialogForm"
          label-width="120px"
          ref="dialogFormRef"
          :rules="dialogFormRule"
        >
          <el-form-item label="角色名称" prop="role_name">
            <el-input v-model="dialogForm.role_name"></el-input>
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="dialogVisible = false">取消</el-button>
            <el-button
              :type="isEdit ? 'primary' : 'success'"
              @click.stop="dialogConfirmBtnHandle(dialogFormRef)"
            >
              {{ isEdit ? "修改" : "添加" }}
            </el-button>
          </span>
        </template>
      </el-dialog>
      <!-- dialog  -->
      <el-dialog
        v-model="dialogFenpeiVisible"
        title="分配菜单"
        width="60%"
        draggable
        destroy-on-close
      >
        <el-tree
          class="min-h-[200px]"
          highlight-current
          default-expand-all
          ref="treeRef"
          :data="treeData"
          :props="treeDefaultProps"
          node-key="id"
          :default-checked-keys="treeDefaultCheckList"
          show-checkbox
          accordion
        />
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="dialogFenpeiVisible = false">取消</el-button>
            <el-button type="primary" @click="fenpeiSubmit(treeRef)">
              分配
            </el-button>
          </span>
        </template>
      </el-dialog>
    </el-card>
  </div>
</template>

<script setup lang="ts" name="Rolemanage">
import useShareStore from "../../../common/share/share.pinia";
import { routePaths } from "../../../plugins/router/paths";
import {
  initPage,
  tableRoleList,
  editBtnHandle,
  addBtnHandle,
  dialogVisible,
  isEdit,
  loading,
  treeDefaultCheckList,
  delBtnHandle,
  tableRowClickHandle,
  treeRef,
  dialogForm,
  dialogConfirmBtnHandle,
  fenpeiSubmit,
  dialogFormRule,
  dialogFenpeiVisible,
  fenpeiBtnHandle,
  dialogFormRef,
  treeData,
  treeDefaultProps,
  refreshPage,
} from "./role";

const sotre = useShareStore();

watch(
  () => sotre.refreshNum,
  () => {
    if (sotre.currentRoutePath == routePaths.rolemanage.path) {
      refreshPage();
    }
  }
);

initPage();

console.log("角色管理");
</script>

<style scoped></style>
