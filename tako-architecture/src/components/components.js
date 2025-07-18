window.__IS_BUNDLED_COMPONENTS__ = true;
import { defineComponent, ref, onMounted, nextTick } from '@Vue';
import { container } from '@/containers/index-dist.js';
import { api } from '@/api/index.js';

// @/components/loginComponent.js

const langStore$1 = container.resolve("languageStore");

const loginComponent = defineComponent({
  name: "loginComponent",
  emits: ["submit", "cancel"],
  setup(_, { emit }) {
    const username = ref("admin");
    const password = ref("123456");

    const onSubmit = (e) => {
      e.preventDefault();
      if (!username.value || !password.value) {
        alert("請輸入帳號與密碼");
        return;
      }
      emit("submit", { username: username.value, password: password.value });
    };

    onMounted(() => {
      langStore$1.replaceMenuLang();
    });

    const cancelLogin = () => {
      emit("cancel"); // 通知父層取消
    };

    return { username, password, onSubmit, cancelLogin };
  },
  template: `
    <form @submit="onSubmit" class="login-form" aria-label="登入表單">
      <label for="username"><b data-lang="cont_lang_03">帳號：</b>
        <input
          id="username"
          type="text"
          v-model="username"
          required
          autocomplete="username"
          data-i18n-placeholder="cont_lang_01"
          aria-required="true"
        />
      </label>
      <label for="password"><b data-lang="cont_lang_04">密碼：</b>
        <input
          id="password"
          type="password"
          v-model="password"
          required
          autocomplete="current-password"
          data-i18n-placeholder="cont_lang_02"
          aria-required="true"
        />
      </label>
      <div class="btnBox">
        <button type="button" @click="cancelLogin">取消</button>
        <button type="submit" data-lang="cont_lang_05">登入</button>
      </div>

    </form>
  `,
});

// @/components/menuComponent.js
const menuStore$1 = container.resolve("menuStore");
const tokenStore = container.resolve("tokenStore");
const langStore = container.resolve("languageStore");
const permissionStore = container.resolve('permissionStore');

// alert('QQQQ')
const menuComponent = {
  name: "menuComponent",
  components: {
    loginComponent 
  },
  template: `
    <nav class="topMenu">
      <ul>
        <li v-for="route in routes" :key="route.path" :class="route.component.toLowerCase()===indexUrl?'pickLi':''">
          <a v-if="route.path !== ''" :href="route.path" :data-lang="route.meta.lang">
          </a>
          <a v-else :data-lang="route.meta.lang">
            {{ langDD[route.meta.lang] }}
          </a>
          <ul v-if="route.children && route.children.length > 0" :id="'i18n-'+route.component">
            <li v-for="child in route.children" :key="child.path || child.component">
              <a v-if="child.path !== ''" :href="child.path" :data-lang="child.meta.lang">
                {{ langDD[child.meta.lang] }}
              </a>
              <a v-else @click="setLangDD(child.component)" :id="'i18n-'+child.component" :data-lang="child.meta.lang">
                {{ langDD[child.meta.lang] }}
              </a>
            </li>
          </ul>
        </li>
      </ul>
      <button v-can="'post:edit'" class="login_btn" @click="logout">
        <b>登出</b>
      </button>
      <button v-if="!token" class="login_btn" @click="toggleLogin">
        <i class="fa fa-address-card" aria-hidden="true"></i>  
        <b data-lang="cont_lang_05">登入</b>
      </button>

      <div v-if="showLogin" class="bgGary">
        <loginComponent @submit="handleLogin" @cancel="cancelLogin" />
      </div>
    </nav>
  `,
  data() {
    return {
      routes: menuStore$1.get()||[],
      showLogin: false,
      langDD: langStore.langData,
      language: langStore.getLanguage(),
      token: tokenStore.get()||'',
      indexUrl: container.resolve("urlUtils").getPageName().toLowerCase(),
    };
  },
  created() {
    if (!this.routes.length) { //- 預設應該要給空陣列所以靠長度判斷
      api.get("/api/menu").then((res) => {
        const menu = res.data;
        menuStore$1.set(menu);
        this.routes = menu;
      });
    }
    //- 若是查不到token執行
    if (!tokenStore.get()) {
      this.showLogin = true;
    }
  },
  methods: {
    async setLangDD(lang) {
      await langStore.setLanguage(lang); // 等待語言載入完成
      this.langDD = langStore.getLangData(); // 確保是最新資料

      await nextTick(); // 等畫面 DOM 更新完畢（nextTick）之後執行
      langStore.replaceMenuLang();
    },
    toggleLogin() {
      this.showLogin = !this.showLogin;
    },
    handleLogin(payload) {
      console.log("登入資訊：", payload);
      // 可執行登入請求等行為

      api.post("/api/login", payload).then((res) => {
        if (res.code === 200) {
          const token = res.token;
          tokenStore.set(token);
          const permissions = res.permissions; // 寫入權限
          permissionStore.set(permissions);

          // this.showLogin = false; // 登入成功後自動隱藏登入元件
          location.reload(); //- 重整後就不需要改showLogin

        } else {
          alert(res.message);
        }
      });
    },
    cancelLogin() {
      this.showLogin = false; // 關閉登入視窗
    },
    logout(){
      tokenStore.clear();
      permissionStore.clear();
      
      location.reload();
    },
  },
  mounted() {
    this.setLangDD(this.language);
  },
};

// @/components/listComponent.js
const menuStore = container.resolve("menuStore");

const listComponent = {
  name: "listComponent",
  template: `
    <nav class="listMenu">
      <ul>
        <li v-for="route in routes" :key="route.path">
          <a v-if="route.path !== ''" :href="route.path" :data-lang="route.meta.lang">
            {{ route.meta.title }}
          </a>
          <a v-else :id="'i18n-'+route.component" :data-lang="route.meta.lang">
            {{ route.meta.title }}
          </a>

          <ul v-if="route.children && route.children.length > 0">
            <li v-for="child in route.children" :key="child.path || child.component">
              <a v-if="child.path !== ''" :href="child.path" :data-lang="child.meta.lang">
                {{ child.meta.title }}
              </a>
              <a v-else :id="'i18n-'+route.component" :data-lang="child.meta.lang">
                {{ child.meta.title }}
              </a>
            </li>
          </ul>
        </li>
      </ul>
    </nav>
  `,

  data() {
    return {
      routes: menuStore.get(),
    };
  },

  computed: {},
  created() {
    if (!this.routes) {
      api.get("/api/menu").then((res) => {
        console.log(res.data);
        const menu = res.data;
        menuStore.set(menu);
        this.routes = menu;
      });
    }
  },
  mounted() {
    // console.log(this.routes);
  },

  methods: {},
};

// @/components/DefaultLayout.js

const DefaultLayout = {
  name: "DefaultLayout",
  components: {  menuComponent, listComponent},
  props: {
    indexPage: {
      type: String,
      required: false, // 改為非必填
      default: ''
    },
    showMenu: {
      type: Boolean, 
      required: false, // 改為非必填
      default: true    // 預設為 true，表示顯示 listComponent
    },
    testBox: {
      type: String,
      required: false // false為非必填
    },
  },
  template: `
    <div class="layout-container">
      <header class="layout-header">
      <menuComponent />
      </header>

      <main :class="'layout-main'+' '+ indexPage">
        <div class="containerBox">

          <listComponent v-if="showMenu" />

          <slot name="coverNoMemu">
            <!-- 左邊calendar月曆 (可以在不顯示菜單的地方插入元件) -->
          </slot>

          <slot name="conApp">
            <!-- 頁面主內容會顯示在這裡 -->
          </slot>
        </div>
      </main>

      <footer class="layout-footer">
        <p>© 2025 My Website
          <b v-if="!!testBox"> {{ testBox }} </b>
        </p>
      </footer>
    </div>
  `,
  data() {
    return {
      // routes: menuStore.getMenu(),
    };
  },

  computed: {},

  mounted() {
    // console.log(this.langDD);
  },

  methods: {},
};

// @/components/calendarComponent.js


const calendarComponent = {
  name: 'calendarComponent',
  template: `
    <div class="calendarTemp">
      <div class="calendar-header">
        <button class="prev" @click="prevMonth">上一月</button><span>{{ year }} 年 {{ month + 1 }} 月</span>
        <button class="next" @click="nextMonth">下一月</button>
      </div>
      <div class="calendar-body">
        <div class="calendar-week"><span v-for="day in weekDays" :key="day">{{ day }}</span></div>
        <div class="calendar-dates"><span class="calendar-date" v-for="day in days" :key="day.dateIndex" @click="handleDateClick(day)" :class="getDateClass(day)">
            {{ day.date || '' }}</span></div>
      </div>
    </div>`,
  data() {
    return {
      weekDays: ['日', '一', '二', '三', '四', '五', '六'],
      today: new Date(),
      year: new Date().getFullYear(),
      month: new Date().getMonth(),
      selectedDate: null,
      rangeSelectedDates: [], // 新增欄位
      highlightedDates: [],
    };
  },
  props: { //因為子元件傳遞出問題，所以改用store帶資料
    indexMonth: {
      type: [Array, String],
      default: () => []
    }
    // highlightedDates: {
    //   type: [Array, String],
    //   default: () => []
    // }
  },
  created() {
    // console.log('calendarComponent');
    // this.highlightedDates = store.getOther(this.highlightedDates)
  },
  computed: {
    days() {
      const startOfMonth = new Date(this.year, this.month, 1);
      const endOfMonth = new Date(this.year, this.month + 1, 0);
      const daysInMonth = endOfMonth.getDate();

      const dates = [];
      const startDayOfWeek = startOfMonth.getDay();

      // 前置空白填充
      for (let i = 0; i < startDayOfWeek; i++) {
        dates.push({ date: null, isCurrentMonth: false, dateIndex: `empty-before-${i}` });
      }

      // 當前月份日期
      for (let i = 1; i <= daysInMonth; i++) {
        const isToday = this.year === this.today.getFullYear() && this.month === this.today.getMonth() && i === this.today.getDate();
        const dayOfWeek = new Date(this.year, this.month, i).getDay();
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6; // Sunday or Saturday
        dates.push({
          date: i,
          isCurrentMonth: true,
          isToday,
          isWeekend,
          dateIndex: `current-${i}`
        });
      }

      // 後置空白填充
      const remaining = 42 - dates.length;
      for (let i = 0; i < remaining; i++) {
        dates.push({ date: null, isCurrentMonth: false, dateIndex: `empty-after-${i}` });
      }

      return dates;
    }
  },
  methods: {
    prevMonth() {
      if (this.month === 0) {
        this.month = 11;
        this.year -= 1;
      } else {
        this.month -= 1;
      }
      this.selectedDate = null;
      this.$emit('date-selected', `${this.year}-${this.month*1<9?"0"+(this.month*1+1):this.month*1+1}`);
    },
    nextMonth() {
      if (this.month === 11) {
        this.month = 0;
        this.year += 1;
      } else {
        this.month += 1;
      }
      this.selectedDate = null;
      this.$emit('date-selected', `${this.year}-${this.month*1<9?"0"+(this.month*1+1):this.month*1+1}`);
    },
    handleDateClick(day) {
      if (day.date && day.isCurrentMonth) {
        const selected = {
          date: day.date,
          month: this.month,
          year: this.year,
        };
    
        if (this.rangeSelectedDates.length > 0) {
          // 如果已有範圍，清空所有選取
          this.selectedDate = null;
          this.rangeSelectedDates = [];
          return
        } else if (
          this.selectedDate &&
          (
            this.selectedDate.date !== selected.date ||
            this.selectedDate.month !== selected.month ||
            this.selectedDate.year !== selected.year
          )
        ) {
          // 如果已選取單一日期且新日期不同，計算範圍
          const rangeStart = this.selectedDate;
          const rangeEnd = selected;
          const [start, end] = this.getOrderedRange(rangeStart, rangeEnd);
    
          this.markRangeAsSelected(start, end);
        } else {
          // 如果是同一天，取消選取
          this.selectedDate = null;
          this.rangeSelectedDates = [];
        }

        // 更新選取的日期
        this.selectedDate = selected;
    
        // 發射事件
        this.$emit('date-selected', this.rangeSelectedDates.length ? this.rangeSelectedDates : this.selectedDate);
      }
    },
    getOrderedRange(start, end) {
      const startDate = new Date(start.year, start.month, start.date);
      const endDate = new Date(end.year, end.month, end.date);
    
      return startDate <= endDate ? [start, end] : [end, start];
    },
    markRangeAsSelected(start, end) {
      this.rangeSelectedDates = [];
      const startDate = new Date(start.year, start.month, start.date);
      const endDate = new Date(end.year, end.month, end.date);
    
      let currentDate = startDate;
      while (currentDate <= endDate) {
        this.rangeSelectedDates.push({
          date: currentDate.getDate(),
          month: currentDate.getMonth(),
          year: currentDate.getFullYear(),
        });
        currentDate.setDate(currentDate.getDate() + 1);
      }
    },    
    getDateClass(day) {
      const isInRange = this.rangeSelectedDates.some(rangeDate => 
        rangeDate.date === day.date &&
        rangeDate.month === this.month &&
        rangeDate.year === this.year
      );
    
      return {
        'calendar-date--disabled': !day.isCurrentMonth,
        'calendar-date--today': day.isToday,
        'calendar-date--weekend': day.isWeekend,
        'calendar-date--selected': isInRange || (
          this.selectedDate &&
          this.selectedDate.date === day.date &&
          this.selectedDate.month === this.month &&
          this.selectedDate.year === this.year
        ),
        'calendar-date--highlighted': this.isHighlighted(day),
      };
    },
    isHighlighted(day) {
      if (!day.date || !day.isCurrentMonth) return false;
    
      const formattedDate = `${this.year}-${String(this.month + 1).padStart(2, '0')}-${String(day.date).padStart(2, '0')}`;
      // 安全判斷 indexMonth 是否為有效陣列
      return Array.isArray(this.indexMonth) && 
             this.indexMonth.some(d => d.date === formattedDate);
    }
    
  },
  mounted() {
    // console.log('子組件接收到的 highlightedDates:', this.highlightedDates);
    
    setTimeout(()=> {
      const otherStore = container.resolve('otherStore');
      this.highlightedDates = otherStore.get(this.highlightedDates);
    }, 250);
  },
};

const tempStore$1 = container.resolve('tempStore');

const ComponentTemplate = {
  name: 'ComponentTemplate',
  template: `
    <div class="component-template">
      <h2>{{myTest.name}}</h2>
      <p>這是元件模板!!!!!</p>
      <p>資料是從mytestComponent模板使用store更新，達成跨元件同步資料</p>
    </div>
  `,
  props: {},
  data() {
    return {
      myTest: tempStore$1.get()||{}
    }
  },
  methods: {},
  created() {

  },
};

const coverComponent = {
  props: ['title'],
  data() {
    return {
    };
  },
  template: `
    <div class="modal-overlay">
      <div class="modal">
        <h2 v-if="title">{{ title }}</h2>
        <!-- 使用 slot 傳入動態內容 -->
        <div class="modal-content">
          <slot></slot>
        </div>
        <!-- 操作按鈕 -->
        <span class="clo" @click="closeModal" title="關閉">X</span>
      </div>
      <div class="bgEvent" @click="closeModal"></div>
    </div>
  `,
  methods: {
    closeModal() {
      this.$emit('close'); // 向父層通知彈窗已關閉
    },
  },
};

// @/components/ratingStarComponent.js

const ratingStarComponent = {
  name: "ratingStarComponent",
  props: {
    score: {
      type: Number,
      default: 0,
    },
    max: {
      type: Number,
      default: 5,
    },
  },
  emits: ["update:score"],
  data() {
    return {
      currentScore: this.score,
      hoverScore: 0,
    };
  },
  created() {

  },
  computed: {
    stars() {
      return Array.from({ length: this.max }, (_, i) => i + 1);
    },
  },
  watch: {
    score(newVal) {
      this.currentScore = newVal;
    },
  },
  methods: {
    setRating(value) {
      this.currentScore = value;
      this.$emit("update:score", value);
    },
    highlight(value) {
      this.hoverScore = value;
    },
    resetHighlight() {
      this.hoverScore = 0;
    },
    isFilled(index) {
      return this.hoverScore
        ? index <= this.hoverScore
        : index <= this.currentScore;
    },
  },
  template: `
    <em class="rating-stars" role="radiogroup">
      <i
        v-for="star in stars"
        :key="star"
        class="star"
        :class="{ filled: isFilled(star) }"
        @click="setRating(star)"
        @mouseover="highlight(star)"
        @mouseleave="resetHighlight"
        role="radio"
        :aria-checked="isFilled(star)"
        tabindex="0"
        aria-label="評分星星"
      >★</i>
    </em>
  `,
};

// @/components/listUseStarTemp.js
const listUseStarTemp = {
  components: { ratingStarComponent },
  name: "listUseStarTemp",
  template: `
    <ul class="userBox"> 
      <li v-for="(user,ind) in items" :key="user.id">
        <div>
          <b class="nbr">{{ ind + 1 }}</b>
          <span>{{ user.name }} - {{ user.age }} </span>
          <span>
            <ratingStarComponent v-model:score="user.star">
          </span>
          <span>{{ user.email }}</span>
          <span>{{ user.date }}</span>
          <b v-if="showset" class="showsetBtn" v-show="user.age!=='無資料'" @click="showModal('修改用戶資訊', user)" title="修改">
            <i class="fa fa-cog"></i>
          </b>
        </div>
      </li>
    </ul>
  `,
  props: { 
    items: {
      type: [Array, Object],
      required: true,
      default: () => [],
    },
   },
  data() {
    return {};
  },
  methods: {},
  created() {},
};

// @/components/modalComponent.js

const modalComponent = {
  components: { coverComponent },
  props: ['title', 'data', 'editableFields'],
  data() {
    return {
      localData: Object.assign({}, this.data), // 深拷貝數據以便修改
    };
  },
  template: `
    <coverComponent :title="title">
      <!-- 這裡是表單內容 -->
      <form @submit.prevent="handleSave">
        <div v-for="field in editableFields" :key="field[0]" class="form-item">
          <label :for="field[0]">{{ field[1] }}：</label>
          <template v-if="isTextField(localData[field[0]])">
            <input :type="getInputType(localData[field[0]])" :id="field[0]" v-model="localData[field[0]]" />
          </template>
          <template v-else-if="isBooleanField(localData[field[0]])">
            <input type="checkbox" :id="field[0]" v-model="localData[field[0]]" />
          </template>
          <template v-else>
            <input type="text" :id="field[0]" v-model="localData[field[0]]" />
          </template>
        </div>

        <div class="actions">
          <button type="button" @click="closeModal">取消</button>
          <button type="submit">保存</button>
        </div>
      </form>
    </coverComponent>
  `,
  methods: {
    handleSave() {
      this.$emit('save', this.localData); // 向父層傳遞保存的數據
    },
    closeModal() {
      this.$emit('close'); // 向父層通知關閉
    },
    getInputType(value) {
      if (typeof value === 'number') return 'number';
      if (typeof value === 'string') {
        return value.includes('@') ? 'email' : 'text';
      }
      if (Object.prototype.toString.call(value) === '[object Date]') return 'date';
      return 'text';
    },
    isTextField(value) {
      return typeof value === 'string' || typeof value === 'number';
    },
    isBooleanField(value) {
      return typeof value === 'boolean';
    },
  },
};

// @/components/mytestComponent.js

const tempStore = container.resolve('tempStore');
// 設定臨時條件
tempStore.set('myTest.name', 'ＯＴＴＯ');

const mytestComponent = {
  name: 'mytestComponent',
  template: '#mytestComponent',
  props: {},
  data() {
    return {
      myTest: tempStore.get()
    }
  },
  methods: {
    say(){
      console.log(this.myTest.name);
    },
  },
  created() {
    console.log(container);
  },
};

// @/components/tableComponent.js

const tableComponent = {
  name: 'tableComponent',
  components: {
    modalComponent
  },
  template: `
    <ul class="userBox"> 
      <li v-for="(user,ind) in users" :key="user.id">
        <div>
          <b class="nbr">{{ ind + 1 }}</b>
          <span>{{ user.name }} - {{ user.age }} </span>
          <span>{{ user.email }}</span>
          <span>{{ user.date }}</span>
          <b v-if="showset" class="showsetBtn" v-show="user.age!=='無資料'" @click="showModal('修改用戶資訊', user)" title="修改">
            <i class="fa fa-cog"></i>
          </b>
        </div>
      </li>
    </ul>
    <modalComponent
      v-if="modalData"
      :title="modalTitle"
      :data="modalData"
      :editable-fields="editableFields"
      @close="closeModal"
      @save="saveData" />
  `,
  //-------- 使用this.$emit('close')來執行 @close="closeModal" --------
  data() {
    return {
      modalTitle: '',
      modalData: null, // 只用來存放當前彈窗的數據
      // editableFields: ['name','age', 'email'], // 僅允許修改 `name` 和 `email`,'age'
    };
  },
  props: ['users','showset','editableFields'],
  created() {

  },
  methods: {
    showModal(title, data) {
      this.modalTitle = title;
      this.modalData = data; // 傳入需要編輯的數據
    },
    closeModal() {
      this.modalData = null; // 清除彈窗數據
    },
    saveData(updatedData) {
      console.log('保存的數據：', updatedData);
      const userIndex = this.users.findIndex(user => user.id === updatedData.id);
      if (userIndex !== -1) {
        this.users[userIndex] = { ...updatedData }; // 直接更新數組中的對應物件
      }
      this.closeModal(); // 關閉彈窗
    }
    
  },
  mounted() {
  },
};

// @/components/todoListComponent.js

const todoStore = container.resolve('todoStore');

const todoListComponent = {
  name: 'todoListComponent',
  template: `
    <div class="todo-container">
      <h2>📋 待辦清單</h2>
      <hr>
      <input
        v-model="newItem"
        type="text"
        placeholder="輸入新任務"
        @keyup.enter="addItem"
        class="todo-input"
      />

      <ul class="todo-list">
        <li v-for="(item, index) in items" :key="index">
          <span @click="toggleItem(index)">
            {{ item.text }}<br>
            <small>{{ item.createdAt }}</small>
          </span>
          <button @click="removeItem(index)">✕</button>
        </li>
      </ul>
    </div>
  `,
  data() {
    return {
      newItem: '',
      items:  todoStore.get(),
    };
  },
  computed: {
  },
  methods: {
    addItem() {
      const text = this.newItem.trim();
      if (!text) return;
    
      const now = new Date();
      const timestamp = now.toLocaleString('zh-TW', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      });
    
      todoStore.addItem({
        text,
        createdAt: timestamp
      });
    
      this.newItem = '';
    },
    toggleItem(index) {
      // todoStore.toggleItem(index);
    },
    removeItem(index) {
      todoStore.removeItem(index);
    }
  }
};

// 🚀 此檔案由 generate-components-index.mjs 自動產生

var index = {
  install(app) {
    app.component('DefaultLayout', DefaultLayout);
    app.component('calendarComponent', calendarComponent);
    app.component('componentTemplate', ComponentTemplate);
    app.component('coverComponent', coverComponent);
    app.component('listComponent', listComponent);
    app.component('listUseStarTemp', listUseStarTemp);
    app.component('loginComponent', loginComponent);
    app.component('menuComponent', menuComponent);
    app.component('modalComponent', modalComponent);
    app.component('mytestComponent', mytestComponent);
    app.component('ratingStarComponent', ratingStarComponent);
    app.component('tableComponent', tableComponent);
    app.component('todoListComponent', todoListComponent);
  }
};

export { DefaultLayout, calendarComponent, ComponentTemplate as componentTemplate, coverComponent, index as default, listComponent, listUseStarTemp, loginComponent, menuComponent, modalComponent, mytestComponent, ratingStarComponent, tableComponent, todoListComponent };
