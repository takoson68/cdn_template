// _NotificationService.js：策略模式核心邏輯
export class NotificationService {
  constructor(notifier) {
    this.notifier = notifier
  }

  setNotifier(notifier) {
    this.notifier = notifier
  }

  send(message) {
    this.notifier.notify(message)
  }
}
