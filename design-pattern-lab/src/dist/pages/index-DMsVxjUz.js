import { c as createAutoInstaller } from './__componentUtils-3Xzt3v_F.js';
import '@/containers/style-container.js';

// index.js

var index = await createAutoInstaller(import.meta.url, {
  componentFile: 'listUseStarTemp.js',
  exportName: 'listUseStarTemp' //- 元件的name
});

export { index as default };
