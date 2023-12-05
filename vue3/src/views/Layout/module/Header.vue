<template>
  <el-header class="layout-header">
    <div
      @click="switchCollapse"
      class="hover:bg-[#367fa9] flex items-center h-full pl-2 pr-2 active:text-[#009688]"
    >
      <el-icon size="25">
        <i-ep-expand v-show="isCollapse"></i-ep-expand>
        <i-ep-fold v-show="!isCollapse"></i-ep-fold>
      </el-icon>
    </div>
    <el-dropdown trigger="click" class="ml-auto h-full mr-[20px]">
      <span class="el-dropdown-link w-full">
        <div class="header-item">
          <svg-icon class-name="kzmb-icon" icon-class="kongzhimianban" />
          控制面板
        </div>
      </span>

      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item>
            <svg-icon class="mr-1" icon-class="setting" />
            系统设置
          </el-dropdown-item>
          <el-dropdown-item divided>
            <i-ep-circle-close-filled
              color="red"
              class="mr-1"
            ></i-ep-circle-close-filled>
            <el-popconfirm
              @confirm="loginout"
              :hide-after="0"
              width="220"
              confirm-button-text="退出登录"
              title="是否退出登录?"
            >
              <template #reference> 退出登录 </template>
            </el-popconfirm>
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>

    <avatar-com></avatar-com>
    <div class="w-[10px]"></div>
  </el-header>
</template>

<script setup lang="ts">
import useSettingsStore from "../../../common/settings/settings.pinia";
import AvatarCom from "../component/Avatar.vue";
import userPerssionStore from "@/common/perssion/perssion.pinia.ts";
import useTagsViewStore from "./TagsView/tagsView.pinia";

const settingsStore = useSettingsStore();

const isCollapse = computed(() => settingsStore.isCollapse);

function loginout() {
  useTagsViewStore().$reset();
  userPerssionStore().loginOut();
}
function switchCollapse() {
  settingsStore.isCollapse = !isCollapse.value;
}
</script>

<style lang="scss" scoped>
.el-header {
  display: flex;
  align-items: center;
}
.kzmb-icon {
  padding-top: 3px;
}
.header-item {
  margin-left: auto;
  user-select: none;
  height: 100%;
  padding: 0 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 5px;
  &:hover {
    background-color: #367fa9;
  }
}
</style>
