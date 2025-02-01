<template>
  <div id="artifact-detect">
    <div class="detect-container">
      <div class="upload-section">
        <h2>CBCT 图像伪影检测</h2>
        <p class="description">上传 CBCT 图像进行金属伪影检测分析</p>

        <a-upload-dragger
          v-model:fileList="fileList"
          name="file"
          :multiple="false"
          :before-upload="beforeUpload"
          @change="handleChange"
          accept=".jpg,.jpeg,.png,.dcm"
        >
          <p class="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p class="ant-upload-text">点击或拖拽文件到此区域上传</p>
          <p class="ant-upload-hint">
            支持单个文件上传，可上传 JPG/PNG/DICOM 格式
          </p>
        </a-upload-dragger>

        <div class="action-buttons" v-if="fileList.length > 0">
          <a-button type="primary" :loading="detecting" @click="startDetection">
            开始检测
          </a-button>
          <a-button @click="clearFile"> 清除图像 </a-button>
        </div>
      </div>

      <div class="preview-section" v-if="fileList.length > 0 || resultImage">
        <div class="image-comparison">
          <div class="image-box">
            <h3>原始图像</h3>
            <div class="image-wrapper">
              <img v-if="imageUrl" :src="imageUrl" alt="原始图像" />
              <div v-else class="placeholder">请上传图像</div>
            </div>
          </div>

          <div class="image-box">
            <h3>检测结果</h3>
            <div class="image-wrapper">
              <img v-if="resultImage" :src="resultImage" alt="检测结果" />
              <div v-else class="placeholder">
                {{ detecting ? "检测中..." : "等待检测" }}
              </div>
            </div>
          </div>
        </div>

        <div class="detection-info" v-if="detectionResult">
          <a-descriptions title="检测信息" bordered>
            <a-descriptions-item label="伪影区域数量">
              {{ detectionResult.artifactCount }}
            </a-descriptions-item>
            <a-descriptions-item label="检测时间">
              {{ detectionResult.processTime }}ms
            </a-descriptions-item>
            <a-descriptions-item label="置信度">
              {{ detectionResult.confidence }}%
            </a-descriptions-item>
          </a-descriptions>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { message } from "ant-design-vue";
import { InboxOutlined } from "@ant-design/icons-vue";
import type { UploadChangeParam, UploadProps } from "ant-design-vue";

const fileList = ref<any[]>([]);
const imageUrl = ref<string>("");
const resultImage = ref<string>("");
const detecting = ref(false);
const detectionResult = ref<any>(null);

// 上传前验证
const beforeUpload = (file: File) => {
  const isJpgOrPng =
    file.type === "image/jpeg" ||
    file.type === "image/png" ||
    file.type === "application/dicom";
  if (!isJpgOrPng) {
    message.error("只能上传 JPG/PNG/DICOM 格式的图片！");
  }
  const isLt10M = file.size / 1024 / 1024 < 10;
  if (!isLt10M) {
    message.error("图片必须小于 10MB！");
  }
  return isJpgOrPng && isLt10M;
};

// 处理文件改变
const handleChange = (info: UploadChangeParam) => {
  fileList.value = info.fileList.slice(-1);

  if (info.file.status === "done") {
    getBase64(info.file.originFileObj as File, (url: string) => {
      imageUrl.value = url;
    });
  }
};

// 开始检测
const startDetection = async () => {
  if (!fileList.value.length) {
    message.warning("请先上传图像");
    return;
  }

  detecting.value = true;
  try {
    // TODO: 调用后端 API 进行检测
    // const response = await detectArtifact(fileList.value[0].originFileObj);

    // 模拟检测结果
    await new Promise((resolve) => setTimeout(resolve, 2000));

    detectionResult.value = {
      artifactCount: 3,
      processTime: 1234,
      confidence: 95.6,
    };

    // resultImage.value = response.data.resultImage;
    message.success("检测完成！");
  } catch (error) {
    message.error("检测失败，请重试");
    console.error(error);
  } finally {
    detecting.value = false;
  }
};

// 清除文件
const clearFile = () => {
  fileList.value = [];
  imageUrl.value = "";
  resultImage.value = "";
  detectionResult.value = null;
};

// 将文件转换为 base64
const getBase64 = (img: File, callback: (url: string) => void) => {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result as string));
  reader.readAsDataURL(img);
};
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

.upload-section {
  text-align: center;
  margin-bottom: 24px;
}

.upload-section h2 {
  font-size: 24px;
  color: #2c3e50;
  margin-bottom: 8px;
}

.description {
  color: #606f7b;
  margin-bottom: 24px;
}

.action-buttons {
  margin-top: 16px;
  display: flex;
  gap: 12px;
  justify-content: center;
}

.preview-section {
  margin-top: 32px;
}

.image-comparison {
  display: flex;
  gap: 24px;
  margin-bottom: 24px;
}

.image-box {
  flex: 1;
  text-align: center;
}

.image-box h3 {
  margin-bottom: 16px;
  color: #2c3e50;
}

.image-wrapper {
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  padding: 8px;
  min-height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fafafa;
}

.image-wrapper img {
  max-width: 100%;
  max-height: 400px;
  object-fit: contain;
}

.placeholder {
  color: #999;
  font-size: 14px;
}

.detection-info {
  margin-top: 24px;
}

:deep(.ant-upload-drag) {
  padding: 16px;
}

@media (max-width: 768px) {
  .image-comparison {
    flex-direction: column;
  }

  .image-wrapper {
    min-height: 200px;
  }
}
</style>
