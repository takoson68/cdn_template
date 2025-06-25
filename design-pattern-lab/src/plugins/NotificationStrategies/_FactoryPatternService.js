//- FactoryPatternService.js : 工廠模式
import { AlertNotifier } from './AlertNotifier.js'
import { ToastNotifier } from './ToastNotifier.js'
import { ModalNotifier } from './ModalNotifier.js'

export class FactoryPatternService {
  constructor() {
    this.notifier = null
    this.strategies = {
      alert: new AlertNotifier(),
      toast: new ToastNotifier(),
      modal: new ModalNotifier(),
    }
  }

  setNotifier(type) {
    if (!this.strategies[type]) {
      throw new Error('未知的通知類型')
    }
    this.notifier = this.strategies[type]
  }

  send(message) {
    if (!this.notifier) {
      console.warn('尚未設定通知策略')
      return
    }
    this.notifier.notify(message)
  }
  
}
