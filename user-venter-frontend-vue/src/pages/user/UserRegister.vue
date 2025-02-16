<template>
  <div class="register-container">
    <div class="register-box">
      <div class="register-header">
        <h2>CBCT 影像优化系统</h2>
        <p>创建新账号</p>
      </div>

      <a-form
        :model="formState"
        name="register"
        class="register-form"
        @finish="onFinish"
        @finishFailed="onFinishFailed"
      >
        <a-form-item
          name="userAccount"
          :rules="[
            { required: true, message: '请输入用户名' },
            { min: 3, message: '用户名至少3个字符' },
          ]"
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
          name="userPassword"
          :rules="[
            { required: true, message: '请输入密码' },
            { min: 6, message: '密码至少6个字符' },
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

        <a-form-item
          name="checkPassword"
          :rules="[
            { required: true, message: '请确认密码' },
            { validator: validateConfirmPassword },
          ]"
        >
          <a-input-password
            v-model:value="formState.checkPassword"
            size="large"
            placeholder="确认密码"
          >
            <template #prefix>
              <LockOutlined class="site-form-item-icon" />
            </template>
          </a-input-password>
        </a-form-item>

        <a-form-item>
          <a-button
            :disabled="disabled"
            type="primary"
            html-type="submit"
            class="register-form-button"
            size="large"
          >
            注册
          </a-button>
          <div class="login-link">
            已有账号？ <router-link to="/user/login">立即登录</router-link>
          </div>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, computed } from "vue";
import { UserOutlined, LockOutlined } from "@ant-design/icons-vue";
import { message } from "ant-design-vue";
import { useRouter } from "vue-router";
import { userRegister } from "@/api/user";

interface FormState {
  userAccount: string;
  checkPassword: string;
  userPassword: string;
}

const router = useRouter();

const formState = reactive<FormState>({
  userAccount: "",
  userPassword: "",
  checkPassword: "",
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const validateConfirmPassword = async (_rule: any, value: string) => {
  if (value !== formState.userPassword) {
    throw new Error("两次输入的密码不一致"); // 抛出错误
  }
};

const onFinish = async (values: any) => {
  try {
    const res = await userRegister({
      userAccount: values.userAccount,
      userPassword: values.userPassword,
      checkPassword: values.checkPassword,
    });
    if (res.data.code === 0) {
      message.success("注册成功！");
      router.push("/user/login");
    } else {
      message.error(res.data.description || "注册失败");
    }
  } catch (error) {
    message.error("注册失败，请重试");
  }
};

const onFinishFailed = (errorInfo: any) => {
  console.log("Failed:", errorInfo);
};

const disabled = computed(() => {
  return !(
    formState.userAccount &&
    formState.userPassword &&
    formState.checkPassword
  );
});
</script>

<style scoped>
.register-container {
  min-height: calc(100vh - 64px - 70px);
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 20px;
}

.register-box {
  background: rgba(255, 255, 255, 0.95);
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

.register-header {
  text-align: center;
  margin-bottom: 40px;
}

.register-header h2 {
  color: #2c3e50;
  font-size: 24px;
  margin-bottom: 8px;
}

.register-header p {
  color: #606f7b;
  font-size: 14px;
}

.register-form {
  width: 100%;
}

.site-form-item-icon {
  color: rgba(0, 0, 0, 0.45);
}

.register-form-button {
  width: 100%;
  height: 40px;
  border-radius: 4px;
}

.login-link {
  text-align: center;
  margin-top: 16px;
  color: #606f7b;
}

.login-link a {
  color: #1890ff;
  transition: color 0.3s;
}

.login-link a:hover {
  color: #40a9ff;
}

:deep(.ant-input-affix-wrapper) {
  border-radius: 4px;
}

@media (max-width: 576px) {
  .register-box {
    padding: 20px;
  }

  .register-header h2 {
    font-size: 20px;
  }
}
</style>
