// @/pages/calendar/_pageComponents.js

const modules = await Promise.all([
  import('@/components/calendarComponent/index.js'),
  import('@/components/tableComponent/index.js'),
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
