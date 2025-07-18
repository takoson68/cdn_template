// Container.js
class Container {
  #services = new Map();

  register(name, service) {
    if (!this.#services.has(name)) {
      this.#services.set(name, service);
    }
  }

  resolve(name) {
    if (!this.#services.has(name)) {
      throw new Error(`Service "${name}" 尚未註冊`);
    }
    return this.#services.get(name);
  }

  has(name) {
    return this.#services.has(name);
  }

  unregister(name) {
    this.#services.delete(name);
  }
}

const container = new Container();
export default container;
