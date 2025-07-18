// scripts/build-components-css.mjs
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const componentsDir = path.resolve(__dirname, '../src/components')
const outputCssPath = path.resolve(__dirname, '../css/components.css')

function findStyleFiles(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  const styles = []

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)

    if (entry.isDirectory()) {
      styles.push(...findStyleFiles(fullPath))
    } else if (entry.isFile() && entry.name === 'style.css') {
      styles.push(fullPath)
    }
  }

  return styles
}

// 🧹 先清空舊檔案
if (fs.existsSync(outputCssPath)) {
  fs.unlinkSync(outputCssPath)
}

const styleFiles = findStyleFiles(componentsDir)

const output = styleFiles.map(filePath => {
  const css = fs.readFileSync(filePath, 'utf-8')
  const relativePath = path.relative(componentsDir, filePath)
  return `/* ==== ${relativePath} ==== */\n${css}`
}).join('\n\n')

fs.mkdirSync(path.dirname(outputCssPath), { recursive: true })
fs.writeFileSync(outputCssPath, output)
console.log(`✅ 已成功打包 ${styleFiles.length} 個 style.css 檔案 -> css/components.css`)
