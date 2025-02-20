<template>
  <div class="home-container">
    <!-- 主要内容区 -->
    <div class="hero-section">
      <h1 class="title">CBCT 牙科影像优化系统</h1>
      <p class="subtitle">基于深度学习的牙科 CBCT 伪影去除</p>
      <div class="feature-cards">
        <a-row type="flex" justify="center" :gutter="[32, 32]">
          <a-col :xs="24" :sm="24" :md="8">
            <a-card class="feature-card" :bordered="false">
              <template #cover>
                <div class="icon-wrapper">
                  <!-- 智能识别图标 -->
                  <svg
                    class="feature-icon"
                    viewBox="0 0 1024 1024"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M512 832c-176.448 0-320-143.552-320-320S335.552 192 512 192s320 143.552 320 320-143.552 320-320 320m0-704C300.256 128 128 300.256 128 512s172.256 384 384 384 384-172.256 384-384S723.744 128 512 128"
                      fill="#3498db"
                    />
                    <path
                      d="M512 640c-70.592 0-128-57.408-128-128s57.408-128 128-128 128 57.408 128 128-57.408 128-128 128"
                      fill="#3498db"
                    />
                  </svg>
                </div>
              </template>
              <a-card-meta title="智能识别">
                <template #description>自动检测 CBCT 图像中的金属伪影</template>
              </a-card-meta>
            </a-card>
          </a-col>

          <a-col :xs="24" :sm="24" :md="8">
            <a-card class="feature-card" :bordered="false">
              <template #cover>
                <div class="icon-wrapper">
                  <!-- 伪影去除图标 -->
                  <svg
                    class="feature-icon"
                    viewBox="0 0 1024 1024"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M832 464H192c-17.664 0-32 14.336-32 32s14.336 32 32 32h640c17.664 0 32-14.336 32-32s-14.336-32-32-32"
                      fill="#3498db"
                    />
                    <path
                      d="M832 320H192c-17.664 0-32 14.336-32 32s14.336 32 32 32h640c17.664 0 32-14.336 32-32s-14.336-32-32-32M832 608H192c-17.664 0-32 14.336-32 32s14.336 32 32 32h640c17.664 0 32-14.336 32-32s-14.336-32-32-32"
                      fill="#3498db"
                    />
                  </svg>
                </div>
              </template>
              <a-card-meta title="伪影去除">
                <template #description>高效去除金属伪影，提升图像质量</template>
              </a-card-meta>
            </a-card>
          </a-col>

          <a-col :xs="24" :sm="24" :md="8">
            <a-card class="feature-card" :bordered="false">
              <template #cover>
                <div class="icon-wrapper">
                  <!-- 云端处理图标 -->
                  <svg
                    class="feature-icon"
                    viewBox="0 0 1024 1024"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M811.314286 441.142857c-2.742857-125.257143-105.142857-225.828571-231.314286-225.828571-97.828571 0-181.485714 60.571429-215.771429 146.285714-92.571429 11.428571-164.571429 90.285714-164.571428 186.514286 0 104 84.571429 188.571429 188.571428 188.571428h406.857143c86.857143 0 157.142857-70.285714 157.142857-157.142857 0-82.857143-64-150.857143-144.914285-156.571429z"
                      fill="#3498db"
                    />
                  </svg>
                </div>
              </template>
              <a-card-meta title="云端处理">
                <template #description
                  >快速的云端运算，实时查看处理结果</template
                >
              </a-card-meta>
            </a-card>
          </a-col>
        </a-row>
      </div>

      <div class="action-buttons" v-if="!store.loginUser.id">
        <a-button type="primary" size="large" @click="goToLogin">
          开始使用
        </a-button>
        <a-button size="large" @click="goToRegister">注册账号</a-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { userLoginStore } from "@/store/useLoginUserStore";

const router = useRouter();
const store = userLoginStore();

const goToLogin = () => router.push("/user/login");
const goToRegister = () => router.push("/user/register");
</script>

<style scoped>
.home-container {
  min-height: calc(100vh - 64px - 70px);
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.hero-section {
  flex: 1;
  padding: 60px 20px;
  text-align: center;
  max-width: 1200px;
  margin: 0 auto;
}

.title {
  font-size: 2.5rem;
  color: #2c3e50;
  margin-bottom: 20px;
  font-weight: 600;
  background: linear-gradient(120deg, #2c3e50, #3498db);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.subtitle {
  font-size: 1.2rem;
  color: #666;
  margin-bottom: 60px;
}

.feature-cards {
  margin: 40px auto;
  max-width: 1200px;
}

.feature-card {
  height: 100%;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 12px;
  transition: transform 0.3s ease;
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
}

.feature-card:hover {
  transform: translateY(-5px);
}

.icon-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 160px;
  background: #f5f7fa;
  border-radius: 12px 12px 0 0;
}

.feature-icon {
  width: 80px;
  height: 80px;
}

.action-buttons {
  margin-top: 60px;
  display: flex;
  gap: 20px;
  justify-content: center;
}

.action-buttons .ant-btn {
  padding: 0 40px;
  height: 48px;
  font-size: 16px;
  border-radius: 24px;
}

@media (max-width: 768px) {
  .title {
    font-size: 2rem;
  }
  .action-buttons {
    flex-direction: column;
    align-items: center;
  }
}
</style>
