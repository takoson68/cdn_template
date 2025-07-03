const menu = [
  {
    path: "/cdn_template/design-pattern-lab/home.html",
    component: "Home",
    meta: {
      title: "首頁",
      lang: "menu_lang_00",
      description: "Welcome to the Home Page of our site.",
    },
    // children: [], // 無子路由
  },
  {
    path: "/cdn_template/design-pattern-lab/about.html",
    component: "About",
    meta: {
      title: "關於我們",
      lang: "menu_lang_23",
      description: "Learn more about our team and mission.",
    },
    children: [
      {
        path: "/cdn_template/design-pattern-lab/about_team.html",
        component: "About",
        meta: {
          title: "團隊介紹",
          lang: "menu_lang_25",
          description: "Meet our team.",
        },
      },
      {
        path: "/cdn_template/design-pattern-lab/about_mission.html",
        component: "About",
        meta: {
          title: "我們的使命",
          lang: "menu_lang_26",
          description: "Our mission and vision.",
        },
      },
    ],
  },
  {
    path: "/cdn_template/design-pattern-lab/contact.html",
    component: "Contact",
    meta: {
      title: "聯絡我們",
      lang: "menu_lang_24",
      description: "Learn more about how to contact our team and mission.",
    },
    // children: [], // 無子路由
  },
  {
    path: "/cdn_template/design-pattern-lab/calendar.html",
    component: "calendar",
    meta: {
      title: "萬年曆",
      lang: "menu_lang_15",
      description: "查看萬年曆並選擇日期。",
    },
  },
  {
    path: "/cdn_template/design-pattern-lab/mtk2mad.html",
    component: "mtk2mad",
    meta: {
      title: "攻擊路徑圖",
      lang: "menu_lang_22",
      description: "攻擊路徑圖繪製功能",
    },
  },
  {
    path: "",
    component: "Language",
    meta: {
      title: "語言",
      lang: "menu_lang_27",
      description: "Learn more about our team and mission.",
    },
    children: [
      {
        path: "",
        component: "en",
        meta: {
          title: "英文",
          lang: "menu_lang_28",
          description: "Meet our team.",
        },
      },
      {
        path: "",
        component: "zh",
        meta: {
          title: "中文",
          lang: "menu_lang_29",
          description: "Our mission and vision.",
        },
      },
    ],
  },
]

export default menu;