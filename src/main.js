import { createApp } from 'vue'
import './assets/main.css'
import App from './App.vue'
import router from './router'
import { useTheme } from './composables/useTheme'
import { App as CapApp } from '@capacitor/app'

// 启动时应用已保存的主题
useTheme()

const app = createApp(App).use(router).mount('#app')

// Android 返回键：返回上一页而非退出
let lastBackTime = 0
CapApp.addListener('backButton', ({ canGoBack }) => {
  if (router.currentRoute.value.path === '/') {
    const now = Date.now()
    if (now - lastBackTime < 2000) {
      CapApp.exitApp()
    } else {
      lastBackTime = now
      // 用原生 toast 提示
      const toast = document.createElement('div')
      toast.textContent = '再按一次退出应用'
      toast.style.cssText = 'position:fixed;bottom:120px;left:50%;transform:translateX(-50%);background:rgba(0,0,0,0.75);color:#fff;padding:10px 24px;border-radius:24px;font-size:14px;z-index:99999;pointer-events:none;'
      document.body.appendChild(toast)
      setTimeout(() => toast.remove(), 2000)
    }
  } else if (window.history.length > 1) {
    router.back()
  } else {
    router.push('/')
  }
})
