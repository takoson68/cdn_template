// _ServiceContainer.js  // 容器模式-管理方法

class ServiceContainer {
  constructor() {
    this.services = {};
  }

  register(name, service) {
    this.services[name] = service;
  }

  resolve(name) {
    if (!this.services[name]) {
      throw new Error(`服務 ${name} 尚未註冊`);
    }
    return this.services[name];
  }
  has(name) {
    return this.services.has(name)
  }
}

const container = new ServiceContainer();

export { container };
