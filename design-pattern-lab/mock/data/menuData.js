const menu = [
  {
    path: "/design-pattern-lab/home.html",
    component: "Home",
    meta: {
      title: "首頁",
      lang: "menu_lang_00",
      description: "Welcome to the Home Page of our site.",
    },
    // children: [], // 無子路由
  },
  {
    path: "/design-pattern-lab/about.html",
    component: "About",
    meta: {
      title: "關於我們",
      lang: "menu_lang_23",
      description: "Learn more about our team and mission.",
    },
    children: [
      {
        path: "/design-pattern-lab/about_team.html",
        component: "AboutTeam",
        meta: {
          title: "團隊介紹",
          lang: "menu_lang_25",
          description: "Meet our team.",
        },
      },
      {
        path: "/design-pattern-lab/about_mission.html",
        component: "AboutMission",
        meta: {
          title: "我們的使命",
          lang: "menu_lang_26",
          description: "Our mission and vision.",
        },
      },
    ],
  },
  {
    path: "/design-pattern-lab/contact.html",
    component: "Contact",
    meta: {
      title: "聯絡我們",
      lang: "menu_lang_24",
      description: "Learn more about how to contact our team and mission.",
    },
    // children: [], // 無子路由
  },
  {
    path: "/design-pattern-lab/calendar.html",
    component: "CalendarPage",
    meta: {
      title: "萬年曆",
      lang: "menu_lang_15",
      description: "查看萬年曆並選擇日期。",
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