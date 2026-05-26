import { createApp } from 'vue'
import './assets/main.css'
import App from './App.vue'
import router from './router'
import { useTheme } from './composables/useTheme'

// 启动时应用已保存的主题
useTheme()

createApp(App).use(router).mount('#app')
