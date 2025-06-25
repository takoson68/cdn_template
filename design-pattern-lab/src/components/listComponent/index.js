// index.js
import { createAutoInstaller } from '@/components/__componentUtils.js'

export default await createAutoInstaller(import.meta.url, {
  componentFile: 'listComponent.js',
  exportName: 'listComponent' //- 元件的name
})
