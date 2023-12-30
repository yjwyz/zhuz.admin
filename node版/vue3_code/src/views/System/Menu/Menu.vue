<template>
  <div>
    <el-card class="box-card">
      <template #header>
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
        :data="tableData"
        default-expand-all
        style="width: 100%"
      >
        <el-table-column width="55" />
        <el-table-column type="index" width="55">
          <template #default="{ row }">
            <el-icon v-show="row.uuid == dialogForm.uuid" color="teal">
              <i-ep-select></i-ep-select>
            </el-icon>
          </template>
        </el-table-column>
        <el-table-column label="ID" align="center" prop="id"></el-table-column>
        <el-table-column
          label="菜单名称"
          width="180"
          prop="menu_name"
          align="center"
        ></el-table-column>
        <el-table-column
          label="是否显示"
          width="90"
          prop="shown"
          align="center"
        >
          <template #default="scope">
            <div v-if="scope.row.shown" class="ml-2 show-tag">显示</div>
            <div v-else>隐藏</div>
          </template>
        </el-table-column>
        <el-table-column
          label="排序"
          prop="order_num"
          align="center"
        ></el-table-column>
        <el-table-column
          label="创建时间"
          width="180"
          prop="createdAt"
          align="center"
        ></el-table-column>

        <el-table-column
          label="是否缓存"
          width="90"
          prop="is_cache"
          align="center"
        >
          <template #default="scope">
            <div v-if="scope.row.is_cache" class="ml-2 cache-tag">缓存</div>
            <span v-else> 否 </span>
          </template>
        </el-table-column>
        <el-table-column
          label="描述"
          prop="description"
          width="180"
          align="center"
        ></el-table-column>
        <el-table-column label="图标" prop="icon" align="center">
          <template #default="scope">
            <svg-icon :icon-class="scope.row.icon"></svg-icon>
          </template>
        </el-table-column>
        <el-table-column
          label="菜单UID"
          prop="uuid"
          align="center"
        ></el-table-column>
        <el-table-column
          label="上级菜单UID"
          width="180"
          prop="parent_uuid"
          align="center"
        ></el-table-column>

        <el-table-column
          label="更新时间"
          width="180"
          prop="updatedAt"
          align="center"
        ></el-table-column>
        <el-table-column label="操作" width="190" align="center" fixed="right">
          <template #default="{ row }">
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
              @click.prevent.stop="addBtnHandle(row)"
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
    </el-card>
    <!-- dialog  -->
    <el-dialog
      v-model.sync="dialogVisible"
      :title="isEdit ? '编辑菜单' : '添加菜单'"
      width="60%"
      draggable
      destroy-on-close
    >
      <el-form
        :model="dialogForm"
        label-width="120px"
        ref="dialogFormRef"
        :rules="dialogFormRule"
      >
        <el-form-item label="上级菜单">
          <el-tree-select
            v-model="dialogForm.parent_uuid"
            :data="parentUuidsTreeSelect"
            check-strictly
            :render-after-expand="false"
          />
        </el-form-item>
        <el-form-item label="菜单名称" prop="menu_name">
          <el-input v-model="dialogForm.menu_name"></el-input>
        </el-form-item>
        <el-form-item label="是否显示">
          <el-radio-group v-model="dialogForm.shown">
            <el-radio border :label="true"> 显示 </el-radio>
            <el-radio border :label="false"> 隐藏 </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否缓存">
          <el-radio-group v-model="dialogForm.is_cache">
            <el-radio border :label="true"> 缓存 </el-radio>
            <el-radio border :label="false"> 否 </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item prop="uuid">
          <template #label>
            <span>UUID</span>
            <span class="ml-2">
              <el-tooltip
                class="box-item"
                effect="dark"
                content="每个菜单都有一个唯一的UUID,且不允许重复"
                placement="right"
              >
                <el-icon>
                  <i-ep-questionFilled></i-ep-questionFilled>
                </el-icon>
              </el-tooltip>
            </span>
          </template>
          <el-input v-model="dialogForm.uuid"></el-input>
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number v-model="dialogForm.order_num"></el-input-number>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input type="textarea" v-model="dialogForm.description"></el-input>
        </el-form-item>
        <el-form-item label="菜单图标" prop="icon">
          <el-input
            v-model="dialogForm.icon"
            placeholder="点击选择图标"
            @click="showChooseIcon = true"
            readonly
          >
            <template #prefix>
              <svg-icon
                v-if="dialogForm.icon"
                :icon-class="dialogForm.icon"
                class="el-input__icon"
                style="height: 32px; width: 16px"
              />
              <el-icon v-else style="height: 32px; width: 16px">
                <i-ep-search />
              </el-icon>
            </template>
          </el-input>
          <div class="h-[100px] overflow-auto">
            <icon-select @selected="selected" :active-icon="dialogForm.icon" />
          </div>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button
            :loading="loading"
            :type="isEdit ? 'primary' : 'success'"
            @click.stop="dialogConfirmHandle(dialogFormRef)"
          >
            {{ isEdit ? "修改" : "添加" }}
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts" name="Menus">
import {
  tableData,
  initPage,
  loading,
  dialogVisible,
  selected,
  isEdit,
  dialogConfirmHandle,
  dialogFormRule,
  tableRowClickHandle,
  editBtnHandle,
  dialogForm,
  tableRef,
  addBtnHandle,
  delBtnHandle,
  refreshPage,
  dialogFormRef,
  parentUuidsTreeSelect,
  showChooseIcon,
} from "./menu";
import IconSelect from "../../../components/IconSelect/IconSelect.vue";
import useShareStore from "../../../common/share/share.pinia";
import { routePaths } from "../../../plugins/router/paths";

const sotre = useShareStore();

watch(
  () => sotre.refreshNum,
  () => {
    if (sotre.currentRoutePath == routePaths.menus.path) {
      refreshPage();
    }
  }
);

console.log("菜单管理");

initPage();
</script>

<style scoped>
.show-tag {
  background-color: var(--el-color-primary);
  color: white;
}

.cache-tag {
  background-color: var(--el-color-success);
  color: white;
}
</style>
