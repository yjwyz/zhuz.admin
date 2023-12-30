<template>
  <el-sub-menu
    teleported
    v-if="hasChlid(item as RouteRecordRaw)&&!isHidden(item as RouteRecordRaw)"
    :index="resolvePath(item.path)"
    class="font-[700]"
  >
    <template v-if="item.meta" #title>
      <svg-icon :icon-class="item.meta && item.meta.icon" class="mr-1" />
      <span class="menu-title" :title="item.meta.title">
        {{ item.meta.title }}
      </span>
    </template>

    <sider-item
      v-for="child in item.children"
      :key="child.name"
      teleported
      :item="child"
      :base-path="resolvePath(item.path)"
      class="nest-menu"
    />
  </el-sub-menu>

  <div v-else>
    <el-menu-item
      class="nosub-menu font-[700]"
      v-if="!isHidden(item as RouteRecordRaw)"
      :index="resolvePath(item.path)"
    >
      <svg-icon class="mr-1" :icon-class="item.meta && item.meta.icon" />
      <template #title>
        <span class="menu-title">
          {{ item.meta.title }}
        </span>
      </template>
    </el-menu-item>
  </div>
</template>

<script setup lang="ts">
import { RouteRecordRaw } from "vue-router";
import { isExternal } from "../../../common/perssion/perssion.utils";

const props = defineProps({
  // route object
  item: {
    type: Object,
    required: true,
  },
  basePath: {
    type: String,
    default: "",
  },
});

function resolvePath(routePath: string) {
  if (isExternal(routePath)) {
    return routePath;
  }

  return props.basePath + "/" + routePath;
}

function hasChlid(item: RouteRecordRaw) {
  let hasChildBool = item.children && item.children.length;
  if (hasChildBool) {
    // 如果子集都是隐藏等同于无子集
    return (item.children?.findIndex((v) => !v.meta?.hidden) as number) >= 0;
  }
  return hasChildBool;
}

function isHidden(item: RouteRecordRaw) {
  let isHid = item.meta && item.meta.hidden;
  return isHid;
}
</script>

<style scoped></style>
