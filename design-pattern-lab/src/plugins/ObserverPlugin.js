import { api } from '@/api/index.js'
import { container } from '@/containers/index.js' // 將 tokenStore 註冊在這裡
const menuStore = container.resolve('menuStore');
export default {
  name: 'ObserverPlugin',
  template: `
    <div class="container">
      <h2>選擇地址 - ObserverPlugin</h2>

      <label>
        城市：
        <select v-model="city" @change="onCityChange">
          <option v-for="cityName in cityList" :key="cityName" :value="cityName">
            {{ cityName }}
          </option>
        </select>
      </label>

      <label>
        街道：
        <select v-model="street">
          <option v-for="s in availableStreets" :key="s" :value="s">
            {{ s }}
          </option>
        </select>
      </label>

      <p>你選擇的是：{{ city }} - {{ street }}</p>
      <br>
      <div class="btSet">
        <button @click="callMenu">callMenu</button>
        <button @click="clearMenu">清除菜單</button>
      </div>
    </div>`,

  data() {
    return {
      city: 'taipei',
      street: '',
      streetMap: {
        taipei: ['信義路', '中山路', '大安路'],
        taichung: ['公益路', '台灣大道', '一中街'],
        kaohsiung: ['中正路', '美麗島', '瑞豐夜市'],
      },
    }
  },

  computed: {
    // 自動取得城市清單
    cityList() {
      return Object.keys(this.streetMap);
    },
    // 取得目前城市對應的街道清單
    availableStreets() {
      return this.streetMap[this.city] || []
    },
  },

  mounted() {
    this.street = this.availableStreets[0]
  },

  methods: {
    onCityChange() {
      this.street = this.availableStreets[0]
    },
    callMenu(){

      api.get('/api/menu').then(res => {
        console.log(res.data);
        const menu = res.data
        menuStore.setMenu(menu);
      })
    },
    clearMenu(){
      
      menuStore.clear()
    },
  },
}
