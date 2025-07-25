import { container } from '@/containers/index-dist.js';
import { createElementBlock, openBlock, createElementVNode, toDisplayString } from '@Vue';

const tempStore = container.resolve("tempStore");
var script = {
  name: "newComponent",
  // components: { XXXXXXXXXX },
  props: {},
  data() {
    return {
      myTest: tempStore.get().myTest || {}
    };
  },
  methods: {},
  created() {
  }
};

const _hoisted_1 = { class: "component-template" };
function render(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", _hoisted_1, [
    createElementVNode(
      "h2",
      null,
      toDisplayString($data.myTest.name),
      1
      /* TEXT */
    ),
    createElementVNode(
      "p",
      null,
      "\u9019\u662F\u5143\u4EF6 " + toDisplayString($data.myTest.name) + " \u6A21\u677F!!!!!",
      1
      /* TEXT */
    ),
    _cache[0] || (_cache[0] = createElementVNode(
      "p",
      null,
      "\u8CC7\u6599\u662F\u5F9EmytestComponent\u6A21\u677F\u4F7F\u7528store\u66F4\u65B0\uFF0C\u9054\u6210\u8DE8\u5143\u4EF6\u540C\u6B65\u8CC7\u6599",
      -1
      /* CACHED */
    ))
  ]);
}

script.render = render;
script.__scopeId = "data-v-81155522";
script.__file = "src/components/newComponent/newComponent.vue";

export { script as newComponent };
