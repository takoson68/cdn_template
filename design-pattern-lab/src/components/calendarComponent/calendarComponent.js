// @/components/calendarComponent.js

// 將 store 引入，跨頁存取資料。
// import * as store  from '/store/index.js';
import { container } from "@/containers/index.js";

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
      this.highlightedDates = otherStore.get(this.highlightedDates)
    }, 250);
  },
};


export { calendarComponent }
export default calendarComponent;
