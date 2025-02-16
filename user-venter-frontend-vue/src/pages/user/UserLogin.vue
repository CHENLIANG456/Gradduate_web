<template>
  <div id="login-container">
    <div class="login-box">
      <div class="login-header">
        <h2>CBCT 影像优化系统</h2>
        <p>欢迎使用牙科影像处理平台</p>
      </div>
      <a-form
        :model="formState"
        name="normal_login"
        class="login-form"
        @finish="handleSubmit"
        @finishFailed="onFinishFailed"
      >
        <a-form-item
          label="用户名"
          name="userAccount"
          :rules="[{ required: true, message: '请输入用户名' }]"
        >
          <a-input
            v-model:value="formState.userAccount"
            size="large"
            placeholder="用户名"
          >
            <template #prefix>
              <UserOutlined class="site-form-item-icon" />
            </template>
          </a-input>
        </a-form-item>

        <a-form-item
          label="密码"
          name="userPassword"
          :rules="[
            { required: true, message: '请输入密码' },
            { min: 6, message: '密码长度至少为6位' },
          ]"
        >
          <a-input-password
            v-model:value="formState.userPassword"
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
import { reactive, computed, onMounted, onUnmounted } from "vue";
import { UserOutlined, LockOutlined } from "@ant-design/icons-vue";
import router from "@/router";
import { message } from "ant-design-vue";
import { userLogin } from "@/api/user";
import { userLoginStore } from "@/store/useLoginUserStore";

const userLoginStores = userLoginStore();

interface FormState {
  userAccount: string;
  userPassword: string;
}
// 接收路由参数
const formState = reactive<FormState>({
  userAccount: "",
  userPassword: "",
});

const handleSubmit = async (values: FormState) => {
  try {
    console.log("登录表单数据:", values); // 检查这里打印的数据

    // 确保传递正确的参数格式
    const res = await userLogin({
      userAccount: formState.userAccount,
      userPassword: formState.userPassword,
    });

    console.log("登录响应:", res); // 检查响应数据

    if (res.data.code === 0 && res.data.data) {
      await userLoginStores.getUserInfo();
      message.success("登录成功");
      router.push({
        path: "/",
      });
    } else {
      // 使用 ant-design-vue 的 message 组件替代 alert
      message.error(res.data.description || "登录失败");
    }
  } catch (error: any) {
    console.error("登录错误:", error); // 检查错误信息
    message.error(error.description || "登录请求失败");
  }
};

const onFinishFailed = (errorInfo: any) => {
  console.log("表单验证失败:", errorInfo); // 添加日志
  message.error("请检查输入信息是否正确"); // 使用更友好的提示
};

const disabled = computed(() => {
  return !(formState.userAccount && formState.userPassword);
});

// 添加 ResizeObserver 警告处理
onMounted(() => {
  const resizeHandler = () => {
    const resizeObserverError = console.error;
    console.error = (...args: any) => {
      if (
        args.length > 0 &&
        typeof args[0] === "string" &&
        args[0].includes("ResizeObserver")
      ) {
        return;
      }
      resizeObserverError.apply(console, args);
    };
  };

  window.addEventListener("error", resizeHandler);

  onUnmounted(() => {
    window.removeEventListener("error", resizeHandler);
  });
});
</script>

<style scoped>
#login-container {
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
