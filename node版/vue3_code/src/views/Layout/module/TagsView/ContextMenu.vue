<template>
  <div class="context-menu-container">
    <div @click="onRefreshClick">刷新</div>
    <div @click="onCloseRightClick">关闭右侧</div>
    <div @click="onCloseOtherClick">关闭其他</div>
    <div @click="onCloseAllClick">关闭全部</div>
  </div>
</template>

<script setup lang="ts">
import router from "../../../../plugins/router/router";
import useTagsViewStore from "./tagsView.pinia";

const tagsViewStore = useTagsViewStore();

const props = defineProps({
  index: {
    type: Number,
    required: true,
  },
});

const onRefreshClick = () => {
  router.go(0);
};

const onCloseRightClick = () => {
  tagsViewStore.removeTagsView({
    type: "right",
    index: props.index,
  });
};

const onCloseOtherClick = () => {
  tagsViewStore.removeTagsView({
    type: "other",
    index: props.index,
  });
};

const onCloseAllClick = () => {
  tagsViewStore.removeTagsView({
    type: "all",
    index: props.index,
  });
};
</script>
<style lang="scss" scoped>
.context-menu-container {
  list-style-type: none;
  background: #fff;
  border: 1px solid #bebebe;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.5);
  user-select: none;
  @apply inline-block;
}
</style>
