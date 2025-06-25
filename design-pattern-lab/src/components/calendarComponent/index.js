// index.js
import { createAutoInstaller } from '@/components/__componentUtils.js'

export default await createAutoInstaller(import.meta.url, {
  componentFile: 'calendarComponent.js',
  exportName: 'calendarComponent' //- 元件的name
})
