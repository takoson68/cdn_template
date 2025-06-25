// index.js
import { createAutoInstaller } from '@/components/__componentUtils.js'

export default await createAutoInstaller(import.meta.url, {
  componentFile: 'modalComponent.js',
  exportName: 'modalComponent' //- 元件的name
})
