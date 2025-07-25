// scripts/generate-vue-index.mjs
import fs from 'fs'
import path from 'path'
import glob from 'fast-glob'

const vueFiles = await glob('components/*/*.vue')
const lines = vueFiles.map(file => {
  const componentName = path.basename(file, '.vue')
  const importPath = './' + path.relative('components', file).replace(/\\/g, '/')
  return `export { default as ${componentName} } from '${importPath}'`
})

const output = lines.join('\n')
fs.writeFileSync('components/vue-entry.js', output)
console.log('✅ vue-entry.js 已建立')
