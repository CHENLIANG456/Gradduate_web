<template>
  <div id="user-manage">
    <div class="manage-container">
      <div class="header-section">
        <h2>用户管理</h2>
        <div class="header-actions">
          <a-space>
            <a-input-search
              v-model:value="searchText"
              placeholder="搜索用户名/邮箱"
              style="width: 250px"
              @search="onSearch"
              allow-clear
            />
            <a-button type="primary" @click="handleExport"> 导出用户 </a-button>
            <a-button type="primary" @click="showAddUserModal">
              <template #icon><UserAddOutlined /></template>
              添加用户
            </a-button>
          </a-space>
        </div>
      </div>

      <!-- 用户列表 -->
      <a-table
        :columns="columns"
        :data-source="userList"
        :loading="loading"
        :pagination="pagination"
        @change="handleTableChange"
      >
        <!-- 状态列 -->
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'status'">
            <a-tag :color="record.userStatus === 1 ? 'red' : 'green'">
              {{ record.userStatus === 1 ? "禁用" : "正常" }}
            </a-tag>
          </template>

          <!-- 操作列 -->
          <template v-if="column.key === 'action'">
            <a-space>
              <a @click="showEditUserModal(record)">编辑</a>
              <a-divider type="vertical" />
              <a-popconfirm
                :title="
                  record.userStatus === 0
                    ? '确定要禁用该用户吗？'
                    : '确定要启用该用户吗？'
                "
                @confirm="toggleUserStatus(record)"
              >
                <a>{{ record.userStatus === 0 ? "禁用" : "启用" }}</a>
              </a-popconfirm>
              <a-divider type="vertical" />
              <a-popconfirm
                title="确定要删除该用户吗？"
                @confirm="deleteUser(record)"
              >
                <a class="danger-link">删除</a>
              </a-popconfirm>
            </a-space>
          </template>
        </template>
      </a-table>

      <!-- 添加/编辑用户模态框 -->
      <a-modal
        :title="modalMode === 'add' ? '添加用户' : '编辑用户'"
        :visible="modalVisible"
        @ok="handleModalOk"
        @cancel="handleModalCancel"
        :confirmLoading="modalLoading"
      >
        <a-form
          :model="userForm"
          :rules="rules"
          ref="userFormRef"
          :label-col="{ span: 6 }"
          :wrapper-col="{ span: 16 }"
        >
          <a-form-item label="用户名" name="username">
            <a-input v-model:value="userForm.username" />
          </a-form-item>
          <a-form-item label="邮箱" name="email">
            <a-input v-model:value="userForm.email" />
          </a-form-item>
          <a-form-item label="密码" name="password" v-if="modalMode === 'add'">
            <a-input-password v-model:value="userForm.password" />
          </a-form-item>
          <a-form-item
            label="确认密码"
            name="checkPassword"
            v-if="modalMode === 'add'"
          >
            <a-input-password v-model:value="userForm.checkPassword" />
          </a-form-item>
          <a-form-item label="角色" name="role">
            <a-select v-model:value="userForm.role">
              <a-select-option :value="0">普通用户</a-select-option>
              <a-select-option :value="1">管理员</a-select-option>
            </a-select>
          </a-form-item>
        </a-form>
      </a-modal>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { message } from "ant-design-vue";
import { UserAddOutlined } from "@ant-design/icons-vue";
import type { TablePaginationConfig } from "ant-design-vue";
import {
  getUserList,
  deleteUser as deleteUserApi,
  addUser,
  editUser,
  updateUserStatus,
} from "@/api/user";
import { exportUserList } from "@/api/user";

// 表格列定义
const columns = [
  {
    title: "用户名",
    dataIndex: "userAccount",
    key: "userAccount",
    sorter: true,
  },
  {
    title: "邮箱",
    dataIndex: "email",
    key: "email",
  },
  {
    title: "角色",
    dataIndex: "userRole",
    key: "role",
    filters: [
      { text: "管理员", value: 1 },
      { text: "普通用户", value: 0 },
    ],
    customRender: ({ text }: { text: number }) => {
      return text === 1 ? "管理员" : "普通用户";
    },
  },
  {
    title: "状态",
    dataIndex: "userStatus",
    key: "userStatus",
    filters: [
      { text: "正常", value: 0 },
      { text: "禁用", value: 1 },
    ],
    // 自定义渲染状态显示
    customRender: ({ text }: { text: number }) => {
      return text === 1 ? "禁用" : "正常";
    },
  },
  {
    title: "创建时间",
    dataIndex: "createTime",
    key: "createTime",
    sorter: true,
  },
  {
    title: "操作",
    key: "action",
    width: 200,
  },
];

// 状态变量
const loading = ref(false);
const searchText = ref("");
const userList = ref<any[]>([]);
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
});

// 模态框相关
const modalVisible = ref(false);
const modalLoading = ref(false);
const modalMode = ref<"add" | "edit">("add");
const userFormRef = ref();
const userForm = reactive({
  id: "",
  username: "",
  email: "",
  password: "",
  checkPassword: "",
  role: 0,
});

// 表单验证规则
const rules = {
  username: [
    { required: true, message: "请输入用户名", trigger: "blur" },
    { min: 3, message: "用户名至少3个字符", trigger: "blur" },
  ],
  email: [
    { required: true, message: "请输入邮箱", trigger: "blur" },
    { type: "email", message: "请输入有效的邮箱地址", trigger: "blur" },
  ],
  password: [
    { required: true, message: "请输入密码", trigger: "blur" },
    { min: 6, message: "密码至少6个字符", trigger: "blur" },
  ],
  checkPassword: [
    { required: true, message: "请确认密码", trigger: "blur" },
    {
      validator: async (rule: any, value: string) => {
        if (value !== userForm.password) {
          throw new Error("两次输入的密码不一致");
        }
      },
      trigger: "blur",
    },
  ],
  role: [{ required: true, message: "请选择角色", trigger: "change" }],
};

// 状态变量
const searchForm = reactive({
  userAccount: "",
  email: "",
});

// 初始化
onMounted(() => {
  fetchUserList();
});

// 获取用户列表
const fetchUserList = async () => {
  loading.value = true;
  try {
    const res = await getUserList({
      page: pagination.current,
      pageSize: pagination.pageSize,
      userAccount: searchForm.userAccount,
      email: searchForm.email,
    });

    if (res.data.code === 0) {
      userList.value = res.data.data;
      pagination.total = res.data.total;
    } else {
      message.error(res.data.message || "获取用户列表失败");
    }
  } catch (error) {
    message.error("获取用户列表失败");
  } finally {
    loading.value = false;
  }
};

// 搜索
const onSearch = (value: string) => {
  // 判断搜索内容是否像邮箱
  if (value.includes("@")) {
    searchForm.email = value;
    searchForm.userAccount = "";
  } else {
    searchForm.userAccount = value;
    searchForm.email = "";
  }
  pagination.current = 1;
  fetchUserList();
};

// 表格变化处理
const handleTableChange = (pag: TablePaginationConfig) => {
  pagination.current = pag.current || 1;
  fetchUserList();
};

// 显示添加用户模态框
const showAddUserModal = () => {
  modalMode.value = "add";
  Object.assign(userForm, {
    id: "",
    username: "",
    email: "",
    password: "",
    role: 0,
  });
  modalVisible.value = true;
};

// 显示编辑用户模态框
const showEditUserModal = (record: any) => {
  modalMode.value = "edit";
  Object.assign(userForm, {
    id: record.id,
    username: record.userAccount,
    email: record.email,
    role: record.userRole,
  });
  modalVisible.value = true;
};

// 处理模态框确认
const handleModalOk = async () => {
  try {
    await userFormRef.value.validate();
    modalLoading.value = true;

    if (modalMode.value === "add") {
      const res = await addUser({
        userAccount: userForm.username,
        email: userForm.email,
        userPassword: userForm.password,
        userRole: userForm.role,
      });
      if (res.data.code === 0) {
        message.success("添加用户成功");
      } else {
        message.error(res.data.description || "添加用户失败");
      }
    } else {
      const res = await editUser({
        id: userForm.id,
        userAccount: userForm.username,
        email: userForm.email,
        userRole: userForm.role,
      });
      if (res.data.code === 0) {
        message.success("编辑用户成功");
      } else {
        message.error(res.data.description || "编辑用户失败");
      }
    }

    modalVisible.value = false;
    fetchUserList();
  } catch (error) {
    console.error("表单验证失败:", error);
  } finally {
    modalLoading.value = false;
  }
};

// 处理模态框取消
const handleModalCancel = () => {
  modalVisible.value = false;
  userFormRef.value?.resetFields();
};

// 切换用户状态
const toggleUserStatus = async (record: any) => {
  try {
    const res = await updateUserStatus({
      id: record.id,
      userStatus: record.userStatus === 0 ? 1 : 0,
    });
    if (res.data.code === 0) {
      message.success(record.userStatus === 0 ? "禁用成功" : "启用成功");
      fetchUserList();
    } else {
      message.error(res.data.message || "操作失败");
    }
  } catch (error) {
    message.error("操作失败");
  }
};

// 删除用户
const deleteUser = async (record: any) => {
  try {
    const res = await deleteUserApi(record.id);
    if (res.data.code === 0) {
      message.success("删除成功");
      fetchUserList();
    } else {
      message.error(res.data.message || "删除失败");
    }
  } catch (error) {
    message.error("删除失败");
  }
};

// 导出用户列表
const handleExport = async () => {
  try {
    loading.value = true;
    const response = await exportUserList();

    // 创建 Blob 对象
    const blob = new Blob([response.data], {
      type: "text/csv;charset=UTF-8",
    });

    // 创建下载链接
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "users.csv";

    // 触发下载
    document.body.appendChild(link);
    link.click();

    // 清理
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    message.success("导出成功");
  } catch (error: any) {
    console.error("导出错误：", error);
    message.error("导出失败：" + (error.message || "未知错误"));
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
#user-manage {
  padding: 24px;
  background: #f0f2f5;
  min-height: calc(100vh - 64px - 70px);
}

.manage-container {
  background: white;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.header-section h2 {
  margin: 0;
  color: #2c3e50;
}

.danger-link {
  color: #ff4d4f;
}

.danger-link:hover {
  color: #ff7875;
}

:deep(.ant-table-pagination) {
  margin-bottom: 0 !important;
}
</style>
