// scripts/generate-components-index.mjs
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const componentsDir = path.resolve(__dirname, '../src/components')
const outFile = path.resolve(componentsDir, 'index.js')

if (!fs.existsSync(componentsDir)) {
  console.error('❌ components 資料夾不存在:', componentsDir)
  process.exit(1)
}

const entries = fs.readdirSync(componentsDir, { withFileTypes: true })
  .filter(dir => dir.isDirectory())
  .map(dir => {
    const indexPath = path.join(componentsDir, dir.name, 'index.js')
    if (!fs.existsSync(indexPath)) {
      console.warn(`⚠️ 元件 ${dir.name} 缺少 index.js，略過`)
      return null
    }
    return {
      name: dir.name,
      importPath: `./${dir.name}/index.js`
    }
  })
  .filter(Boolean)

const importLines = entries.map(e => `import ${e.name} from '${e.importPath}'`).join('\n')
const exportLines = `export {\n` + entries.map(e => `  ${e.name},`).join('\n') + `\n}`
const registerLines = entries.map(e => `    app.component('${e.name}', ${e.name})`).join('\n')

const output = `// 🚀 此檔案由 generate-components-index.mjs 自動產生
${importLines}

${exportLines}

export default {
  install(app) {
${registerLines}
  }
}
`

fs.writeFileSync(outFile, output)
console.log('✅ 已成功產出靜態 components/index.js')
