<template>
  <div id="global-header">
    <a-row :wrap="false">
      <a-col flex="200px">
        <div class="logo">
          <img class="logo-img" src="@/assets/logo.png" alt="logo" />
          <span class="logo-text">CBCT 牙科影像优化系统</span>
        </div>
      </a-col>
      <a-col flex="auto">
        <a-menu
          v-model:selected-keys="current"
          mode="horizontal"
          :items="items"
          @click="handleMenuClick"
        />
      </a-col>
      <a-col flex="80px">
        <div class="user-login-status">
          <div v-if="store.loginUser.id">
            {{ store.loginUser.userAccount }}
          </div>
          <div v-else>
            <a-button type="primary" @click="handleLogin"> 登录 </a-button>
          </div>
        </div>
      </a-col>
    </a-row>
  </div>
</template>
<script lang="ts" setup>
import { h, ref } from "vue";
import {
  MailOutlined,
  AppstoreOutlined,
  SettingOutlined,
  CrownOutlined,
} from "@ant-design/icons-vue";
import { MenuProps } from "ant-design-vue";
import { useRouter } from "vue-router";
import { userLoginStore } from "@/store/useLoginUserStore";

const store = userLoginStore();

const router = useRouter();

const handleMenuClick = ({ key }: { key: string }) => {
  router.push({
    path: key,
  });
};

const current = ref<string[]>(["mail"]);
router.afterEach((to) => {
  current.value = [to.path];
});

const items = ref<MenuProps["items"]>([
  {
    key: "/",
    icon: () => h(MailOutlined),
    label: "主页",
    title: "主页",
  },
  {
    key: "/user/login",
    icon: () => h(AppstoreOutlined),
    label: "用户登录",
    title: "用户登录",
  },
  {
    key: "/user/register",
    icon: () => h(SettingOutlined),
    label: "用户注册",
    title: "用户注册",
  },
  {
    key: "/user/userManage",
    icon: () => h(CrownOutlined),
    label: "用户管理",
    title: "用户管理",
  },
  {
    key: "/artifact",
    label: "伪影处理",
    title: "伪影处理",
    children: [
      {
        key: "/artifact/detect",
        label: "伪影检测",
        title: "伪影检测",
      },
      {
        key: "/artifact/remove",
        label: "伪影去除",
        title: "伪影去除",
      },
    ],
  },
  {
    key: "others",
    label: h(
      "a",
      { href: "https://chat.deepseek.com/", target: "_blank" },
      "DeepSeek 编程助手"
    ),
    title: "编程",
  },
]);

const handleLogin = () => {
  router.push("/user/login");
};
</script>
<style scoped>
#global-header .logo .logo-img {
  width: 20px;
  margin-right: 10px;
}
</style>
