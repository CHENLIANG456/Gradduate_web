import MyAxios from "../request";

interface UserRegisterParams {
  userAccount: string;
  userPassword: string;
  checkPassword: string;
}

interface UserLoginParams {
  userAccount: string;
  userPassword: string;
}

interface UserLogoutParams {
  token: string;
}

interface GetUserListParams {
  userAccount: string;
  email: string;
  page: number;
  pageSize: number;
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
    method: "POST",
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
    url: "/api/user/current",
    method: "get",
  });
};

// 获取用户列表
export const getUserList = async (params: GetUserListParams) => {
  return await MyAxios.request({
    url: "/api/user/searchByPage",
    method: "get",
    params: {
      current: params.page,
      pageSize: params.pageSize,
      userAccount: params.userAccount,
      email: params.email,
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

// 导出用户列表
export const exportUserList = async () => {
  return await MyAxios.request({
    url: "/api/user/export",
    method: "get",
    responseType: "blob",
    headers: {
      "Content-Type": "application/json",
    },
  });
};

// 添加用户
export const addUser = async (params: any) => {
  return await MyAxios.request({
    url: "/api/user/add",
    method: "post",
    data: params,
  });
};

// 编辑用户
export const editUser = async (params: any) => {
  return await MyAxios.request({
    url: "/api/user/edit",
    method: "post",
    data: params,
  });
};

// 切换用户状态
export const updateUserStatus = async (params: any) => {
  return await MyAxios.request({
    url: "/api/user/updateStatus",
    method: "post",
    data: params,
  });
};
