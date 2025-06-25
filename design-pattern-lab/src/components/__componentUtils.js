import { registerStyle } from '@/containers/style-container.js'

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
      const res = await fetch(`${baseUrl}/${styleFile}`);
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
  // 每個元件都會從這邊執行注入 CSS 
  const [componentModule, cssText] = await Promise.all([
    import(`${baseUrl}/${componentFile}`),
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
