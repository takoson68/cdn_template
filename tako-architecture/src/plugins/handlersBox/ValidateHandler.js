import { AbstractHandler } from './core/AbstractHandler.js'

export class ValidateHandler extends AbstractHandler {
  handle(payload) {
    if (!payload || typeof payload !== 'object') {
      console.warn('ValidateHandler: Invalid payload')
      return
    }
    return super.handle(payload)
  }
}
