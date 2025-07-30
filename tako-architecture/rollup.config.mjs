// rollup.config.mjs
import fs from 'fs'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import alias from '@rollup/plugin-alias'
import path, { join, extname, basename, dirname } from 'path'
import { fileURLToPath } from 'url'
import { readdirSync, statSync, rmSync } from 'fs'
import banner2 from 'rollup-plugin-banner2'
import { execSync } from 'child_process'
import glob from 'fast-glob'
import vue from 'rollup-plugin-vue'
import postcss from 'rollup-plugin-postcss'
import esbuild from 'rollup-plugin-esbuild'
import sass from 'sass' // node-sass 或 dart-sass 都行，確保已安裝
import fsExtra from 'fs-extra'
// ⛳ __dirname 模擬
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// ✅ 每次 build 時清空 dist 資料夾
const distDir = path.resolve(__dirname, 'src/dist')
rmSync(distDir, { recursive: true, force: true }) // ⬅️ 強制遞迴刪除

// ✅ 路徑 alias
const aliasEntries = [
  { find: '@Vue', replacement: path.resolve(__dirname, 'vendors/vue/vue.esm-browser.prod.js') },
  { find: 'vue', replacement: path.resolve(__dirname, 'vendors/vue/vue.esm-browser.prod.js') },
  { find: '@', replacement: path.resolve(__dirname, 'src') }
]

// ✅ 外部排除模組
const externalLibs = [
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
    generateBundle(outputOptions, bundle) {
      console.log('outputOptions:', outputOptions)
      console.log('bundle files:', Object.keys(bundle))
      for (const fileName of Object.keys(bundle)) {
        if (fileName.endsWith('.css')) {
          console.log('Found CSS:', fileName)
          // 其他邏輯...
        }
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

/**
 * 自動建立 components/vue-entry.js
 */
function generateVueEntryPlugin() {
  return {
    name: 'generate-vue-entry',
    buildStart() {
      const vueEntryPath = path.resolve(__dirname, 'src/components/vue-entry.js')
      const vueFiles = glob.sync(path.resolve(__dirname, 'src/components/*/*.vue'))

      // ➤ 自動生成每一個元件的 import 與註冊名稱
      const imports = []
      const exports = []
      const installLines = []

      for (const file of vueFiles) {
        const fileName = path.basename(file, '.vue') // e.g. myComponent
        const dirName = path.basename(path.dirname(file)) // e.g. myComponent/
        const importName = dirName // 使用資料夾名稱作為變數名（較穩定）
        const relativePath = path.relative(path.dirname(vueEntryPath), path.dirname(file)).replace(/\\/g, '/')

        imports.push(`import ${importName} from './${relativePath}/${relativePath}.vue'`)
        exports.push(importName)
        installLines.push(`    app.component('${importName}', ${importName})`)
      }

      const fileContent = `// 🚀 此檔案由 rollup.config.mjs 自動產生
${imports.join('\n')}

export {
  ${exports.join(',\n  ')}
}

export default {
  install(app) {
${installLines.join('\n')}
  }
}
`

      fs.mkdirSync(path.dirname(vueEntryPath), {
        recursive: true
      })
      fs.writeFileSync(vueEntryPath, fileContent)
      console.log(`✅ [rollup] vue-entry.js 已自動產生，共 ${vueFiles.length} 個元件`)
    }
  }
}


// 自訂 plugin 搬移 CSS（非同步，安全）
function moveCssAfterBuild() {
  return {
    name: 'move-css-after-build',
    writeBundle(outputOptions, bundle) {
      const outputDir = outputOptions.dir || path.dirname(outputOptions.file)
      for (const fileName of Object.keys(bundle)) {
        if (fileName.endsWith('.css')) {
          const cssFilePath = path.resolve(outputDir, fileName)
          const targetDir = path.resolve(__dirname, 'css')
          if (!fs.existsSync(targetDir)) {
            fs.mkdirSync(targetDir, { recursive: true })
          }
          const targetPath = path.join(targetDir, fileName)
          fs.renameSync(cssFilePath, targetPath)
          console.log(`✅ CSS 檔案搬移成功: ${targetPath}`)
        }
      }
    }
  }
}


// vueComponents 的 Rollup 設定
const vueComponents = {
  input: path.resolve(__dirname, 'src/components/vue-entry.js'),
  output: {
    file: path.resolve(__dirname, 'src/components/vueComponents.js'),
    format: 'es',
    sourcemap: false,
    paths: {
      vue: '@Vue'
    },
    // 絕對路徑的 file 用法，output.dir 與 file 不可同時設定
    // 若你想要 output 到資料夾，可改用 output.dir 及 entryFileNames
  },
  plugins: [
    generateVueEntryPlugin(),
    vue({
      preprocessStyles: true,
      preprocessOptions: {
        sass: {
          implementation: sass,
          indentedSyntax: true
        },
        stylus: {}
      }
    }),
    postcss({
      extract: 'vueComponents.css', // 僅用檔名，放在 output.file 同目錄
      minimize: true,
    }),
    resolve(),
    commonjs(),
    esbuild(),
    moveCssAfterBuild()
  ],
  external: ['vue']
}


// ✅ 匯出組合
export default [
  containerConfig,
  apiConfig,
  componentsConfig,
  vueComponents,
  // ...pageConfigs
]



//  npx rollup -c