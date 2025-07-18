// rollup.config.mjs
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import alias from '@rollup/plugin-alias'
import path, { join, extname, basename, dirname } from 'path'
import { fileURLToPath } from 'url'
import { readdirSync, statSync, rmSync } from 'fs'
import banner2 from 'rollup-plugin-banner2'
import { execSync } from 'child_process'
// ⛳ __dirname 模擬
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// ✅ 每次 build 時清空 dist 資料夾
const distDir = path.resolve(__dirname, 'src/dist')
rmSync(distDir, { recursive: true, force: true }) // ⬅️ 強制遞迴刪除

// ✅ 路徑 alias
const aliasEntries = [
  { find: '@', replacement: path.resolve(__dirname, 'src') },
  { find: '@Vue', replacement: path.resolve(__dirname, 'vendors/vue/vue.esm-browser.prod.js') }
]

// ✅ 外部排除模組
const externalLibs = [
  'vue',
  '@Vue',
  '@/containers/index-dist.js',
  '@/api/index.js',
  '@/api/index-dist.js',
  '../../vendors/vue/vue.esm-browser.prod.js',
  '../vendors/vue/vue.esm-browser.prod.js',
  '@/containers/directives/v-can.js',
  '@/containers/style-container.js',
  path.resolve(__dirname, '../vendors/vue/vue.min.js'),
]

// ✅ 容器單一入口
const containerConfig = {
  input: path.resolve(__dirname, 'containers/index.js'),
  output: {
    file: path.resolve(__dirname, 'containers/index-dist.js'),
    format: 'es',
    sourcemap: false
  },
  plugins: [
    alias({ entries: aliasEntries }),
    resolve(),
    commonjs()
  ],
  external: externalLibs
}
// ✅ 容器單一入口
const apiConfig = {
  input: path.resolve(__dirname, 'api/index.js'),
  output: {
    file: path.resolve(__dirname, 'api/index-dist.js'),
    format: 'es',
    sourcemap: false
  },
  plugins: [
    alias({ entries: aliasEntries }),
    resolve(),
    commonjs()
  ],
  external: externalLibs
}

// ✅ 頁面批次設定
const pagesDir = path.resolve(__dirname, 'src/pages')
const pageDirs = readdirSync(pagesDir, { withFileTypes: true })
  .filter(entry => entry.isDirectory())
  .map(entry => entry.name)

const pageConfigs = pageDirs.map(pageName => ({
  input: path.join(pagesDir, pageName, 'index.js'),
  output: {
    dir: path.resolve(__dirname, 'src/dist/pages'),
    format: 'es',
    sourcemap: false,
    entryFileNames: `${pageName}.js`
  },
  plugins: [
    alias({ entries: aliasEntries }),
    resolve(),
    commonjs()
  ],
  external: externalLibs
}))

// ⬇️ 這段是自定義 plugin：在打包完成後自動執行 build-components-css.mjs
function runCssBuildPlugin() {
  return {
    name: 'auto-run-style-bundler',
    generateBundle() {
      const scriptPath = path.resolve(__dirname, 'scripts/build-components-css.mjs')
      try {
        console.log('🚀 開始整併 components style.css ...')
        execSync(`node ${scriptPath}`, { stdio: 'inherit' })
        console.log('🎉 已完成 CSS 打包整合。')
      } catch (err) {
        console.error('❌ 自動打包 CSS 失敗：', err)
      }
    }
  }
}
const componentsConfig = {
  input: path.resolve(__dirname, 'src/components/index.js'), // 你的 components 街口
  output: {
    file: path.resolve(__dirname, 'src/components/components.js'),
    format: 'es', // ✅ 要能 script 引入，推薦 iife
    name: 'ComponentsBundle', // 全域變數名稱（optional）
    sourcemap: false,
    inlineDynamicImports: true, // ✅ 關鍵：讓所有 import 都內嵌
  },
  plugins: [
    alias({ entries: aliasEntries }),
    banner2(() => 'window.__IS_BUNDLED_COMPONENTS__ = true;\n'),
    resolve(),
    commonjs(),
    runCssBuildPlugin() // 
  ],
  external: externalLibs
}


// ✅ 匯出組合
export default [
  containerConfig,
  apiConfig,
  componentsConfig,
  // ...pageConfigs
]



//  npx rollup -c