// utils/loadModulesFromMap.js // 動態加載容器模組--------
import container from '@/containers/Container.js'

export async function loadModulesFromMap(mapUrl) {
  const response = await fetch(mapUrl);
  const moduleMap = await response.json();
  for (const [key, modulePath] of Object.entries(moduleMap)) {
    try {
      const mod = await import(modulePath);
      // 預設匯出：可能是 function 或 instance
      const service = mod.default ?? mod;

      container.register(key, service);
      // console.log(`[ModuleLoader] Registered: ${key}`);
    } catch (err) {
      console.error(`[ModuleLoader] Failed to load ${key} from ${modulePath}`, err);
    }
  }
}
