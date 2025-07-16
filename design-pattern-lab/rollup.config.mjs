import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'

export default {
  input: './containers/index.js', // 你所有 import 的統一入口
  output: {
    file: './containers/index-dist.js',
    format: 'es', // ✅ 保持 ES Module 格式（也可設為 'iife' 或 'umd'）
    sourcemap: false
  },
  external: ['vue','Vue','@Vue','../vendors/vue/vue.esm-browser.prod.js'], // ✅ 告訴 Rollup 不要打包 vue
  plugins: [
    resolve(),   // ✅ 解析 import 的模組
    commonjs()   // ✅ 若有使用 CommonJS（可選）
  ]
}


// npx rollup -c  
// 執行指令