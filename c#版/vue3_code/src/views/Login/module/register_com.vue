<template>
  <div class="register-com">
    <el-form
      :model="registerFormData"
      :rules="registerFormDataRule"
      ref="registerFormRef"
    >
      <el-form-item prop="username">
        <el-input
          v-model="registerFormData.username"
          placeholder="请输入用户名"
          clearable
          type="text"
        ></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          v-model="registerFormData.password"
          type="password"
          placeholder="请输入密码"
          show-password
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          v-model="registerFormData.repeat_password"
          type="password"
          placeholder="请输入确认密码"
          show-password
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item prop="code">
        <div class="flex items-center">
          <el-input
            v-model="registerFormData.code"
            @keyup.enter="register(registerFormRef)"
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
          type="warning"
          :loading="loading"
          class="w-full"
          @click="register(registerFormRef)"
        >
          注册
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import {
  initPage,
  dispose,
  captchaImg,
  GetCaptcha,
  registerFormRef,
  registerFormData,
  registerFormDataRule,
  register,
  loading,
} from "../login.ts";

initPage();

onUnmounted(dispose);
</script>

<style scoped lang="scss">
.register-com {
  --el-component-size: 25px;
}
</style>
