import container from './Container.js';

import testStore from './store/testStore.js'

const testContainer = container
testContainer.register('testStore', testStore)

export { testContainer }
