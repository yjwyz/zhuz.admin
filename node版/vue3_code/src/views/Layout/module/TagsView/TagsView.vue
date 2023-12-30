<template>
  <div class="tags-view-container z-[999]">
    <el-scrollbar
      class="scrollbar-container"
      :view-style="{
        height: '100%',
        display: 'flex',
        alignItems: 'center',
      }"
      view-class="scrollbar-view"
    >
      <router-link
        class="tags-view-item"
        :class="isActive(tag) ? 'active' : ''"
        v-for="(tag, index) in tagsViewList"
        :key="tag.meta.uuid + tag.fullPath || tag.name"
        :to="{ path: tag.fullPath }"
        @contextmenu.prevent="openMenu($event, index)"
      >
        {{ tag.meta?.title }}
        <i-ep-close
          class="ml-1"
          v-if="tag.fullPath !== '/'"
          @click.prevent.stop="onCloseClick(index, tag)"
        ></i-ep-close>
      </router-link>

      <div class="null-box"></div>
      <div class="ml-auto flex items-center h-full">
        <div class="right-item zhuz-active-hover-base">
          <svg-icon icon-class="down" />
        </div>
        <div @click="refresh" class="right-item zhuz-active-hover-base">
          <svg-icon class="mr-1" icon-class="refresh" />
          刷新
        </div>
      </div>
    </el-scrollbar>
    <context-menu
      v-show="visible"
      :style="menuStyle"
      :index="selectIndex"
    ></context-menu>
  </div>
</template>

<script setup lang="ts">
import ContextMenu from "./ContextMenu.vue";
import useTagsViewStore from "./tagsView.pinia";
import { useRoute, useRouter } from "vue-router";
import { TagViewType } from "./tagsView.type";
import useShareStore from "@/common/share/share.pinia";

const tagsviewStore = useTagsViewStore();
const tagsViewList = computed(() => tagsviewStore.tagsViewList);

const route = useRoute();
const router = useRouter();

watch(
  route,
  (to) => {
    // if (!isTags(to.path)) return
    const { fullPath, meta, name, path } = to;
    tagsviewStore.addTagsViewList({
      fullPath: fullPath,
      meta: { title: meta.title, uuid: (meta.uuid as string) || "" },
      name: name as string,
      path: path,
      title: meta.title,
    });
    useShareStore().currentRoutePath = fullPath;
  },
  {
    immediate: true,
  }
);

function refresh() {
  console.log(111222);
  useShareStore().refresh();
}

//是否被选中
const isActive = (tag: TagViewType) => {
  return tag.fullPath === route.fullPath;
};
// const isAffiix = (tag: TagViewType) => {
//   console.log(tag.meta && tag.meta.affix);

//   return tag.meta && tag.meta.affix;
// };

// contextMenu 相关
const selectIndex = ref(0);
const visible = ref(false);
const menuStyle = reactive({
  left: "0",
  position: "fixed",
  top: "0",
});

// 展示 menu
const openMenu = (e: any, index: number) => {
  const { x, y } = e;
  menuStyle.left = x + "px";
  menuStyle.top = y + 30 + "px";
  selectIndex.value = index;
  visible.value = true;
};

const onCloseClick = (index: number, tag: TagViewType) => {
  tagsviewStore.removeTagsView({
    type: "index",
    index: index,
  });

  //如果删除的是当前页面，自动定位到上一个页面
  if (isActive(tag)) {
    if (index == 0 && tagsViewList.value.length >= 1) {
      let pre_index = 0;
      let pre_page = tagsViewList.value[pre_index];
      router.push(pre_page.path);
    } else if (tagsViewList.value.length == 0) {
      //如果是最后一个，定位到首页
      router.push("/");
    } else {
      let pre_index = index - 1;
      let pre_page = tagsViewList.value[pre_index];
      router.push(pre_page.path);
    }
  }
};

//关闭 menu
const closeMenu = () => {
  visible.value = false;
};

//监听变化
watch(visible, (val) => {
  if (val) {
    document.body.addEventListener("click", closeMenu);
  } else {
    document.body.removeEventListener("click", closeMenu);
  }
});
</script>

<style lang="scss" scoped>
.right-item {
  @apply flex items-center h-full pl-2 pr-2 select-none;
}
.tags-view-container {
  .scrollbar-container {
    height: 100%;
    .el-scrollbar__wrap {
      height: 100%;
    }
  }
  .tags-view-item {
    height: 100%;
    display: flex;
    padding: 0 10px;
    align-items: center;
    justify-content: center;
  }
}
</style>
