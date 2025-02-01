<template>
  <div class="app">
    <BasicLayout />
  </div>
</template>

<style scoped></style>

<script setup lang="ts">
import BasicLayout from "@/layouts/BasicLayout.vue";
import { userLoginStore } from "@/store/useLoginUserStore";
const store = userLoginStore();
store.getUserInfo();
</script>
