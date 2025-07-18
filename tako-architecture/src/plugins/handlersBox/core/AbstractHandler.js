export class AbstractHandler {
  constructor() {
    this.next = null
  }

  setNext(handler) {
    this.next = handler
    return handler // 可支援鏈式註冊
  }

  handle(payload) {
    if (this.next) return this.next.handle(payload)
    return payload
  }
}
