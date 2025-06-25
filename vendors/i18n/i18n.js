(function(global) {
  class I18n {
    constructor(defaultLang = 'zh') {
      this.language = defaultLang;
      this.languages = {};
    }

    // 動態加載語言包
    async loadLanguage(lang = this.language) { // 如果沒有提供 lang，使用預設語言
      if (!lang) {
        lang = this.language; // 防止 lang 為 null 或 undefined
      }

      if (this.languages[lang]) {
        this.language = lang;
        return; // 語言包已經存在，無需重新加載
      }

      try {
        const response = await fetch(`../lang/lang-${lang}.txt`);
        if (!response.ok) {
          throw new Error(`Failed to load language: ${lang}`);
        }
        const text = await response.text();
        this.languages[lang] = this.parseLanguageFile(text);
        this.language = lang;
      } catch (error) {
        console.error(error);
      }
    }

    // 返回當前語言所有的翻譯資料
    getCurrentLanguageData() {
      return this.languages[this.language] || {}; // 如果語言不存在則返回空對象
    }

    // 解析自定義格式的語言包
    parseLanguageFile(text) {
      const translations = {};
      const lines = text.split('\n');

      lines.forEach(line => {
        const [key, value] = line.split('=');
        if (key && value) {
          translations[key.trim()] = value.trim();
        }
      });

      return translations;
    }

    t(key, params = {}) {
      const translation = this.languages[this.language] ? this.languages[this.language][key] : null;

      if (!translation) {
        // return `Missing translation for "${key}"`;
        console.error(`Missing translation for "${key}"`)
        return key
      }
      // 動態替換翻譯中的變數
      return translation.replace(/\{(\w+)\}/g, (_, param) => params[param] || `{${param}}`);
    }

    // 切換語言
    async switchLanguage(lang) {
      await this.loadLanguage(lang);
      this.updatePageText();
    }

    // 更新頁面上所有文本
    updatePageText() {
      // 定義需要更新的屬性
      const attributes = ['lang', 'placeholder', 'value', 'title'];

      // 定義需要查詢的選擇器
      const selectors = attributes.map(attr => `[data-${attr}]`).join(', ');
      
      // 更新具有 data-lang、data-placeholder、data-value 和 data-title 的元素
      const elementsWithAttributes = document.querySelectorAll(selectors);
      elementsWithAttributes.forEach(element => {
        attributes.forEach(attr => {
          const key = element.getAttribute(`data-${attr}`);
          if (key) {
            // 根據屬性名稱動態更新對應的屬性
            const dd = attr === 'lang' ? 'innerText' : attr;
            element[dd] = this.t(key);
          }
        });
      });
    }

  }

  global.I18n = I18n;
})(window);
