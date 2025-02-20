import MyAxios from "../request";
import { message } from "ant-design-vue";

// 定义接口参数类型
interface DetectArtifactResponse {
  mask: string;
}

/**
 * 检测图像中的伪影
 * @param file 图像文件
 * @returns Promise<string> base64格式的mask图像
 */
export const detectArtifact = async (file: File): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const { data } = await MyAxios.request<DetectArtifactResponse>({
      url: "/segment",
      method: "POST",
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
      baseURL: "http://localhost:7999",
      withCredentials: true,
    });

    return data.mask;
  } catch (error) {
    console.error("检测出错:", error);
    message.error("检测失败，请重试");
    throw error;
  }
};

/**
 * 批量检测图像
 * @param files 图像文件列表
 * @returns Promise<string[]> base64格式的mask图像列表
 */
export const detectArtifactBatch = async (files: File[]): Promise<string[]> => {
  try {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append(`files`, file);
    });

    const { data } = await MyAxios.request<{ masks: string[] }>({
      url: "/segment/batch",
      method: "POST",
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
      baseURL: "http://localhost:7999",
    });

    return data.masks;
  } catch (error) {
    console.error("批量检测出错:", error);
    message.error("批量检测失败，请重试");
    throw error;
  }
};

/**
 * 获取检测历史记录
 */
export const getDetectHistory = async (params: {
  page: number;
  pageSize: number;
}) => {
  return await MyAxios.request({
    url: "/api/detect/history",
    method: "GET",
    params,
  });
};

/**
 * 删除检测记录
 */
export const deleteDetectRecord = async (id: string) => {
  return await MyAxios.request({
    url: "/api/detect/delete",
    method: "POST",
    data: id,
  });
};
