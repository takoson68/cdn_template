// index.js
import { createAutoInstaller } from '@/components/__componentUtils.js'

export default await createAutoInstaller(import.meta.url, {
  componentFile: 'tableComponent.js',
  exportName: 'tableComponent' //- 元件的name
})
