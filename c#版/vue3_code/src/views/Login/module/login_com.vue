<template>
  <div class="login-com">
    <el-form :model="formData" :rules="formDataRule" ref="loginFormRef">
      <el-form-item prop="username">
        <el-input
          v-model="formData.username"
          placeholder="请输入用户名"
          clearable
          type="text"
        ></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          v-model="formData.password"
          type="password"
          placeholder="请输入密码"
          show-password
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item prop="code">
        <div class="flex items-center">
          <el-input
            v-model="formData.code"
            @keyup.enter="login(loginFormRef)"
            placeholder="验证码"
            clearable
          ></el-input>
          <img
            @click="GetCaptcha"
            class="min-w-[100px]"
            :src="captchaImg"
            alt="验证码"
          />
        </div>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          :loading="loading"
          class="w-full"
          @click="login(loginFormRef)"
        >
          登录
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import {
  formData,
  initPage,
  dispose,
  captchaImg,
  GetCaptcha,
  formDataRule,
  login,
  loginFormRef,
  loading,
} from "../login.ts";

initPage();

onUnmounted(dispose);
</script>

<style scoped lang="scss"></style>
