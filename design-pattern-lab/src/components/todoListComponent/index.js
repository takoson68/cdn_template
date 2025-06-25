// index.js
import { createAutoInstaller } from '@/components/__componentUtils.js'

export default await createAutoInstaller(import.meta.url, {
  componentFile: 'todoListComponent.js',
  exportName: 'todoListComponent' //- 元件的name
})
