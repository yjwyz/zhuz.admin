<template>
  <div class="login-page">
    <div class="login-main">
      <el-tabs v-model="currentTab" type="border-card">
        <el-tab-pane name="login" label="登录">
          <login-com></login-com>
        </el-tab-pane>
        <el-tab-pane name="register" label="注册">
          <register-com></register-com>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script setup lang="ts">
import LoginCom from "./module/login_com.vue";
import RegisterCom from "./module/register_com.vue";
import { currentTab } from "./login";
</script>

<style scoped lang="scss">
.login-page {
  height: 100vh;
  background-color: #009688;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  .login-main {
    width: 300px;
    overflow: hidden;
    height: 270px;
    background-color: #f9f7fc;
    box-shadow: 0px 6px 26px 3px rgba(0, 0, 0, 0.3);
  }
}
</style>
