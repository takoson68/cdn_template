// index.js
import { createAutoInstaller } from '@/components/__componentUtils.js'

export default await createAutoInstaller(import.meta.url, {
  componentFile: 'pagination-component.js',
  exportName: 'PaginationComponent' //- 元件的name
})
 
/* 
  //- @/framework/componentUtils.js 會將 install() 封裝好
  //- 因為每個元件都會做同樣的事情，所以將它封裝
*/