import { defineStore } from "pinia";
import { ref } from "vue";
import { getCurrentUserInfo } from "@/api/user";

interface LoginUser {
  userAccount: string;
  id?: number;
  userRole: number;
  // ... 其他用户信息字段
}

export const userLoginStore = defineStore("userLogin", () => {
  const loginUser = ref<LoginUser>({
    userAccount: "未登录",
    userRole: 0,
  });

  // 获取用户信息
  async function getUserInfo() {
    // console.log("getUserInfo@@@");
    const res = await getCurrentUserInfo();
    // console.log("res@@@", res);
    if (res.data.code === 0 && res.data.data) {
      loginUser.value = res.data.data;
      // console.log("loginUser@@@", loginUser.value);
    }
  }

  // 设置用户信息
  const setLoginUser = (user: any) => {
    loginUser.value = user;
  };

  // 清除用户信息
  const clearLoginUser = () => {
    loginUser.value = {
      id: 0,
      userAccount: "",
      userRole: 0,
      // ... 重置其他字段
    };
  };

  return {
    loginUser,
    getUserInfo,
    setLoginUser,
    clearLoginUser,
  };
});
