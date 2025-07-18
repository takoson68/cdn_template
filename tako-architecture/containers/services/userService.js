// containers/services/userService.js
class UserService {
  constructor() {
    this.users = [];
  }

  getAllUsers() {
    return this.users;
  }

  addUser(user) {
    this.users.push(user);
  }
}

const userService = new UserService();
export default userService;
