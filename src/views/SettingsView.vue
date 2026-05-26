<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'
import { useCart, setCartUser, clearCartMemory } from '../composables/useCart'

const router = useRouter()
const { user, signOut } = useAuth()

const nickname = user?.value?.user_metadata?.nickname || user?.value?.email?.split('@')[0] || '薯味品鉴官'

const sections = [
  {
    title: '账号管理',
    items: [
      { icon: 'person', label: '个人资料', route: '/profile/edit' },
      { icon: 'shield', label: '账号与安全' }
    ]
  },
  {
    title: '偏好设置',
    items: [
      { icon: 'notifications', label: '消息通知' },
      { icon: 'lock', label: '隐私设置' },
      { icon: 'palette', label: '切换背景', value: '温润暖白' }
    ]
  },
  {
    title: '帮助与关于',
    items: [
      { icon: 'cleaning_services', label: '清除缓存', value: '128MB' },
      { icon: 'info', label: '关于薯鲜生', value: 'v1.2.0' },
      { icon: 'description', label: '用户协议' },
      { icon: 'verified_user', label: '隐私政策' }
    ]
  }
]

const handleLogout = async () => {
  await signOut()
  setCartUser(null)
  clearCartMemory()
  router.push('/')
}

const handleItemClick = (item) => {
  if (item.route) router.push(item.route)
}
</script>

<template>
  <div class="min-h-screen font-body" style="background: #FDF5ED;">
    <!-- Header -->
    <div class="sticky top-0 z-40 bg-surface/80 backdrop-blur-md border-b border-outline-variant/20">
      <div class="flex items-center justify-between px-4 h-14 max-w-lg mx-auto">
        <button class="p-2" @click="router.back()">
          <span class="material-symbols-outlined text-on-surface">arrow_back</span>
        </button>
        <h1 class="font-headline text-lg font-bold text-on-surface">设置</h1>
        <div class="w-10"></div>
      </div>
    </div>

    <main class="max-w-lg mx-auto px-6 pb-20">
      <!-- Profile Section -->
      <div class="flex flex-col items-center mt-8">
        <div class="relative group cursor-pointer">
          <div class="w-24 h-24 rounded-full border border-primary/40 p-1 flex items-center justify-center">
            <div class="w-full h-full rounded-full overflow-hidden bg-surface-container-high flex items-center justify-center">
              <span class="material-symbols-outlined text-primary/60" style="font-size: 40px;">person</span>
            </div>
          </div>
          <button class="absolute bottom-0 right-0 bg-primary text-white p-1.5 rounded-full shadow-sm cursor-pointer border-none">
            <span class="material-symbols-outlined text-[14px]">edit</span>
          </button>
        </div>
        <h2 class="mt-4 text-lg font-bold text-on-surface">{{ nickname }}</h2>
        <p class="text-on-surface-variant text-xs mt-1 font-medium">黄金产区直供</p>
      </div>

      <!-- Sections -->
      <div class="mt-10 space-y-8">
        <section v-for="section in sections" :key="section.title">
          <h3 class="text-primary font-bold text-xs mb-3 ml-1 tracking-wider uppercase">{{ section.title }}</h3>
          <div class="bg-surface-container-lowest rounded-2xl border border-outline-variant/40 shadow-sm overflow-hidden">
            <template v-for="(item, idx) in section.items" :key="item.label">
              <div v-if="idx > 0" class="h-px bg-outline-variant/20 mx-4"></div>
              <button class="w-full flex items-center px-5 py-4 bg-transparent border-none cursor-pointer text-left" @click="handleItemClick(item)">
                <span class="material-symbols-outlined text-primary text-[20px] mr-3" style="font-variation-settings: 'FILL' 1;">{{ item.icon }}</span>
                <span class="text-sm font-medium text-on-surface flex-1">{{ item.label }}</span>
                <div class="flex items-center">
                  <span v-if="item.value" class="text-on-surface-variant text-xs font-medium mr-1">{{ item.value }}</span>
                  <span class="material-symbols-outlined text-on-surface-variant text-[18px]">chevron_right</span>
                </div>
              </button>
            </template>
          </div>
        </section>
      </div>

      <!-- Logout -->
      <div class="mt-10">
        <button class="w-full bg-transparent border border-primary text-primary font-bold py-3 rounded-xl cursor-pointer active:scale-[0.98] transition-transform" @click="handleLogout">
          退出登录
        </button>
      </div>

      <!-- Footer -->
      <div class="mt-10 mb-8 text-center">
        <span class="font-headline text-primary/60 text-lg italic tracking-wide">薯鲜生</span>
        <p class="text-[9px] uppercase tracking-[0.2em] text-on-surface-variant font-bold mt-0.5">Powered By Nature</p>
      </div>
    </main>
  </div>
</template>
