// index.js
import { createAutoInstaller } from '@/components/__componentUtils.js'

export default await createAutoInstaller(import.meta.url, {
  componentFile: 'mytestComponent.js',
  exportName: 'mytestComponent' //- 元件的name
})
