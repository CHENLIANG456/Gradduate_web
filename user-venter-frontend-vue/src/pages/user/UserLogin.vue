<template>
  <div class="login-container">
    <div class="login-box">
      <div class="login-header">
        <h2>CBCT 影像优化系统</h2>
        <p>欢迎使用牙科影像处理平台</p>
      </div>
      <a-form
        :model="formState"
        name="normal_login"
        class="login-form"
        @finish="onFinish"
        @finishFailed="onFinishFailed"
      >
        <a-form-item
          name="username"
          :rules="[{ required: true, message: '请输入用户名' }]"
        >
          <a-input
            v-model:value="formState.username"
            size="large"
            placeholder="用户名"
          >
            <template #prefix>
              <UserOutlined class="site-form-item-icon" />
            </template>
          </a-input>
        </a-form-item>

        <a-form-item
          name="password"
          :rules="[{ required: true, message: '请输入密码' }]"
        >
          <a-input-password
            v-model:value="formState.password"
            size="large"
            placeholder="密码"
          >
            <template #prefix>
              <LockOutlined class="site-form-item-icon" />
            </template>
          </a-input-password>
        </a-form-item>

        <div class="login-options">
          <a-form-item name="remember" no-style>
            <a-checkbox v-model:checked="formState.remember">记住我</a-checkbox>
          </a-form-item>
          <a class="login-form-forgot" href="">忘记密码？</a>
        </div>

        <a-form-item>
          <a-button
            :disabled="disabled"
            type="primary"
            html-type="submit"
            class="login-form-button"
            size="large"
          >
            登录
          </a-button>
          <div class="register-link">
            还没有账号？ <a href="/user/register">立即注册</a>
          </div>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, computed } from "vue";
import { UserOutlined, LockOutlined } from "@ant-design/icons-vue";
interface FormState {
  username: string;
  password: string;
  remember: boolean;
}
const formState = reactive<FormState>({
  username: "",
  password: "",
  remember: true,
});
const onFinish = (values: any) => {
  console.log("Success:", values);
};

const onFinishFailed = (errorInfo: any) => {
  console.log("Failed:", errorInfo);
};
const disabled = computed(() => {
  return !(formState.username && formState.password);
});
</script>

<style scoped>
.login-container {
  min-height: calc(100vh - 64px - 70px);
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 20px;
}

.login-box {
  background: rgba(255, 255, 255, 0.95);
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

.login-header {
  text-align: center;
  margin-bottom: 40px;
}

.login-header h2 {
  color: #2c3e50;
  font-size: 24px;
  margin-bottom: 8px;
}

.login-header p {
  color: #606f7b;
  font-size: 14px;
}

.login-form {
  width: 100%;
}

.site-form-item-icon {
  color: rgba(0, 0, 0, 0.45);
}

.login-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.login-form-forgot {
  color: #1890ff;
  transition: color 0.3s;
}

.login-form-forgot:hover {
  color: #40a9ff;
}

.login-form-button {
  width: 100%;
  height: 40px;
  border-radius: 4px;
}

.register-link {
  text-align: center;
  margin-top: 16px;
  color: #606f7b;
}

.register-link a {
  color: #1890ff;
  transition: color 0.3s;
}

.register-link a:hover {
  color: #40a9ff;
}

:deep(.ant-input-affix-wrapper) {
  border-radius: 4px;
}

:deep(.ant-form-item-label) {
  display: none;
}

@media (max-width: 576px) {
  .login-box {
    padding: 20px;
  }
  .login-header h2 {
    font-size: 20px;
  }
}
</style>
