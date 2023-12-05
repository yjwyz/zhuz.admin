<template>
  <a v-if="!avatar" href="/" class="logo-base logo">
    <img src="../../../assets/logo/zhuz.svg" alt="" />
    <h1
      :style="{
        color: variables.menuColor,
        fontWeight: 700,
      }"
    >
      {{ userPerssion.userinfo.nick_name || "zhuz" }}
    </h1>
  </a>
  <div class="logo-base user" v-else>
    <el-avatar
      class="w-[50px] h-full !rounded"
      shape="square"
      :size="50"
      :src="
        avatar
          ? '/api' + avatar
          : 'https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png'
      "
    />
    <h1
      :style="{
        color: variables.menuColor,
      }"
      class="truncate"
    >
      {{ userPerssion.userinfo.nick_name || "zhuz" }}
    </h1>
  </div>
</template>

<script lang="ts" setup>
import variables from "@/styles/variables.module.scss";
import userPerssionStore from "@/common/perssion/perssion.pinia.ts";
const userPerssion = userPerssionStore();

const avatar = computed(() => userPerssion.userinfo.avatar);
</script>

<style lang="scss" scoped>
.logo-base {
  display: flex;
  justify-content: flex-start;
  height: 60px;
  align-items: center;
  text-decoration: none;
  &.logo {
    padding: 0 20px;
  }
  &.user {
    padding: 0 5px 0 5px;
  }
  img {
    width: 32px;
    height: 32px;
    margin-right: 10px;
  }
  h1 {
    font-weight: 700;
    padding-left: 5px;
    flex: 1;
  }
}
.el-menu {
  &.el-menu--collapse {
    & h1 {
      display: none;
    }
  }
}
</style>
