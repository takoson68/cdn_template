// index.js
import { createAutoInstaller } from '@/components/__componentUtils.js'

export default await createAutoInstaller(import.meta.url, {
  componentFile: 'listUseStarTemp.js',
  exportName: 'listUseStarTemp' //- 元件的name
})
