import { registerStyle } from '@/containers/style-container.js';

function removeDistPath(url) {
  return url.replace('/pages/DefaultLayout', '/layouts/DefaultLayout/DefaultLayout')
}

async function createAutoInstaller(
  metaUrl,
  {
    componentFile,
    exportName,
    styleFile = 'style.css'
  }
) {
  if (!componentFile || !exportName) {
    throw new Error(`createAutoInstaller 需要指定 componentFile 與 exportName`)
  }

  const baseUrl = metaUrl.slice(0, metaUrl.lastIndexOf('/'));
  const isBundled = typeof window !== 'undefined' && window.__IS_BUNDLED_COMPONENTS__ === true;

  let component;
  let cssText = '';

  if (isBundled) {
    // ✅ 打包後：直接從全域物件中取得模組，不連網
    const mod = window.__BUNDLED_COMPONENTS__?.[componentFile];
    if (!mod) throw new Error(`❌ 找不到已打包元件：${componentFile}`)
    component = mod[exportName];
    cssText = ''; // 打包模式預期已整合 CSS
  } else {
    // 🧪 開發階段：正常動態 import + fetch CSS
    const url = removeDistPath(`${baseUrl}/${componentFile}`)
      .replace('/dist/', '/')
      .replace('/pages', '/components');

    const [mod, css] = await Promise.all([
      import(fixComponentUrl(url)),
      loadStyle(baseUrl, styleFile)
    ]);

    component = mod[exportName];
    cssText = css;
  }

  if (!component) {
    throw new Error(`❌ 找不到匯出的元件：${exportName} in ${componentFile}`)
  }

  if (cssText?.trim()) {
    registerStyle(component.name || exportName, cssText);
  }

  if (typeof component.install !== 'function') {
    component.install = function (app) {
      app.component(component.name || exportName, component);
    };
  }

  return component
}

// 輔助函式：處理 URL
function fixComponentUrl(url) {
  if (url.endsWith('.js')) url = url.slice(0, -3);
  const componentsPath = '/components/';
  const compIndex = url.lastIndexOf(componentsPath);
  if (compIndex === -1) return url + '.js'

  const subPath = url.slice(compIndex + componentsPath.length);
  const parts = subPath.split('/');
  const lastPart = parts.at(-1);
  const secondLastPart = parts.at(-2) || null;

  if (lastPart === secondLastPart) return url + '.js'
  return url + '/' + lastPart + '.js'
}

async function loadStyle(baseUrl, styleFile) {
  try {
    const cssUrl = removeDistPath(`${baseUrl}/${styleFile}`).replace('/dist/', '/');
    const res = await fetch(cssUrl);
    if (!res.ok) {
      console.warn(`⚠️ 樣式檔 ${styleFile} 載入失敗，狀態碼：${res.status}`);
      return ''
    }
    return await res.text()
  } catch (err) {
    console.warn(`⚠️ 樣式檔 ${styleFile} 載入異常：`, err);
    return ''
  }
}

export { createAutoInstaller as c };
