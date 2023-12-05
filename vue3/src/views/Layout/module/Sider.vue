<template>
  <el-aside
    :style="{
      backgroundColor:
        sideTheme === 'theme-dark'
          ? variables.menuBackground
          : variables.menuLightBackground,
    }"
  >
    <el-scrollbar>
      <el-menu
        :default-active="activeMenu"
        :background-color="
          sideTheme === 'theme-dark'
            ? variables.menuBackground
            : variables.menuLightBackground
        "
        :text-color="
          sideTheme === 'theme-dark'
            ? variables.menuColor
            : variables.menuLightColor
        "
        :collapse-transition="false"
        router
        :collapse="isCollapse"
        mode="vertical"
      >
        <Logo></Logo>
        <sider-item
          v-for="(route, index) in sidebarRouters"
          :key="route.path + index"
          :item="route"
        />
      </el-menu>
    </el-scrollbar>
  </el-aside>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import Logo from "../component/Logo.vue";
import SiderItem from "./SiderItem.vue";
import userPerssionStore from "@/common/perssion/perssion.pinia";
import useSettingsStore from "@/common/settings/settings.pinia";
import variables from "@/styles/variables.module.scss";

const route = useRoute();
const permissionStore = userPerssionStore();
const settingsStore = useSettingsStore();

const sideTheme = computed(() => settingsStore.sideTheme);
const isCollapse = computed(() => settingsStore.isCollapse);
const sidebarRouters = computed(() => permissionStore.sidebarRouters);

const activeMenu = computed(() => {
  const { meta, path } = route;
  if (meta.activeMenu) {
    return meta.activeMenu;
  }
  return path;
});
</script>

<style lang="scss" scoped>
.el-aside {
  height: 100vh;
  width: auto;
}

.el-menu {
  width: 200px;
  border-right: none;
  &.el-menu--collapse {
    width: 60px;
  }
}
</style>
