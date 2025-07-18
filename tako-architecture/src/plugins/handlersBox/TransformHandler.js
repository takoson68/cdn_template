import { AbstractHandler } from './core/AbstractHandler.js'

export class TransformHandler extends AbstractHandler {
  handle(payload) {
    if (payload && payload.text) {
      payload.text = payload.text.toUpperCase()
    }
    return super.handle(payload)
  }
}
