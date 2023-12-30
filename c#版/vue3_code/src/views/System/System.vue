<template>
  <router-view v-slot="{ Component }">
    <keep-alive>
      <component
        v-if="$route.meta.isCache"
        :is="Component"
        :key="$route.name"
      ></component>
    </keep-alive>
    <component
      v-if="!$route.meta.isCache"
      :is="Component"
      :key="$route.name"
    ></component>
  </router-view>
</template>

<script setup lang="ts"></script>
