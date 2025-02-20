<template>
  <div id="artifact-detect">
    <div class="detect-container">
      <h1>CBCT 图像伪影检测</h1>
      <p class="subtitle">上传 CBCT 图像进行金属伪影检测分析</p>

      <a-upload-dragger
        v-model:fileList="fileList"
        name="file"
        :maxCount="1"
        :beforeUpload="beforeUpload"
        @change="handleFileChange"
        accept=".jpg,.png,.dicom"
      >
        <p class="ant-upload-drag-icon">
          <inbox-outlined />
        </p>
        <p class="ant-upload-text">点击或拖拽文件到此区域上传</p>
        <p class="ant-upload-hint">
          支持单个文件上传，可上传 JPG/PNG/DICOM 格式
        </p>
      </a-upload-dragger>

      <div class="file-info" v-if="fileList.length">
        <span>{{ fileList[0].name }}</span>
        <a-button type="link" @click="clearFile">
          <delete-outlined />
        </a-button>
      </div>

      <div class="action-buttons">
        <a-button type="primary" @click="handleDetect" :loading="loading">
          开始检测
        </a-button>
        <a-button @click="clearAll">清除图像</a-button>
      </div>

      <div class="image-preview" v-if="fileList.length || resultImage">
        <div class="original-image">
          <h3>原始图像</h3>
          <img
            v-if="previewUrl"
            :src="previewUrl"
            alt="原始图像"
            style="max-width: 100%; height: auto; object-fit: contain"
            @load="handleImageLoad"
            @error="handleImageError"
          />
        </div>
        <div class="result-image">
          <h3>检测结果</h3>
          <img v-if="resultImage" :src="resultImage" alt="检测结果" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onBeforeUnmount } from "vue";
import { message } from "ant-design-vue";
import { InboxOutlined, DeleteOutlined } from "@ant-design/icons-vue";
import { detectArtifact } from "@/api/artifact";

const fileList = ref<any[]>([]);
const previewUrl = ref("");
const resultImage = ref("");
const loading = ref(false);

const beforeUpload = (_file: File) => {
  // 阻止自动上传
  return false;
};

const handleImageLoad = () => {
  console.log("图片加载成功");
  message.success("图片预览加载成功");
};

const handleImageError = (e: Event) => {
  console.error("图片加载失败:", e);
  message.error("图片预览加载失败");
};

const handleFileChange = (info: any) => {
  const { file } = info;
  // console.log("@@@@file@@@@@", file);
  if (file) {
    // 检查文件类型
    const validTypes = ["image/jpeg", "image/png", "application/dicom"];
    if (!validTypes.includes(file.type)) {
      message.error("请上传 JPG/PNG/DICOM 格式的文件");
      return;
    }
    // console.log("@@@@文件信息@@@@@", file);
    previewUrl.value = URL.createObjectURL(file);
    // console.log("@@@@previewUrl@@@@@", previewUrl.value);
    fileList.value = [file];
  }
};

const clearFile = () => {
  fileList.value = [];
  previewUrl.value = "";
  resultImage.value = "";
};

const clearAll = () => {
  clearFile();
};

const handleDetect = async () => {
  if (!fileList.value.length) {
    message.warning("请先上传图片");
    return;
  }

  loading.value = true;
  try {
    const maskBase64 = await detectArtifact(fileList.value[0]);
    // console.log("@@@@maskBase64@@@@@", maskBase64);
    resultImage.value = `data:image/png;base64,${maskBase64}`;
    message.success("检测完成");
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

// 组件卸载时清理 URL
onBeforeUnmount(() => {
  if (previewUrl.value && previewUrl.value.startsWith("blob:")) {
    URL.revokeObjectURL(previewUrl.value);
  }
});
</script>

<style scoped>
#artifact-detect {
  padding: 24px;
  background: #f0f2f5;
  min-height: calc(100vh - 64px - 70px);
}

.detect-container {
  max-width: 1200px;
  margin: 0 auto;
  background: white;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.subtitle {
  color: #666;
  margin-bottom: 24px;
}

.file-info {
  margin-top: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.action-buttons {
  margin-top: 24px;
  display: flex;
  justify-content: center;
  gap: 16px;
}

.image-preview {
  margin-top: 32px;
  display: flex;
  gap: 32px;
}

.original-image,
.result-image {
  flex: 1;
  text-align: center;
  border: 1px solid #eee;
  padding: 16px;
  border-radius: 8px;
  background: #fff;
}

.original-image img,
.result-image img {
  max-width: 100%;
  max-height: 400px;
  object-fit: contain;
  margin: 0 auto;
  display: block;
}

h3 {
  margin-bottom: 16px;
  color: #333;
}

:deep(.ant-upload-drag) {
  padding: 16px;
}

@media (max-width: 768px) {
  .image-preview {
    flex-direction: column;
  }
}
</style>
