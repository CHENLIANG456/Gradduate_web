<template>
  <div id="artifact-remove">
    <div class="remove-container">
      <div class="header-section">
        <h2>CBCT 图像伪影去除</h2>
        <p class="description">上传 CBCT 图像进行金属伪影去除处理</p>
      </div>

      <a-steps :current="currentStep" class="process-steps">
        <a-step title="参数设置" />
        <a-step v-if="showUploadStep" title="上传图像" />
        <a-step title="处理中" />
        <a-step title="结果导出" />
      </a-steps>

      <!-- 步骤1：参数设置 -->
      <div v-if="currentStep === 0" class="step-content">
        <div class="params-section">
          <a-form :model="processParams" layout="vertical">
            <a-form-item label="处理算法">
              <a-select
                v-model:value="processParams.algorithm"
                @change="handleAlgorithmChange"
              >
                <a-select-option value="algorithm1"
                  >CycleGan（需要上传图片）</a-select-option
                >
                <a-select-option value="algorithm2"
                  >Diffusion（无需上传图片）</a-select-option
                >
              </a-select>
            </a-form-item>

            <a-form-item label="处理强度">
              <a-slider
                v-model:value="processParams.intensity"
                :min="1"
                :max="100"
                :marks="{ 1: '弱', 50: '中', 100: '强' }"
              />
            </a-form-item>

            <a-form-item label="图像质量">
              <a-radio-group v-model:value="processParams.quality">
                <a-radio-button value="high">高质量</a-radio-button>
                <a-radio-button value="medium">中等</a-radio-button>
                <a-radio-button value="low">低质量</a-radio-button>
              </a-radio-group>
            </a-form-item>
          </a-form>
        </div>
      </div>

      <!-- 步骤2：上传图像 (仅算法1显示) -->
      <div v-if="currentStep === 1 && showUploadStep" class="step-content">
        <a-upload-dragger
          v-model:fileList="fileList"
          name="file"
          :multiple="false"
          :before-upload="beforeUpload"
          :customRequest="customRequest"
          @change="handleChange"
          accept=".jpg,.jpeg,.png"
        >
          <p class="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p class="ant-upload-text">点击或拖拽文件到此区域上传</p>
          <p class="ant-upload-hint">
            支持单个文件上传，可上传 JPG/PNG/JPEG 格式
          </p>
        </a-upload-dragger>
      </div>

      <!-- 步骤3：处理中 -->
      <div
        v-if="
          (showUploadStep && currentStep === 2) ||
          (!showUploadStep && currentStep === 1)
        "
        class="step-content"
      >
        <div class="processing-status">
          <a-progress
            :percent="processProgress"
            :status="processStatus"
            type="circle"
          />
          <p class="status-text">{{ processStatusText }}</p>
        </div>
      </div>

      <!-- 步骤4：结果展示 -->
      <div
        v-if="
          (showUploadStep && currentStep === 3) ||
          (!showUploadStep && currentStep === 2)
        "
        class="step-content"
      >
        <div class="result-comparison">
          <div class="image-box" v-if="showUploadStep">
            <h3>原始图像</h3>
            <div class="image-wrapper">
              <img v-if="imageUrl" :src="imageUrl" alt="原始图像" />
            </div>
          </div>

          <div class="image-box" :class="{ 'full-width': !showUploadStep }">
            <h3>处理结果</h3>
            <div class="image-wrapper">
              <img v-if="resultImage" :src="resultImage" alt="处理结果" />
            </div>
          </div>
        </div>

        <div class="export-options">
          <a-button-group>
            <a-button type="primary" @click="downloadResult">
              <DownloadOutlined />
              下载结果
            </a-button>
            <a-button @click="saveToCloud">
              <CloudUploadOutlined />
              保存到云端
            </a-button>
          </a-button-group>
        </div>
      </div>

      <!-- 步骤控制按钮 -->
      <div class="step-actions">
        <a-button v-if="currentStep > 0" @click="prevStep"> 上一步 </a-button>
        <a-button
          v-if="currentStep < (showUploadStep ? 3 : 2)"
          type="primary"
          @click="nextStep"
          :disabled="!canProceed"
        >
          {{
            (showUploadStep && currentStep === 2) ||
            (!showUploadStep && currentStep === 1)
              ? "处理中..."
              : "下一步"
          }}
        </a-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watchEffect } from "vue";
import { message } from "ant-design-vue";
import {
  InboxOutlined,
  DownloadOutlined,
  CloudUploadOutlined,
} from "@ant-design/icons-vue";
import type { UploadChangeParam } from "ant-design-vue";

// 当前步骤
const currentStep = ref(0);

// 是否显示上传步骤（算法1需要，算法2不需要）
const showUploadStep = computed(
  () => processParams.value.algorithm === "algorithm1"
);

// 文件相关
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const fileList = ref<any[]>([]);
const imageUrl = ref<string>("");
const resultImage = ref<string>("");

// 处理参数
const processParams = ref({
  algorithm: "algorithm1",
  intensity: 50,
  quality: "high",
});

// 处理进度
const processProgress = ref(0);
const processStatus = ref<"active" | "success" | "exception">("active");
const processStatusText = ref("准备处理...");

// 处理算法变更
const handleAlgorithmChange = (value: string) => {
  if (value === "algorithm2") {
    // 如果切换到算法2，重置步骤到参数设置
    currentStep.value = 0;
  }
};

// 是否可以进行下一步
const canProceed = computed(() => {
  if (!showUploadStep.value) {
    // 算法2的流程
    switch (currentStep.value) {
      case 0: // 参数设置
        return true;
      case 1: // 处理中
        return processProgress.value === 100;
      default:
        return true;
    }
  } else {
    // 算法1的流程
    switch (currentStep.value) {
      case 0: // 参数设置
        return true;
      case 1: // 上传图像
        return fileList.value.length > 0;
      case 2: // 处理中
        return processProgress.value === 100;
      default:
        return true;
    }
  }
});

// 文件上传前验证
const beforeUpload = (file: File) => {
  const isJpgOrPng =
    file.type === "image/jpeg" ||
    file.type === "image/png" ||
    file.type === "application/dicom";
  if (!isJpgOrPng) {
    message.error("只能上传 JPG/PNG 格式的图片！");
  }

  const isLt10M = file.size / 1024 / 1024 < 20;
  if (!isLt10M) {
    message.error("图片必须小于 20MB！");
    return false;
  }

  return isJpgOrPng && isLt10M;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const customRequest = (options: any) => {
  const { onSuccess, file } = options;

  // 读取文件并设置图片预览
  getBase64(file, (url: string) => {
    imageUrl.value = url;

    onSuccess({ status: "done", response: "OK" });

    // 更新文件列表
    fileList.value = [
      {
        uid: "1",
        name: file.name,
        status: "done",
        url: url,
        originFileObj: file,
      },
    ];
  });
  return {
    abort() {
      console.log("上传已取消");
    },
  };
};

// 处理文件改变
const handleChange = (info: UploadChangeParam) => {
  if (info.file.status !== "done") {
    return;
  }

  fileList.value = info.fileList.slice(-1); // 只保留最后一个文件
};

// 开始处理
const startProcess = async () => {
  processProgress.value = 0;
  processStatus.value = "active";
  processStatusText.value = "处理中...";

  // 根据选择的算法决定调用哪个API
  const apiEndpoint =
    processParams.value.algorithm === "algorithm2"
      ? "http://localhost:7997/process_image" // 使用您的新Flask API
      : "http://localhost:7998/process_image"; // 原始API端点

  try {
    let response;

    if (processParams.value.algorithm === "algorithm2") {
      // 算法2不需要图片，只需要处理参数
      const formData = new FormData();
      formData.append("intensity", processParams.value.intensity.toString());
      formData.append("quality", processParams.value.quality);

      response = await fetch(apiEndpoint, {
        method: "POST",
        body: formData,
      });
    } else {
      // 算法1需要上传图片
      const formData = new FormData();
      formData.append("file", fileList.value[0].originFileObj);
      formData.append("algorithm", processParams.value.algorithm);
      formData.append("intensity", processParams.value.intensity.toString());
      formData.append("quality", processParams.value.quality);

      response = await fetch(apiEndpoint, {
        method: "POST",
        body: formData,
      });
    }

    console.log("response", response);

    const result = await response.blob();
    resultImage.value = URL.createObjectURL(result);

    processProgress.value = 100;
    processStatus.value = "success";
    processStatusText.value = "处理完成";
    nextStep();
  } catch (error) {
    message.error((error as Error).message);
    processStatus.value = "exception";
    processStatusText.value = "处理失败";
  }
};

// 下载结果
const downloadResult = () => {
  const a = document.createElement("a");
  a.href = resultImage.value;
  a.download = "result.jpg";
  a.click();
  message.success("开始下载");
};

// 保存到云端
const saveToCloud = () => {
  // TODO: 实现云端保存功能
  message.success("已保存到云端");
};

// 步骤控制
const nextStep = () => {
  if (!showUploadStep.value) {
    // 算法2的流程（无需上传图片）
    if (currentStep.value === 0) {
      // 从参数设置直接到处理中
      startProcess();
    }
    if (currentStep.value < 2) {
      currentStep.value += 1;
    }
  } else {
    // 算法1的流程（需要上传图片）
    if (currentStep.value === 1) {
      // 上传图片后开始处理
      startProcess();
    }
    if (currentStep.value < 3) {
      currentStep.value += 1;
    }
  }
};

const prevStep = () => {
  if (currentStep.value > 0) {
    currentStep.value -= 1;
  }
};

// 工具函数
const getBase64 = (img: File, callback: (url: string) => void) => {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result as string));
  reader.readAsDataURL(img);
};
</script>

<style scoped>
#artifact-remove {
  padding: 24px;
  background: #f0f2f5;
  min-height: calc(100vh - 64px - 70px);
}

.remove-container {
  max-width: 1200px;
  margin: 0 auto;
  background: white;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.header-section {
  text-align: center;
  margin-bottom: 24px;
}

.header-section h2 {
  font-size: 24px;
  color: #2c3e50;
  margin-bottom: 8px;
}

.description {
  color: #606f7b;
}

.process-steps {
  margin: 24px 0 40px;
}

.step-content {
  min-height: 300px;
  margin: 24px 0;
}

.params-section {
  max-width: 600px;
  margin: 0 auto;
}

.processing-status {
  text-align: center;
  padding: 40px 0;
}

.status-text {
  margin-top: 16px;
  color: #606f7b;
}

.result-comparison {
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

.export-options {
  text-align: center;
  margin-top: 24px;
}

.step-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid #e8e8e8;
}

.full-width {
  flex: 1;
  width: 100%;
}

@media (max-width: 768px) {
  .result-comparison {
    flex-direction: column;
  }

  .image-wrapper {
    min-height: 200px;
  }
}
</style>
