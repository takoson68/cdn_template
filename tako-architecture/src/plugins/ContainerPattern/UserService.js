// ContainerPattern/UserService.js  // 容器模式-方法或資料
class UserServiceSet {
  constructor() {
    this.users = ["Alice", "Bob", "A-lin"];
  }

  getAllUsers() {
    return this.users;
  }
  addUser(user) {
    if (user && !this.users.includes(user)) {
      this.users.push(user)
    }
  }
}

const UserService = new UserServiceSet();

export { UserService };
