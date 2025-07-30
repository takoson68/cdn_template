import { container } from '@/containers/index-dist.js';
import { createElementBlock, openBlock, createElementVNode, withDirectives, vModelText, toDisplayString } from '@Vue';

const tempStore$1 = container.resolve("tempStore");
tempStore$1.set("myTest.name", "\uFF2F\uFF34\uFF34\uFF2F");
var script$1 = {
  name: "newComponent",
  // components: { XXXXXXXXXX },
  props: {},
  data() {
    return {
      myTest: tempStore$1.get().myTest
    };
  },
  methods: {
    say() {
      console.log(this.myTest.name);
      tempStore$1.set("myTest.name", this.myTest.name);
    }
  },
  created() {
    let n = tempStore$1.get() || "\u7121\u540D\u7A31";
    console.log("mytestComponent created:", n);
    console.log(tempStore$1.get().myTest);
  }
};

const _hoisted_1$1 = { class: "mytestComponent-template" };
function render$1(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", _hoisted_1$1, [
    _cache[2] || (_cache[2] = createElementVNode(
      "h2",
      null,
      "\u65B0\u589EmytestComponent\u5143\u4EF6 ~~~~ 1",
      -1
      /* CACHED */
    )),
    _cache[3] || (_cache[3] = createElementVNode(
      "p",
      null,
      "\u9019\u88E1\u7D81\u5B9A testStore \u8CC7\u6599\u9054\u5230\u8DE8\u5143\u4EF6\u8CC7\u6599\u8655\u7406\u3002",
      -1
      /* CACHED */
    )),
    withDirectives(createElementVNode(
      "input",
      {
        "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $data.myTest.name = $event),
        placeholder: "\u8ACB\u8F38\u5165\u6587\u5B57"
      },
      null,
      512
      /* NEED_PATCH */
    ), [
      [vModelText, $data.myTest.name]
    ]),
    createElementVNode("button", {
      class: "btn",
      onClick: _cache[1] || (_cache[1] = (...args) => $options.say && $options.say(...args))
    }, "Submit")
  ]);
}

script$1.render = render$1;
script$1.__scopeId = "data-v-7de6ad4f";
script$1.__file = "src/components/mytestComponent/mytestComponent.vue";

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
      toDisplayString($data.myTest.name) + " ~~~~~",
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

var vueEntry = {
  install(app) {
    app.component("mytestComponent", script$1);
    app.component("newComponent", script);
  }
};

export { vueEntry as default, script$1 as mytestComponent, script as newComponent };
