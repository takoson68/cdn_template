// index.js
import { createAutoInstaller } from '@/components/__componentUtils.js'

export default await createAutoInstaller(import.meta.url, {
  componentFile: 'menuComponent.js',
  exportName: 'menuComponent' //- 元件的name
})
