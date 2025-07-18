// @/pages/calendar/index.js

import { createVueApp, defineComponent } from "@Vue";
import allComponents from "@/pages/_allComponents.js"
import pageComponents from "@/pages/calendar/_pageComponents.js"

export const initPage = async ({ container, api }) => {
  // 可加載資料、做權限驗證、登入等
  const otherStore = container.resolve('otherStore');

  const App = defineComponent({
    name: "calendarApp",
    // components: { calendarComponent, tableComponent },
    data() {
      return {
        indexPage: "calendar",
        showMenu: false, //- 控制是否顯示左側菜單 //- 如果是true就下面可以省略不傳
        testBox: "這是 calendar 頁面的內容",
        highlightedDates: [],
        users: [],
        indexMonth: [],
        indexMonthTitle: '',
        // 動態取得當前年月 // 格式化為 "YYYY-MM"
        currentMonth: new Date().toISOString().slice(0, 7),
        editableFields:[['id','帳號'],['name','名稱'], ['age','年齡'], ['email','電子信箱']], // 僅允許修改 `name` 和 `email`,'age'
        rgDay: [],
      };
    },
    template: `
      <DefaultLayout :showMenu="showMenu" :indexPage="indexPage" :testBox="testBox">
        <template #coverNoMemu>
          <div class="leftBox">
            <calendarComponent :indexMonth="indexMonth" @date-selected="onDateSelected" />
          </div>
        </template>

        <template #conApp>
          <div class="conApp dateR">
            <h4><span> {{ indexMonthTitle }}</span></h4>
            <tableComponent :users="indexMonth" :showset="true" :editable-fields="editableFields"/>
            <hr>
            <tableComponent :users="users"/>

          </div>
        </template>
      </DefaultLayout>
    `,
    created() {
      this.callData();
    },
    methods: {
      onDateSelected(date) {
        console.log('選中的日期:', date);
        console.log(`共： ${date?.length} 天`);
        
        if (Array.isArray(date)) {
          // 如果資料是陣列，就代表會帶入範圍日期
          console.log("資料是陣列", date);
        } else if (typeof date === "string") {
          // 如果資料是字串，就代表他是選擇月份切換
          this.indexMonthTitle = date 
          this.indexMonth = this.getUsersByMonth(this.users, date);
        } else {
          // 這裡應該是 undefined
          console.log("資料 -- undefined");
        }
  
      },
      async callData() {
        try {
          const data = await api.get('/api/data');
          console.log('Data:', data);
          this.highlightedDates = data.data
          otherStore.set(this.highlightedDates)
          this.users = this.highlightedDates;
          const currentMonth = new Date().toISOString().slice(0, 7);
          this.indexMonth = this.getUsersByMonth(this.users, currentMonth);

        } catch (error) {
          console.error('Error:', error);
          this.highlightedDates = mock.generateUsers()
          otherStore.set(this.highlightedDates)
          this.users = this.highlightedDates;
  
          const currentMonth = new Date().toISOString().slice(0, 7);
          this.indexMonth = this.getUsersByMonth(this.users, currentMonth);
        }
      },
      // 函式：依指定月份篩選資料
      getUsersByMonth(users, month) {
        this.indexMonthTitle = month
        let mhData = users.filter(user => {
          const userMonth = user.date.slice(0, 7); // 取得 "YYYY-MM" 格式
          return userMonth === month;
        });
        if(mhData.length===0){
          let dd = [{
              id: '000000',
              name: '無資料',
              email: '無資料',
              date: '無資料',
              age: '無資料'
            }]
          mhData = dd
        }
        // console.log(mhData);
        return mhData
      },
    },
    mounted(){
      
    },
  });

  const app = createVueApp(App);

  // DefaultLayout 從這邊載入註冊
  app.use(allComponents)   // 常駐 元件註冊並注入 CSS
  app.use(pageComponents)   // 集中分頁 元件註冊並注入 CSS
  
  app.mount("#app");
};
