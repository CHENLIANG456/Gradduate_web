<template>
  <div id="basic-layout">
    <a-layout>
      <a-layout-header class="header">
        <GlobalHeader />
      </a-layout-header>
      <a-layout-content class="content">
        <router-view />
      </a-layout-content>
      <a-layout-footer class="footer">By Liangjiang</a-layout-footer>
    </a-layout>
  </div>
</template>

<script setup lang="ts">
import GlobalHeader from "@/components/GlobalHeader.vue";
</script>

<style scoped>
#basic-layout {
  min-height: 100vh;
}

#basic-layout .header {
  background-color: rgba(255, 255, 255, 0.95);
  padding: 0 20px;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
}

#basic-layout .content {
  min-height: calc(100vh - 64px - 70px);
  margin-top: 64px;
}
#basic-layout .footer {
  text-align: center;
  background-color: #001529;
  color: rgba(255, 255, 255, 0.8);
  padding: 24px;
  line-height: 1.5;
}

#basic-layout .footer p {
  margin: 0;
}

.ant-layout {
  background: transparent;
}
</style>
