#!/usr/bin/env node
const fs = require('fs')
const path = require('path')
const process = require('process')
// scripts/create-component.js


// 用法: node scripts/create-component.js about

const rawName = process.argv[2]
if (!rawName) {
  console.error('❌ 請輸入元件名稱，例如：about')
  process.exit(1)
}

// const folderName = rawName.toLowerCase()
const folderName = rawName
//- 因為會引起大小寫導致名稱錯亂所以統一用原來的名稱
// const exportName = `${capitalize(rawName)}`
// function capitalize(str) {
//   return str.charAt(0).toUpperCase() + str.slice(1)
// }

const componentDir = path.resolve(`./design-pattern-lab/src/components/${folderName}`)
if (fs.existsSync(componentDir)) {
  console.error(`❌ 資料夾已存在：${componentDir}`)
  process.exit(1)
}

fs.mkdirSync(componentDir, { recursive: true })

// component.js
fs.writeFileSync(
  path.join(componentDir, folderName+'.js'),
`// @/components/${folderName}.js

const ${folderName} = {
  name: '${folderName}',
  template: '#${folderName}',
  props: {},
  data() {
    return {}
  },
  methods: {},
  created() {

  },
}

export { ${folderName} }
export default ${folderName};
`
)

// style.css
fs.writeFileSync(
  path.join(componentDir, 'style.css'),
  `.${folderName}-template {
  padding: 1rem;
  background: #f2f2f2;
  border: 1px dashed #999;
}
`
)

// style.sass
fs.writeFileSync(
path.join(componentDir, 'style.sass'),`
.${folderName}-template 
  padding: 1rem
  background: #f2f2f2
  border: 1px dashed #999

`
)

// _index.pug
fs.writeFileSync(
  path.join(componentDir, '_index.pug'),
`// _index.pug
// 將下面這個放入，要引入的頁面
//  include ../components/${folderName}/_index.pug
script(id="${folderName}" type="text/x-template")
  div( class="${folderName}-template")
    h2 新增${folderName}元件 ~~~~

`
)


// index.js
fs.writeFileSync(
  path.join(componentDir, 'index.js'),
`// index.js
import { createAutoInstaller } from '@/components/__componentUtils.js'

export default await createAutoInstaller(import.meta.url, {
  componentFile: '${rawName}.js',
  exportName: '${folderName}' //- 元件的name
})
`
)

console.log(`✅ 元件「${rawName}」已建立於：src/components/${folderName}`)
console.log(`📦 匯出名稱：${folderName}`)

