// containers/services/loggerService.js
class LoggerService {
  log(message) {
    console.log(`[LOG]: ${message}`);
  }
}

const loggerService = new LoggerService();
export default loggerService;
