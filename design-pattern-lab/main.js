// main.js
//-------可以使用 @/....是因為有寫importmap.....寫在<_model.pug> ---------

//- 動態加載容器模組------// 可依情境切換模組地圖 ---------
// import { loadModulesFromMap } from '@/containers/utils/loadModulesFromMap.js'
// await loadModulesFromMap('/design-pattern-lab/containers/module-map.json')

import { container } from "@/containers/index.js";

import { api } from "@/api/index.js";

// 掛入共用工具
const urlUtils = container.resolve("urlUtils");
const pageName = urlUtils.getPageName();
const languageStore = container.resolve("languageStore");

const loadPageModule = async (page) => {
  try {
    // const module = await import(`@/pages/${page}.js`);
    const module = await import(`@/pages/${page}/index.js`);
    if (module?.initPage) {
      await module.initPage({ container, api }); // 傳入依賴
    }
  } catch (err) {
    console.error(`頁面模組 ${page} 載入失敗:`, err);
  }
};

const init = async () => {
  if (pageName) {
    await loadPageModule(pageName);
  }
  await languageStore.initLanguage();
  languageStore.replaceMenuLang();
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  // 若已經 loaded 就直接執行
  await init();
}
