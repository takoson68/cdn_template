// containers/index.js
import container from './Container.js';
//-----可改用動態加載方式加載-------------------
import urlUtils from './utils/urlUtils.js'
import userService from './services/userService.js';
import loggerService from './services/loggerService.js';
import listService from './services/listService.js';
import languageStore from './store/languageStore.js';
import tokenStore from './store/tokenStore.js';
import menuStore from './store/menuStore.js';
import otherStore from './store/otherStore.js'
import { PageDataBridge } from './utils/PageDataBridge.js'
import todoStore from './store/todoStore.js'
import testStore from './store/testStore.js'
// 臨時倉庫
import tempStore from './store/tempStore.js'

import permissionStore from './store/permissionStore.js'
import { hasPermission } from './utils/permissionUtils.js'
import { vCan } from './directives/v-can.js'

// 註冊服務與狀態
container.register('urlUtils', urlUtils)
container.register('userService', userService);
container.register('loggerService', loggerService);
container.register('listService', listService);
container.register('languageStore', languageStore);
container.register('tokenStore', tokenStore);
container.register('menuStore', menuStore);
container.register('otherStore', otherStore);
container.register('pageDataBridge', new PageDataBridge())
container.register('todoStore', todoStore);
container.register('testStore', testStore);
// 臨時倉庫註冊
container.register('tempStore', tempStore)

container.register('permissionStore', permissionStore)
container.register('hasPermission', hasPermission)
// 提供 Vue App 用的掛載方式
container.register('can', (code) => permissionStore.has(code))

export { container };


