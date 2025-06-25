// FactoryPatternPlugin.js

import { FactoryPatternService } from './NotificationStrategies/_FactoryPatternService.js'

export default {
  name: 'FactoryPatternPlugin',
  setup() {
    const { ref } = window.Vue

    const message = ref('這是一個通知方式（工廠模式）訊息～')
    const service = new FactoryPatternService()

    // triggerNotification 不再需要 createNotifier，因為 setNotifier 會在 FactoryPatternService 中處理
    const triggerNotification = (type) => {
      service.setNotifier(type) // 傳入通知策略類型，工廠會自動創建對應的策略物件
      service.send(message.value)
    }

    return {
      message,
      triggerNotification,
    }
  },
  template: `
    <div>
      <h2>通知方式（工廠模式）FactoryPatternPlugin</h2>
      <input type="text" v-model="message" />
      <div class="btSet">
        <button @click="triggerNotification('alert')">Alert</button>
        <button @click="triggerNotification('toast')">Toast</button>
        <button @click="triggerNotification('modal')">Modal</button>
      </div>
    </div>
  `,
}