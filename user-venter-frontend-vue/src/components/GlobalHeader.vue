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
          <div v-if="store.loginUser.id" class="user-info">
            <a-dropdown>
              <a class="ant-dropdown-link" @click.prevent>
                {{ store.loginUser.userAccount }}
                <DownOutlined />
              </a>
              <template #overlay>
                <a-menu>
                  <a-menu-item>
                    <a @click="handleLogout">退出登录</a>
                  </a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
          </div>
          <div v-else>
            <a-button type="primary" @click="handleLogin">登录</a-button>
          </div>
        </div>
      </a-col>
    </a-row>
  </div>
</template>
<script lang="ts" setup>
import { h, ref, computed } from "vue";
import {
  MailOutlined,
  AppstoreOutlined,
  SettingOutlined,
  CrownOutlined,
  DownOutlined,
} from "@ant-design/icons-vue";
// import { MenuProps } from "ant-design-vue";
import { useRouter } from "vue-router";
import { userLoginStore } from "@/store/useLoginUserStore";
import { message } from "ant-design-vue";

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

const items = computed(() => {
  const baseItems = [
    {
      key: "/",
      icon: () => h(MailOutlined),
      label: "主页",
      title: "主页",
    },
    {
      key: "deepseek",
      icon: () => h(AppstoreOutlined),
      label: h(
        "a",
        {
          href: "https://chat.deepseek.com/",
          target: "_blank",
          rel: "noopener noreferrer",
        },
        "DeepSeek 编程助手"
      ),
      title: "编程",
    },
  ];

  // 管理员才能看到用户管理菜单
  if (store.loginUser.userRole === 1) {
    baseItems.push({
      key: "/user/userManage",
      icon: () => h(CrownOutlined),
      label: "用户管理",
      title: "用户管理",
    });
  }

  // 登录后才能看到的菜单
  if (store.loginUser.id) {
    baseItems.push(
      {
        key: "/artifact/detect",
        icon: () => h(AppstoreOutlined),
        label: "伪影检测",
        title: "伪影检测",
      },
      {
        key: "/artifact/remove",
        icon: () => h(SettingOutlined),
        label: "伪影去除",
        title: "伪影去除",
      }
    );
  }

  return baseItems;
});

const handleLogin = () => {
  router.push("/user/login");
};

const handleLogout = () => {
  store.clearLoginUser();
  router.push("/user/login");
  message.success("退出成功");
};
</script>
<style scoped>
#global-header .logo .logo-img {
  width: 20px;
  margin-right: 10px;
}

.user-info {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.ant-dropdown-link {
  color: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  gap: 4px;
}

.ant-dropdown-link:hover {
  color: #1890ff;
}
</style>
