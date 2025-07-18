//- NotificationPlugin.js
import { NotificationService } from './NotificationStrategies/_NotificationService.js'
import { AlertNotifier } from './NotificationStrategies/AlertNotifier.js'
import { ToastNotifier } from './NotificationStrategies/ToastNotifier.js'
import { ModalNotifier } from './NotificationStrategies/ModalNotifier.js'

export default {
  name: 'NotificationPlugin',
  setup() {
    const { ref } = window.Vue
    const message = ref('這是一個通知訊息～')
    // 快取策略實例
    const strategies = {
      alert: new AlertNotifier(),
      toast: new ToastNotifier(),
      modal: new ModalNotifier(),
    }
    const service = new NotificationService(strategies.alert)
    // 這裡的 new AlertNotifier() 是預設策略注入，
    // 表示通知服務一開始預設使用 alert 的方式呈現通知訊息。
    // 這符合策略模式的核心精神：將「行為」注入 Context 中，
    // 並可在執行期間動態切換策略。


    const triggerNotification = (type) => {
      service.setNotifier(strategies[type])
      service.send(message.value)
    }
    return {
      message,
      triggerNotification,
    }
  },
  template: `
    <div>
      <h2>選擇通知策略 - NotificationPlugin</h2>
      <input type="text" v-model="message" />
      <div class="btSet">
        <button @click="triggerNotification('alert')">Alert</button>
        <button @click="triggerNotification('toast')">Toast</button>
        <button @click="triggerNotification('modal')">Modal</button>
      </div>
    </div>
  `,
  
}