import NotificationPlugin from './NotificationPlugin.js'
import ObserverPlugin from './ObserverPlugin.js'
import FactoryPatternPlugin from './FactoryPatternPlugin.js'
import UserListPlugin from './UserListPlugin.js'
import handlerPlugin from './handlerPlugin.js'
import { api } from '@/api/index.js'
const conApp = {
  name: "conApp",
  components: { NotificationPlugin ,ObserverPlugin,FactoryPatternPlugin,UserListPlugin,handlerPlugin},
  props: {
    testBox: {
      type: String,
      required: false
    }
  },
  template: `
    <div class="conAppInit">
      <NotificationPlugin />
      <br>
      <hr>
      <ObserverPlugin/>
      <br>
      <hr>
      <FactoryPatternPlugin/>
      <br>
      <hr>
      <UserListPlugin/>
      <br>
      <p>{{ testBox }}</p>
      <br>
      <hr>
      <handlerPlugin />
      <p>00</p>
      <p>00</p>
      <p>{{testBox}}</p>
      <p>00</p>
      <p>00</p>
      <p>00</p>
      <p>00</p>
      <p>00</p>
      <p>00</p>
      <p>00</p>
      <p>00</p>
      <p>00</p>
      <p>00</p>
      <p>00</p>
    </div>
  `,

  data() {
    return {
      // routes: menuStore.getMenu(),
    };
  },
  created() {
    // this.callData()
    
  },
  computed: {},

  mounted() {
    // console.log(this.routes);
  },

  methods: {
    callData(){

      api.get('/api/data').then(res => {
        console.log(res.data);
        
      })
    },
  },
};

conApp.install = function (app) {
  app.component(conApp.name, conApp)
}

export { conApp }
export default conApp;
