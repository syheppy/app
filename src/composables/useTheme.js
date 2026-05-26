import { ref, watchEffect } from 'vue'

const themes = [
  { id: 'white', name: '纯净白', bg: '#ffffff', surface: '#f8f8f8', text: '#1a1a1a', textSecondary: '#666666', card: '#ffffff', cardBorder: '#e5e5e5' },
  { id: 'original', name: '温润暖白', bg: '#faf5ee', surface: '#faf5ee', text: '#3a302a', textSecondary: '#605850', card: '#ffffff', cardBorder: '#d8d0c8' },
  { id: 'dark', name: '暗夜星夜', bg: '#1a1a1a', surface: '#1a1a1a', text: '#e0e0e0', textSecondary: '#999999', card: '#2a2a2a', cardBorder: '#333333' }
]

const currentIndex = ref(0)

// 初始化：从 localStorage 读取
const saved = localStorage.getItem('themeIndex')
if (saved !== null) currentIndex.value = Number(saved)

const applyTheme = () => {
  const t = themes[currentIndex.value]
  const root = document.documentElement
  root.style.setProperty('--theme-bg', t.bg)
  root.style.setProperty('--theme-surface', t.surface)
  root.style.setProperty('--theme-text', t.text)
  root.style.setProperty('--theme-text-secondary', t.textSecondary)
  root.style.setProperty('--theme-card', t.card)
  root.style.setProperty('--theme-card-border', t.cardBorder)
  document.body.style.backgroundColor = t.bg
  document.body.style.color = t.text
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
