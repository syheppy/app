import { ref } from 'vue'

const themes = [
  {
    id: 'white',
    name: '纯净白',
    colors: {
      // 基础
      '--theme-bg': '#ffffff',
      '--theme-surface': '#f8f8f8',
      '--theme-text': '#1a1a1a',
      '--theme-text-secondary': '#666666',
      '--theme-card': '#ffffff',
      '--theme-card-border': '#e5e5e5',
      // Tailwind 颜色覆盖
      '--color-background': '#ffffff',
      '--color-surface': '#f8f8f8',
      '--color-on-surface': '#1a1a1a',
      '--color-on-surface-variant': '#666666',
      '--color-on-background': '#1a1a1a',
      '--color-surface-container-lowest': '#ffffff',
      '--color-surface-container-low': '#f5f5f5',
      '--color-surface-container': '#f0f0f0',
      '--color-surface-container-high': '#e8e8e8',
      '--color-surface-container-highest': '#e0e0e0',
      '--color-outline': '#888888',
      '--color-outline-variant': '#e0e0e0',
      '--color-primary-fixed': '#fce8d8',
      '--color-primary-fixed-dim': '#f0a878',
    }
  },
  {
    id: 'original',
    name: '温润暖白',
    colors: {
      '--theme-bg': '#faf5ee',
      '--theme-surface': '#faf5ee',
      '--theme-text': '#3a302a',
      '--theme-text-secondary': '#605850',
      '--theme-card': '#ffffff',
      '--theme-card-border': '#d8d0c8',
      '--color-background': '#faf5ee',
      '--color-surface': '#faf5ee',
      '--color-on-surface': '#3a302a',
      '--color-on-surface-variant': '#605850',
      '--color-on-background': '#3a302a',
      '--color-surface-container-lowest': '#ffffff',
      '--color-surface-container-low': '#f6f0e8',
      '--color-surface-container': '#f2ece4',
      '--color-surface-container-high': '#ece6dc',
      '--color-surface-container-highest': '#e6e0d6',
      '--color-outline': '#9a9088',
      '--color-outline-variant': '#d8d0c8',
      '--color-primary-fixed': '#fbe8d8',
      '--color-primary-fixed-dim': '#f0a878',
    }
  },
  {
    id: 'dark',
    name: '暗夜星夜',
    colors: {
      '--theme-bg': '#1a1a1a',
      '--theme-surface': '#1a1a1a',
      '--theme-text': '#e0e0e0',
      '--theme-text-secondary': '#999999',
      '--theme-card': '#2a2a2a',
      '--theme-card-border': '#333333',
      '--color-background': '#1a1a1a',
      '--color-surface': '#1a1a1a',
      '--color-on-surface': '#e0e0e0',
      '--color-on-surface-variant': '#999999',
      '--color-on-background': '#e0e0e0',
      '--color-surface-container-lowest': '#1e1e1e',
      '--color-surface-container-low': '#222222',
      '--color-surface-container': '#2a2a2a',
      '--color-surface-container-high': '#333333',
      '--color-surface-container-highest': '#3a3a3a',
      '--color-outline': '#666666',
      '--color-outline-variant': '#444444',
      '--color-primary-fixed': '#3a2818',
      '--color-primary-fixed-dim': '#a05020',
    }
  }
]

const currentIndex = ref(0)

// 初始化：从 localStorage 读取
const saved = localStorage.getItem('themeIndex')
if (saved !== null) currentIndex.value = Number(saved)

const applyTheme = () => {
  const t = themes[currentIndex.value]
  const root = document.documentElement

  // 应用所有颜色变量（使用 important 优先级）
  Object.entries(t.colors).forEach(([key, value]) => {
    root.style.setProperty(key, value, 'important')
  })

  document.body.style.backgroundColor = t.colors['--theme-bg']
  document.body.style.color = t.colors['--theme-text']

  // 强制重新渲染 - 触发 DOM 更新
  document.body.offsetHeight
}

// 初始应用
applyTheme()

export function useTheme() {
  const cycleTheme = () => {
    currentIndex.value = (currentIndex.value + 1) % themes.length
    localStorage.setItem('themeIndex', currentIndex.value)
    applyTheme()
  }

  const currentTheme = () => themes[currentIndex.value]
  const themeName = () => themes[currentIndex.value].name

  return { cycleTheme, currentTheme, themeName, themes, currentIndex }
}
