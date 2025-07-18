// build-components.mjs
import path from 'path'
import { readdirSync, statSync, writeFileSync } from 'fs'
import { rollup as rollupBuilder } from 'rollup'
import alias from '@rollup/plugin-alias'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const componentsDir = path.resolve(__dirname, 'src/components')
const indexFile = path.resolve(componentsDir, 'index.js')
const outputFile = path.resolve(__dirname, 'src/dist/components.js')

function walk(dir) {
  let results = []
  const list = readdirSync(dir, { withFileTypes: true })
  list.forEach(dirent => {
    const fullPath = path.join(dir, dirent.name)
    if (dirent.isDirectory()) {
      results = results.concat(walk(fullPath))
    } else if (
      dirent.isFile() &&
      path.extname(dirent.name) === '.js' &&
      fullPath !== indexFile
    ) {
      results.push(fullPath)
    }
  })
  return results
}

function toImportPath(file) {
  return './' + path.relative(componentsDir, file).replace(/\\/g, '/')
}

function toComponentName(file) {
  return path.basename(file, '.js')
}

function generateIndexFile() {
  const files = walk(componentsDir)
  let content = `// 🚀 此檔案由 build-components.mjs 自動產生\n`
  content += `import { defineAsyncComponent } from 'vue'\n\n`
  content += 'const components = {\n'
  files.forEach(file => {
    const name = toComponentName(file)
    const importPath = toImportPath(file)
    content += `  '${name}': () => import('${importPath}'),\n`
  })
  content += '}\n\n'
  content += `export default {\n`
  content += `  install(app) {\n`
  content += `    for (const [name, loader] of Object.entries(components)) {\n`
  content += `      app.component(name, defineAsyncComponent(loader))\n`
  content += `    }\n`
  content += `  }\n`
  content += `}\n`
  writeFileSync(indexFile, content, 'utf-8')
  console.log('✅ components/index.js 產生完成')
}

const aliasEntries = [
  { find: '@', replacement: path.resolve(__dirname, 'src') },
  { find: '@Vue', replacement: path.resolve(__dirname, 'vendors/vue/vue.esm-browser.prod.js') }
]

const externalLibs = ['vue', '@Vue']

async function build() {
  generateIndexFile()

  const bundle = await rollup({
    input: indexFile,
    plugins: [
      alias({ entries: aliasEntries }),
      resolve(),
      commonjs()
    ],
    external: externalLibs
  })

  await bundle.write({
    file: outputFile,
    format: 'es',
    sourcemap: false,
    inlineDynamicImports: true
  })

  console.log(`✅ 打包完成: ${outputFile}`)
}

build().catch(err => {
  console.error(err)
  process.exit(1)
})
