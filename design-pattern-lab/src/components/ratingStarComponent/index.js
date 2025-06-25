// index.js
import { createAutoInstaller } from '@/components/__componentUtils.js'

export default await createAutoInstaller(import.meta.url, {
  componentFile: 'ratingStarComponent.js',
  exportName: 'ratingStarComponent' //- 元件的name
})
