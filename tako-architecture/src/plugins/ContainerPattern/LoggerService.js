// services/LoggerService.js // 容器模式-方法或資料
class LoggerServiceTT {
  log(message) {
    console.log(`[LOG]: ${message}`);
  }
}

const LoggerService = new LoggerServiceTT();

export { LoggerService };
