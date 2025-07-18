// scripts/generate-components-index.mjs
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const componentsDir = path.resolve(__dirname, '../src/components')
const outFile = path.resolve(componentsDir, 'index.js') // 輸出檔案：components.js

if (!fs.existsSync(componentsDir)) {
  console.error('❌ 錯誤：components 資料夾不存在:', componentsDir)
  process.exit(1)
}

// 讀取子資料夾
const entries = fs.readdirSync(componentsDir, { withFileTypes: true })
  .filter(dir => dir.isDirectory())
  .map(dir => {
    const componentFile = path.join(componentsDir, dir.name, `${dir.name}.js`)
    if (!fs.existsSync(componentFile)) {
      console.warn(`⚠️ 元件 ${dir.name} 缺少 ${dir.name}.js，已略過`)
      return null
    }
    return {
      name: dir.name,
      importPath: `./${dir.name}/${dir.name}.js`,
      fileKey: `${dir.name}.js`
    }
  })
  .filter(Boolean)

// 產生 import 語句
const importStatements = entries
  .map(e => `import ${e.name} from '${e.importPath}'`)
  .join('\n')

// 產生 window.__BUNDLED_COMPONENTS__ 映射物件
const bundledComponentsMapping = entries
  .map(e => `  '${e.fileKey}': ${e.name}`)
  .join(',\n')

// 產生 install 註冊碼
const installStatements = entries
  .map(e => `    app.component('${e.name}', ${e.name})`)
  .join('\n')

const output = `// 🚀 此檔案由 generate-components-index.mjs 自動產生，勿手動修改

${importStatements}

// 將元件掛載到全域物件，供 createAutoInstaller 打包判斷時取得
window.__BUNDLED_COMPONENTS__ = {
${bundledComponentsMapping}
}

export default {
  install(app) {
${installStatements}
  }
}
`

fs.writeFileSync(outFile, output, 'utf-8')
console.log('✅ 已成功產出 components/components.js')
