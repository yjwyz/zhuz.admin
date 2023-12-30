<template>
  <div>
    <el-container>
      <AppSide></AppSide>
      <el-container class="layout-header-and-main">
        <AppHeader></AppHeader>
        <AppTagsView class="h-[35px]"></AppTagsView>
        <el-main class="main-container">
          <el-scrollbar
            :view-style="{ height: '100%' }"
            class="scrollbar-container"
          >
            <router-view v-slot="{ Component }">
              <keep-alive>
                <component :is="Component"></component>
              </keep-alive>
            </router-view>
          </el-scrollbar>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup lang="ts" name="Layout">
import AppSide from "./module/Sider.vue";
import AppHeader from "./module/Header.vue";
import AppTagsView from "./module/TagsView/TagsView.vue";
</script>

<style lang="scss" scoped>
.layout-header-and-main {
  flex-direction: column;
  height: 100vh;
}
</style>
