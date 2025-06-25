import { LogHandler } from './LogHandler.js'
import { ValidateHandler } from './ValidateHandler.js'
import { TransformHandler } from './TransformHandler.js'

export function createChain() {
  const log = new LogHandler()
  const validate = new ValidateHandler()
  const transform = new TransformHandler()

  log.setNext(validate).setNext(transform)

  return log
}
