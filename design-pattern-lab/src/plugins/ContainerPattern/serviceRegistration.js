// serviceRegistration.js // 容器模式-從這邊注入新方法或資料
import { container } from "./_ServiceContainer.js";
import { LoggerService } from "./LoggerService.js";
import { UserService } from "./UserService.js";

container.register("logger", LoggerService);
container.register("userService", UserService);
