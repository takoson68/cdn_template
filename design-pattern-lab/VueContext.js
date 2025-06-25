import * as Vue from '@/vendors/vue/vue.esm-browser.prod.js'

// window.Vue = Vue

// 快捷創建 App 的函式
export function createVueApp(App) {
  return Vue.createApp(App)
}

// 將常用 Vue 函數全部轉出（依你的需求自行擴增）
export const {
  ref,
  reactive,
  computed,
  watch,
  watchEffect,
  onMounted,
  onBeforeUnmount,
  onUnmounted,
  onUpdated,
  defineComponent,
  defineAsyncComponent,
  h,
  nextTick,
  provide,
  inject,
  createApp,
  toRefs,
  toRef,
  toRaw,
  isRef,
  isReactive,
  markRaw,
  unref,
  shallowRef,
  shallowReactive
} = Vue

export default Vue