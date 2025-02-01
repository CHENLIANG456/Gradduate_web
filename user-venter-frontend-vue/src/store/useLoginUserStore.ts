import { defineStore } from "pinia";
import { ref } from "vue";
// import { getCurrentUserInfo } from "@/api/user";

interface LoginUser {
  userName: string;
  id?: number;
}

export const userLoginStore = defineStore("userLogin", () => {
  const loginUser = ref<LoginUser>({
    userName: "未登录",
  });

  // 获取用户信息
  async function getUserInfo() {
    console.log("getUserInfo@@@");
    // const res = await getCurrentUserInfo();
    const res = {
      data: {
        code: 1,
        data: {
          userName: "张三",
          id: 1,
        },
      },
    };
    console.log("res@@@", res);
    if (res.data.code === 0 && res.data.data) {
      loginUser.value = res.data.data;
    } else {
      //三秒后，重新获取用户信息
      setTimeout(() => {
        loginUser.value = {
          userName: "李四",
          id: 1,
        };
      }, 3000);
    }
  }

  // 设置用户信息
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async function setUserInfo(newLoginUser: any) {
    loginUser.value = newLoginUser;
  }

  return { loginUser, getUserInfo, setUserInfo };
});
