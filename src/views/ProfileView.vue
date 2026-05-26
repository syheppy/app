<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'
import { useCart, setCartUser, loadCartFromServer, clearCartMemory } from '../composables/useCart'
import { supabase } from '../utils/supabase'

const router = useRouter()
const { user, isLoggedIn, signOut } = useAuth()

const orderCounts = ref({ pending_payment: 0, pending_shipment: 0, shipped: 0, pending_review: 0 })

const orderTabs = [
  { key: 'pending_payment', icon: 'receipt_long', label: '待付款' },
  { key: 'pending_shipment', icon: 'inventory_2', label: '待发货' },
  { key: 'shipped', icon: 'local_shipping', label: '待收货' },
  { key: 'pending_review', icon: 'rate_review', label: '待评价' }
]

const tools = [
  { key: 'coupon', icon: 'confirmation_number', label: '优惠券', color: 'text-tertiary', route: '/coupons' },
  { key: 'favorite', icon: 'favorite', label: '我的收藏', color: 'text-primary-container', route: '/favorites' },
  { key: 'address', icon: 'location_on', label: '地址管理', color: 'text-secondary', route: '/address' },
  { key: 'help', icon: 'help', label: '帮助中心', color: 'text-on-surface-variant', route: '/help' }
]

// Sync auth state with cart
if (isLoggedIn.value && user.value) {
  setCartUser(user.value.id)
  loadCartFromServer()
}

onMounted(async () => {
  if (user.value) {
    setCartUser(user.value.id)
    loadCartFromServer()
    // Fetch order counts
    const { data } = await supabase
      .from('orders')
      .select('status')
      .eq('user_id', user.value.id)
    if (data) {
      orderCounts.value = {
        pending_payment: data.filter(o => o.status === 'pending_payment').length,
        pending_shipment: data.filter(o => o.status === 'pending_shipment').length,
        shipped: data.filter(o => o.status === 'shipped').length,
        pending_review: data.filter(o => o.status === 'completed').length
      }
    }
  }
})

const handleLogout = async () => {
  await signOut()
  setCartUser(null)
  clearCartMemory()
  router.push('/')
}

const handleToolClick = (tool) => {
  if (tool.route) router.push(tool.route)
}
</script>

<template>
  <div class="bg-background text-on-background font-body min-h-screen flex flex-col pb-20 md:pb-0">
    <!-- Header -->
    <div class="px-4 py-3 flex items-center justify-between">
      <span class="material-symbols-outlined text-on-surface-variant">settings</span>
      <span class="font-headline text-sm font-bold text-on-surface">薯鲜生</span>
      <div class="w-6"></div>
    </div>

    <main class="flex-1 max-w-lg mx-auto w-full px-4">
      <!-- User Info - Logged In -->
      <div v-if="isLoggedIn" class="flex items-center gap-4 mb-6">
        <div class="w-16 h-16 rounded-full bg-primary-container flex items-center justify-center text-on-primary">
          <span class="material-symbols-outlined" style="font-size: 32px;">person</span>
        </div>
        <div class="flex-1">
          <h2 class="font-headline text-xl font-bold text-on-surface">{{ user?.email?.split('@')[0] || '番番小芋' }}</h2>
          <span class="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full bg-surface-container-high text-[10px] font-label font-medium text-on-surface-variant">
            <span class="material-symbols-outlined text-primary" style="font-size: 14px; font-variation-settings: 'FILL' 1;">star</span>
            金牌会员
          </span>
        </div>
      </div>

      <!-- User Info - Logged Out -->
      <div v-else class="flex items-center gap-4 mb-6 cursor-pointer" @click="router.push('/login')">
        <div class="w-16 h-16 rounded-full bg-surface-container-high flex items-center justify-center">
          <span class="material-symbols-outlined text-outline" style="font-size: 32px;">person</span>
        </div>
        <div class="flex-1">
          <h2 class="font-headline text-lg font-bold text-on-surface">点击登录/注册</h2>
          <p class="font-body text-xs text-on-surface-variant">登录后享受更多权益</p>
        </div>
        <span class="material-symbols-outlined text-outline">chevron_right</span>
      </div>

      <!-- My Orders -->
      <section class="mb-6">
        <div class="flex items-center justify-between mb-3">
          <h3 class="font-headline text-lg font-bold text-on-surface">我的订单</h3>
          <button class="font-label text-xs text-primary-container flex items-center" @click="router.push('/orders')">
            查看全部 <span class="material-symbols-outlined text-[16px]">chevron_right</span>
          </button>
        </div>
        <div class="bg-surface-container-low rounded-2xl p-5 grid grid-cols-4 gap-2">
          <button v-for="tab in orderTabs" :key="tab.key" class="flex flex-col items-center gap-2 relative active:scale-95 transition-transform py-1" @click="router.push('/orders')">
            <div class="relative">
              <span class="material-symbols-outlined text-on-surface-variant" style="font-size: 26px;">{{ tab.icon }}</span>
              <div v-if="orderCounts[tab.key] > 0" class="absolute -top-1.5 -right-2.5 bg-error text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {{ orderCounts[tab.key] }}
              </div>
            </div>
            <span class="font-body text-xs text-on-surface-variant whitespace-nowrap">{{ tab.label }}</span>
          </button>
        </div>
      </section>

      <!-- Common Tools -->
      <section class="mb-6">
        <h3 class="font-headline text-lg font-bold text-on-surface mb-3">常用工具</h3>
        <div class="bg-surface-container-low rounded-2xl overflow-hidden">
          <button v-for="tool in tools" :key="tool.key" class="flex items-center justify-between w-full px-5 py-4 border-b border-surface-variant/30 bg-transparent" @click="handleToolClick(tool)">
            <div class="flex items-center gap-3">
              <span class="material-symbols-outlined" :class="tool.color" style="font-size: 22px; font-variation-settings: 'FILL' 1;">{{ tool.icon }}</span>
              <span class="font-body text-sm text-on-surface">{{ tool.label }}</span>
            </div>
            <span class="material-symbols-outlined text-outline" style="font-size: 20px;">chevron_right</span>
          </button>
        </div>
      </section>

      <!-- Logout -->
      <button v-if="isLoggedIn" class="w-full py-3 rounded-xl border border-outline-variant text-on-surface-variant font-label text-sm active:scale-[0.98] transition-transform bg-transparent mb-8" @click="handleLogout">
        退出登录
      </button>
    </main>
  </div>
</template>
