<template>
  <div id="home">
    <div class="hero-section">
      <h1 class="title">CBCT 牙科影像优化系统</h1>
      <p class="subtitle">基于深度学习的牙科 CBCT 伪影去除</p>
      <div class="features">
        <div class="feature-card">
          <a-icon type="scan" class="feature-icon" />
          <h3>智能识别</h3>
          <p>自动检测 CBCT 图像中的金属伪影</p>
        </div>
        <div class="feature-card">
          <a-icon type="medicine-box" class="feature-icon" />
          <h3>伪影去除</h3>
          <p>高效去除金属伪影，提升图像质量</p>
        </div>
        <div class="feature-card">
          <a-icon type="cloud-server" class="feature-icon" />
          <h3>云端处理</h3>
          <p>快速的云端运算，实时查看处理结果</p>
        </div>
      </div>

      <a-button
        type="primary"
        size="large"
        class="start-btn"
        @click="goToRegister"
      >
        开始使用
        <a-icon type="right" />
      </a-button>
    </div>
  </div>
</template>

<script lang="ts" setup name="HomePage">
import { useRouter } from "vue-router";

const router = useRouter();

const goToRegister = () => {
  router.push("/user/register");
};
</script>

<style scoped>
#home {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 40px 20px;
}

.hero-section {
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
  padding: 60px 0;
}

.title {
  font-size: 2.5rem;
  color: #2c3e50;
  margin-bottom: 20px;
  font-weight: 600;
}

.subtitle {
  font-size: 1.2rem;
  color: #34495e;
  margin-bottom: 50px;
}

.features {
  display: flex;
  justify-content: center;
  gap: 30px;
  margin: 50px 0;
  flex-wrap: wrap;
}

.feature-card {
  background: rgba(255, 255, 255, 0.9);
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 280px;
  transition: transform 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-5px);
}

.feature-icon {
  font-size: 2.5rem;
  color: #1890ff;
  margin-bottom: 20px;
}

.feature-card h3 {
  font-size: 1.2rem;
  color: #2c3e50;
  margin-bottom: 10px;
}

.feature-card p {
  color: #606f7b;
}

.start-btn {
  margin-top: 40px;
  height: 48px;
  padding: 0 40px;
  font-size: 1.1rem;
  border-radius: 24px;
}

@media (max-width: 768px) {
  .title {
    font-size: 2rem;
  }
  .features {
    flex-direction: column;
    align-items: center;
  }
  .feature-card {
    width: 100%;
    max-width: 280px;
  }
}
</style>
