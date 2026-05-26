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
  { key: 'coupon', icon: 'confirmation_number', label: '优惠券', bg: 'bg-primary/10', text: 'text-primary', route: '/coupons' },
  { key: 'favorite', icon: 'favorite', label: '我的收藏', bg: 'bg-primary/10', text: 'text-primary', route: '/favorites' },
  { key: 'address', icon: 'location_on', label: '地址管理', bg: 'bg-primary/10', text: 'text-primary', route: '/address' },
  { key: 'help', icon: 'help', label: '帮助中心', bg: 'bg-primary/10', text: 'text-primary', route: '/help' }
]

if (isLoggedIn.value && user.value) {
  setCartUser(user.value.id)
  loadCartFromServer()
}

onMounted(async () => {
  if (user.value) {
    setCartUser(user.value.id)
    loadCartFromServer()
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
  <div class="min-h-screen font-body" style="background: #FDF5ED;">
    <!-- Header -->
    <div class="text-center py-3 border-b border-primary/30">
      <span class="font-headline text-sm font-bold text-primary">个人中心</span>
    </div>

    <main class="max-w-lg mx-auto px-5 pb-8">
      <!-- User Info - Logged In -->
      <div v-if="isLoggedIn" class="flex items-center py-6 cursor-pointer" @click="router.push('/profile/edit')">
        <div class="w-16 h-16 rounded-full border-2 border-primary/40 flex items-center justify-center bg-white shrink-0">
          <span class="material-symbols-outlined text-primary/60" style="font-size: 32px;">person</span>
        </div>
        <div class="flex-1 ml-4">
          <h2 class="font-headline text-xl font-bold text-on-surface">{{ user?.user_metadata?.nickname || user?.email?.split('@')[0] || '番番小芋' }}</h2>
          <div class="flex items-center gap-1 mt-1">
            <span class="material-symbols-outlined text-primary text-[14px]" style="font-variation-settings: 'FILL' 1;">star</span>
            <span class="font-label text-[11px] font-medium text-on-surface-variant">金牌会员</span>
          </div>
        </div>
        <span class="material-symbols-outlined text-outline text-[22px] cursor-pointer" @click.stop="router.push('/settings')">settings</span>
      </div>

      <!-- User Info - Logged Out -->
      <div v-else class="flex items-center py-6 cursor-pointer" @click="router.push('/login')">
        <div class="w-16 h-16 rounded-full border-2 border-outline-variant/40 flex items-center justify-center bg-white shrink-0">
          <span class="material-symbols-outlined text-outline/60" style="font-size: 32px;">person</span>
        </div>
        <div class="flex-1 ml-4">
          <h2 class="font-headline text-lg font-bold text-on-surface">点击登录/注册</h2>
          <p class="font-body text-xs text-on-surface-variant mt-0.5">登录后享受更多权益</p>
        </div>
        <span class="material-symbols-outlined text-outline text-[22px]">settings</span>
      </div>

      <!-- My Orders -->
      <section class="mb-5">
        <h3 class="font-headline text-base font-bold text-on-surface mb-3">我的订单</h3>
        <div class="bg-white rounded-2xl p-4 grid grid-cols-4 gap-2 shadow-sm">
          <button v-for="tab in orderTabs" :key="tab.key" class="flex flex-col items-center gap-2 py-1 bg-transparent border-none cursor-pointer relative active:scale-95 transition-transform" @click="router.push('/orders')">
            <div class="relative">
              <span class="material-symbols-outlined text-on-surface-variant" style="font-size: 24px;">{{ tab.icon }}</span>
              <div v-if="orderCounts[tab.key] > 0" class="absolute -top-1.5 -right-2.5 bg-primary text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {{ orderCounts[tab.key] }}
              </div>
            </div>
            <span class="font-body text-[11px] text-on-surface-variant whitespace-nowrap">{{ tab.label }}</span>
          </button>
        </div>
      </section>

      <!-- Common Tools -->
      <section class="mb-5">
        <h3 class="font-headline text-base font-bold text-on-surface mb-3">常用工具</h3>
        <div class="bg-white rounded-2xl overflow-hidden shadow-sm">
          <button v-for="tool in tools" :key="tool.key" class="flex items-center justify-between w-full px-4 py-3.5 border-b border-surface-variant/20 last:border-b-0 bg-transparent cursor-pointer" @click="handleToolClick(tool)">
            <div class="flex items-center gap-3">
              <div class="w-9 h-9 rounded-full flex items-center justify-center" :class="tool.bg">
                <span class="material-symbols-outlined" :class="tool.text" style="font-size: 20px; font-variation-settings: 'FILL' 1;">{{ tool.icon }}</span>
              </div>
              <span class="font-body text-sm text-on-surface">{{ tool.label }}</span>
            </div>
            <span class="material-symbols-outlined text-outline text-[18px]">chevron_right</span>
          </button>
        </div>
      </section>

      <!-- Logout -->
      <button v-if="isLoggedIn" class="w-full py-3 rounded-xl border border-outline-variant text-on-surface-variant font-label text-sm active:scale-[0.98] transition-transform bg-transparent mt-4" @click="handleLogout">
        退出登录
      </button>
    </main>
  </div>
</template>
