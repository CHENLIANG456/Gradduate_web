import MyAxios from "../request";

interface UserRegisterParams {
  username: string;
  password: string;
  email: string;
  phone: string;
}

interface UserLoginParams {
  username: string;
  password: string;
}

interface UserLogoutParams {
  token: string;
}

interface GetUserListParams {
  username: string;
}

// 用户注册
export const userRegister = async (params: UserRegisterParams) => {
  return await MyAxios.request({
    url: "/api/user/register",
    method: "post",
    data: params,
  });
};

// 用户登录
export const userLogin = async (params: UserLoginParams) => {
  return await MyAxios.request({
    url: "/api/user/login",
    method: "post",
    data: params,
  });
};

// 用户注销
export const userLogout = async (params: UserLogoutParams) => {
  return await MyAxios.request({
    url: "/api/user/logout",
    method: "post",
    data: params,
  });
};

// 获取当前用户信息
export const getCurrentUserInfo = async () => {
  return await MyAxios.request({
    url: "/api/user/info",
    method: "get",
  });
};

// 获取用户列表
export const getUserList = async (params: GetUserListParams) => {
  return await MyAxios.request({
    url: "/api/user/list",
    method: "get",
    params: {
      username: params.username,
    },
  });
};

// 删除用户
export const deleteUser = async (id: string) => {
  return await MyAxios.request({
    url: "/api/user/delete",
    method: "post",
    data: id,
    headers: {
      "Content-Type": "application/json",
    },
  });
};
