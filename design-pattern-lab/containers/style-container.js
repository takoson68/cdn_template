// containers/style-container.js

const styles = new Map()
const injectedSet = new Set() // 追蹤是否重複使用

export function registerStyle(name, css) {
  if (!styles.has(name)) {
    if (injectedSet.has(name)) return
    styles.set(name, css)
    const styleEl = document.createElement('style')
    styleEl.setAttribute('data-style', name)
    styleEl.textContent = css
    document.head.appendChild(styleEl)
    
    injectedSet.add(name)
  }
}

export function getStyle(name) {
  return styles.get(name)
}

export function hasStyle(name) {
  return styles.has(name)
}




