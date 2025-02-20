import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import Antd from "ant-design-vue";
import "ant-design-vue/dist/reset.css";
import { createPinia } from "pinia";
const pinia = createPinia();

// 添加全局错误处理
const handler = {
  get: function (target: any, property: any) {
    if (property === "prototype") {
      return target.prototype;
    }
    return target;
  },
};

window.onerror = function (msg, url, lineNo, columnNo, error) {
  if (msg.toString().includes("ResizeObserver")) {
    return false;
  }
  return true;
};

// 创建代理以捕获 ResizeObserver 错误
window.ResizeObserver = new Proxy(window.ResizeObserver, handler);

createApp(App).use(Antd).use(router).use(pinia).mount("#app");
