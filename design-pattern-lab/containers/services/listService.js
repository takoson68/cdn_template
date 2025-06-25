// containers/services/listService.js
class ListService {
  constructor() {
    this.list = [];
  }

  setList(list) {
    this.list = list;
  }

  getList() {
    return this.list;
  }
}

const listService = new ListService();
export default listService;
