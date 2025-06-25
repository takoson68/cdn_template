// index.js
import { createAutoInstaller } from '@/components/__componentUtils.js'

export default await createAutoInstaller(import.meta.url, {
  componentFile: 'coverComponent.js',
  exportName: 'coverComponent' //- 元件的name
})
 
/* 
  //- @/utils/auto-installer.js 這只會將 install() 封裝好
  //- 因為每個元件都會做同樣的事情，所以將它封裝
*/