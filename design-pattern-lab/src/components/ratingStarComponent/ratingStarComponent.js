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
}

export { ratingStarComponent }
export default ratingStarComponent;