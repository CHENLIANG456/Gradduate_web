/* eslint-disable */
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

// Add global component type declarations
declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elem: string]: any
    }
  }
  
  // Vue Language Server internal types
  const __VLS_NormalizeEmits: any;
  const __VLS_intrinsicElements: any;
  const __VLS_functionalComponentArgsRest: any;
}
