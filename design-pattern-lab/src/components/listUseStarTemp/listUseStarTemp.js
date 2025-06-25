// @/components/listUseStarTemp.js
import ratingStarComponent from '@/components/ratingStarComponent/index.js'
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

export { listUseStarTemp }
export default listUseStarTemp;