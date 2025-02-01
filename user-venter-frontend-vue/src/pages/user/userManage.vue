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
            />
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
            <a-tag :color="record.status === 'active' ? 'green' : 'red'">
              {{ record.status === "active" ? "正常" : "禁用" }}
            </a-tag>
          </template>

          <!-- 操作列 -->
          <template v-if="column.key === 'action'">
            <a-space>
              <a @click="showEditUserModal(record)">编辑</a>
              <a-divider type="vertical" />
              <a-popconfirm
                :title="
                  record.status === 'active'
                    ? '确定要禁用该用户吗？'
                    : '确定要启用该用户吗？'
                "
                @confirm="toggleUserStatus(record)"
              >
                <a>{{ record.status === "active" ? "禁用" : "启用" }}</a>
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
          <a-form-item label="角色" name="role">
            <a-select v-model:value="userForm.role">
              <a-select-option value="admin">管理员</a-select-option>
              <a-select-option value="user">普通用户</a-select-option>
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

// 表格列定义
const columns = [
  {
    title: "用户名",
    dataIndex: "username",
    key: "username",
    sorter: true,
  },
  {
    title: "邮箱",
    dataIndex: "email",
    key: "email",
  },
  {
    title: "角色",
    dataIndex: "role",
    key: "role",
    filters: [
      { text: "管理员", value: "admin" },
      { text: "普通用户", value: "user" },
    ],
  },
  {
    title: "状态",
    dataIndex: "status",
    key: "status",
    filters: [
      { text: "正常", value: "active" },
      { text: "禁用", value: "inactive" },
    ],
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
  role: "user",
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
  role: [{ required: true, message: "请选择角色", trigger: "change" }],
};

// 初始化
onMounted(() => {
  fetchUserList();
});

// 获取用户列表
const fetchUserList = async () => {
  loading.value = true;
  try {
    // TODO: 调用用户列表 API
    // const res = await getUserList({
    //   page: pagination.current,
    //   pageSize: pagination.pageSize,
    //   ...filters
    // });

    // 模拟数据
    userList.value = [
      {
        id: "1",
        username: "admin",
        email: "admin@example.com",
        role: "admin",
        status: "active",
        createTime: "2024-01-01 12:00:00",
      },
      // ... 更多用户数据
    ];
    pagination.total = 100;
  } catch (error) {
    message.error("获取用户列表失败");
  } finally {
    loading.value = false;
  }
};

// 搜索
const onSearch = () => {
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
    role: "user",
  });
  modalVisible.value = true;
};

// 显示编辑用户模态框
const showEditUserModal = (record: any) => {
  modalMode.value = "edit";
  Object.assign(userForm, {
    id: record.id,
    username: record.username,
    email: record.email,
    role: record.role,
  });
  modalVisible.value = true;
};

// 处理模态框确认
const handleModalOk = async () => {
  try {
    await userFormRef.value.validate();
    modalLoading.value = true;

    if (modalMode.value === "add") {
      // TODO: 调用添加用户 API
      message.success("添加用户成功");
    } else {
      // TODO: 调用编辑用户 API
      message.success("编辑用户成功");
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
    // TODO: 调用切换用户状态 API
    message.success("操作成功");
    fetchUserList();
  } catch (error) {
    message.error("操作失败");
  }
};

// 删除用户
const deleteUser = async (record: any) => {
  try {
    // TODO: 调用删除用户 API
    message.success("删除成功");
    fetchUserList();
  } catch (error) {
    message.error("删除失败");
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
