import { defineStore } from "pinia";
import { ref } from "vue";
import { getCurrentUserInfo } from "@/api/user";

interface LoginUser {
  userAccount: string;
  id?: number;
}

export const userLoginStore = defineStore("userLogin", () => {
  const loginUser = ref<LoginUser>({
    userAccount: "未登录",
  });

  // 获取用户信息
  async function getUserInfo() {
    console.log("getUserInfo@@@");
    const res = await getCurrentUserInfo();
    console.log("res@@@", res);
    if (res.data.code === 0 && res.data.data) {
      loginUser.value = res.data.data;
      console.log("loginUser@@@", loginUser.value);
    }
  }

  // 设置用户信息
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async function setUserInfo(newLoginUser: any) {
    loginUser.value = newLoginUser;
  }

  return { loginUser, getUserInfo, setUserInfo };
});
