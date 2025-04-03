// This file is used to define types for Vue with Ant Design Vue

declare module "@vue/runtime-core" {
  export interface GlobalComponents {
    ASteps: typeof import("ant-design-vue")["Steps"];
    AStep: typeof import("ant-design-vue")["Step"];
    AUploadDragger: typeof import("ant-design-vue")["Upload"]["Dragger"];
    AForm: typeof import("ant-design-vue")["Form"];
    AFormItem: typeof import("ant-design-vue")["Form"]["Item"];
    ASelect: typeof import("ant-design-vue")["Select"];
    ASelectOption: typeof import("ant-design-vue")["Select"]["Option"];
    ASlider: typeof import("ant-design-vue")["Slider"];
    ARadioGroup: typeof import("ant-design-vue")["Radio"]["Group"];
    ARadioButton: typeof import("ant-design-vue")["Radio"]["Button"];
    AProgress: typeof import("ant-design-vue")["Progress"];
    AButton: typeof import("ant-design-vue")["Button"];
    AButtonGroup: typeof import("ant-design-vue")["Button"]["Group"];
  }
}

export {}; 