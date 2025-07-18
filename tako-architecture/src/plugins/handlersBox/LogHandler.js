import { AbstractHandler } from './core/AbstractHandler.js'

export class LogHandler extends AbstractHandler {
  handle(payload) {
    console.log('LogHandler:', payload)
    return super.handle(payload)
  }
}
