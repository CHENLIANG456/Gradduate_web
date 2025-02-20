<template>
  <div class="deepseek-container">
    <a-result
      status="info"
      title="正在跳转到 DeepSeek 编程助手"
      sub-title="即将为您打开新窗口..."
    >
      <template #extra>
        <a-button type="primary" @click="redirectToDeepSeek">
          立即跳转
        </a-button>
        <a-button @click="goBack">返回首页</a-button>
      </template>
    </a-result>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const redirectToDeepSeek = () => {
  window.open("https://chat.deepseek.com/", "_blank");
  router.push("/");
};

const goBack = () => {
  router.push("/");
};

onMounted(() => {
  // 自动跳转
  setTimeout(redirectToDeepSeek, 1500);
});
</script>

<style scoped>
.deepseek-container {
  padding: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 64px);
}
</style>
