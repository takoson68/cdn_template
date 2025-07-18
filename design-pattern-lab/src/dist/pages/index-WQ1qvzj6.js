import { c as createAutoInstaller } from './__componentUtils-3Xzt3v_F.js';
import '@/containers/style-container.js';

// index.js

var index = await createAutoInstaller(import.meta.url, {
  componentFile: 'componentTemplate.js',
  exportName: 'componentTemplate' //- 元件的name
});
 
/* 
  //- @/utils/auto-installer.js 這只會將 install() 封裝好
  //- 因為每個元件都會做同樣的事情，所以將它封裝
*/

export { index as default };
