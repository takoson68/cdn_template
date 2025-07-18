//- __componentUtils.js
import { registerStyle } from '@/containers/style-container.js'
function removeDistPath(url) {
  return url.replace('/pages/DefaultLayout', '/layouts/DefaultLayout/DefaultLayout');
}
export async function createAutoInstaller(
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

  const baseUrl = metaUrl.slice(0, metaUrl.lastIndexOf('/'))

  async function loadStyle(baseUrl, styleFile) {
    try {
      let cc = removeDistPath(`${baseUrl}/${styleFile}`).replace('/dist/', '/')
      // console.log(cc);
      const res = await fetch(cc);
      if (!res.ok) {
        // 404 或其他非 2xx 都會來這
        console.warn(`⚠️ 樣式檔 ${styleFile} 載入失敗，狀態碼：${res.status}`);
        return '';
      }
      return await res.text();
    } catch (err) {
      // fetch 出錯時也會進來這
      console.warn(`⚠️ 樣式檔 ${styleFile} 載入異常：`, err);
      return '';
    }
  }
  function fixComponentUrl(url) {
    // 1. 去除結尾的 .js
    if (url.endsWith('.js')) {
      url = url.slice(0, -3)
    }
  
    // 2. 擷取出 components/ 後的子路徑
    const componentsPath = '/components/'
    const compIndex = url.lastIndexOf(componentsPath)
    if (compIndex === -1) return url +'.js'// 沒有 /components/ 就原樣返回
  
    const subPath = url.slice(compIndex + componentsPath.length) // e.g., ratingStarComponent, or folder/name
  
    const parts = subPath.split('/') // e.g., ['ratingStarComponent'] 或 ['folder', 'name']
    const lastPart = parts[parts.length - 1]
    const secondLastPart = parts[parts.length - 2] || null
  
    // 3. 如果最後一段和前一段相同，就不重複補
    if (lastPart === secondLastPart) return url +'.js'
  
    // 4. 如果最後一段尚未重複，就補上
    return url + '/' + lastPart +'.js'
  }
  
  
  // 每個元件都會從這邊執行注入 CSS 
  let pp = removeDistPath(`${baseUrl}/${componentFile}`).replace('/dist/', '/').replace('/pages', '/components')
  // console.log(pp);
  const [componentModule, cssText] = await Promise.all([
    import(fixComponentUrl(pp)),
    loadStyle(baseUrl, styleFile)
  ]);
  
  

  const component = componentModule[exportName]
  if (!component) {
    throw new Error(`❌ 找不到匯出的元件：${exportName} in ${componentFile}`)
  }

  if (cssText?.trim()) {
    registerStyle(component.name || exportName, cssText)
  }

  // ✅ 加入 install 方法，使其可用 app.use()
  if (typeof component.install !== 'function') {
    component.install = function (app) {
      app.component(component.name || exportName, component)
    }
  }

  // ✅ 雙用途回傳：plugin + component
  return component
}
