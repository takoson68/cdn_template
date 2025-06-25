// @/pages/home/_pageComponents.js

const modules = await Promise.all([
  // import('@/components/menuComponent/index.js'),
  import('@/components/todoListComponent/index.js'),
  
]);

export default {
  install(app) {
    modules.forEach(mod => {
      const component = mod.default;
      if (component.name) {
        app.component(component.name, component);
      } else {
        console.warn('Component missing name:', component);
      }
    });
  }
}
 