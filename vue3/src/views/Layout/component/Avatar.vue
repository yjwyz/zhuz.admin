<template>
  <div>
    <!--头像-->
    <el-tooltip
      class="box-item"
      effect="dark"
      content="点击修改头像"
      placement="left"
    >
      <div
        class="avatar-box relative flex items-center rounded-[5px] overflow-hidden"
      >
        <el-avatar
          class="w-full h-full"
          shape="square"
          :size="avatarHeight"
          :src="
            avatar
              ? '/api' + avatar
              : 'https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png'
          "
        />
        <div
          :style="{ height: avatarHeight + 'px' }"
          @click="setAvatarHandle(avatarInput)"
          class="mask-avatar absolute opacity-0 rounded bg-white w-full active:bg-opacity-70 content-end bg-opacity-20 top-0 left-0"
        ></div>
      </div>
    </el-tooltip>
    <input
      type="file"
      @change="avatarInputChange"
      v-show="false"
      ref="avatarInput"
    />
  </div>
</template>

<script setup lang="ts">
import userPerssionStore from "@/common/perssion/perssion.pinia";
import { appMessage_ElConfirm } from "../../../plugins/extends/zhuz_message";

const avatarHeight: number = 40; // 头像宽高

const avatarInput = ref<HTMLInputElement>();

const perssionStore = userPerssionStore();

const avatar = computed(() => perssionStore.userinfo.avatar);

function setAvatarHandle(inputFile: HTMLInputElement | undefined) {
  inputFile?.click();
}

async function avatarInputChange(event: Event) {
  try {
    const fileInput = event.target as HTMLInputElement;
    if (!fileInput.files || fileInput.files.length === 0) {
      appMessage_ElConfirm("文件是空的", "warning");
      return; // 没有选择的文件
    }
    const file = fileInput.files[0];
    const formData = new FormData();
    formData.append("avatar", file);
    await perssionStore.setAvatar_(formData);
    fileInput.value = "";
  } catch (e) {
    console.log(2);

    console.log(e);
  }
}
</script>

<style scoped>
.avatar-box:hover .mask-avatar {
  opacity: 1;
}
</style>
