<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'
import { useCart, setCartUser, loadCartFromServer } from '../composables/useCart'
import { supabase } from '../utils/supabase'

import pendingPaymentIcon from '../assets/icons-profile/pending-payment.png'
import pendingShipmentIcon from '../assets/icons-profile/pending-shipment.png'
import shippedIcon from '../assets/icons-profile/shipped.png'
import pendingReviewIcon from '../assets/icons-profile/pending-review.png'
import couponIcon from '../assets/icons-profile/coupon.png'
import favoriteIcon from '../assets/icons-profile/favorite.png'
import addressIcon from '../assets/icons-profile/address.png'
import helpIcon from '../assets/icons-profile/help.png'
import settingsIcon from '../assets/icons-profile/settings.png'

const router = useRouter()
const { user, isLoggedIn } = useAuth()

const orderCounts = ref({ pending_payment: 0, pending_shipment: 0, shipped: 0, pending_review: 0 })

const orderTabs = [
  { key: 'pending_payment', icon: pendingPaymentIcon, label: '待付款' },
  { key: 'pending_shipment', icon: pendingShipmentIcon, label: '待发货' },
  { key: 'shipped', icon: shippedIcon, label: '待收货' },
  { key: 'pending_review', icon: pendingReviewIcon, label: '待评价' }
]

const tools = [
  { key: 'coupon', icon: couponIcon, label: '优惠券', route: '/coupons' },
  { key: 'favorite', icon: favoriteIcon, label: '我的收藏', route: '/favorites' },
  { key: 'address', icon: addressIcon, label: '地址管理', route: '/address' },
  { key: 'help', icon: helpIcon, label: '帮助中心', route: '/help' }
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

const handleToolClick = (tool) => {
  if (tool.route) router.push(tool.route)
}
</script>

<template>
  <div class="min-h-screen font-body" style="background-color: var(--color-background);">
    <!-- Header with Gradient -->
    <div class="fixed top-0 left-0 w-full z-40 px-4 pt-3 pb-4 md:hidden" style="background: linear-gradient(to bottom, var(--theme-bg), color-mix(in srgb, var(--theme-bg) 80%, transparent));">
      <div class="flex items-center justify-between">
        <h1 class="font-headline text-lg font-bold text-on-surface">个人中心</h1>
        <button class="p-2 rounded-full hover:bg-surface-container/50 transition-colors" @click="router.push('/settings')">
          <img :src="settingsIcon" alt="设置" class="w-6 h-6 object-contain" />
        </button>
      </div>
    </div>

    <main class="pt-[70px] max-w-lg mx-auto px-4 pb-8">
      <!-- User Info - Logged In -->
      <div v-if="isLoggedIn" class="bg-gradient-to-br from-primary/10 to-primary-fixed/30 rounded-2xl p-5 mb-4 cursor-pointer shadow-sm" @click="router.push('/profile/edit')">
        <div class="flex items-center gap-4">
          <div class="w-16 h-16 rounded-full border-2 border-primary/40 flex items-center justify-center bg-surface shrink-0 shadow-md">
            <span class="material-symbols-outlined text-primary" style="font-size: 32px;">person</span>
          </div>
          <div class="flex-1">
            <h2 class="text-headline-sm font-bold text-on-surface">{{ user?.user_metadata?.nickname || user?.email?.split('@')[0] || '番番小芋' }}</h2>
            <div class="flex items-center gap-2 mt-1.5">
              <div class="flex items-center gap-1 bg-primary/10 px-2 py-0.5 rounded-full">
                <span class="material-symbols-outlined text-primary" style="font-size: 12px; font-variation-settings: 'FILL' 1;">star</span>
                <span class="text-caption-sm font-medium text-primary">金牌会员</span>
              </div>
              <div class="flex items-center gap-1 bg-tertiary/10 px-2 py-0.5 rounded-full">
                <span class="material-symbols-outlined text-tertiary" style="font-size: 12px;">token</span>
                <span class="text-caption-sm font-medium text-tertiary">120积分</span>
              </div>
            </div>
          </div>
          <span class="material-symbols-outlined text-on-surface-variant" style="font-size: 20px;">chevron_right</span>
        </div>
      </div>

      <!-- User Info - Logged Out -->
      <div v-else class="bg-gradient-to-br from-surface-container-low to-surface-container rounded-2xl p-5 mb-4 cursor-pointer shadow-sm" @click="router.push('/login')">
        <div class="flex items-center gap-4">
          <div class="w-16 h-16 rounded-full border-2 border-outline-variant/40 flex items-center justify-center bg-surface shrink-0">
            <span class="material-symbols-outlined text-on-surface-variant" style="font-size: 32px;">person</span>
          </div>
          <div class="flex-1">
            <h2 class="text-headline-sm font-bold text-on-surface">点击登录/注册</h2>
            <p class="text-body-sm text-on-surface-variant mt-1">登录后享受更多权益</p>
          </div>
          <span class="material-symbols-outlined text-on-surface-variant" style="font-size: 20px;">chevron_right</span>
        </div>
      </div>

      <!-- My Orders -->
      <section class="mb-4">
        <div class="flex items-center justify-between mb-3">
          <h3 class="text-title-md font-bold text-on-surface">我的订单</h3>
          <button class="flex items-center gap-1 text-body-sm text-on-surface-variant" @click="router.push('/orders')">
            全部订单
            <span class="material-symbols-outlined" style="font-size: 16px;">chevron_right</span>
          </button>
        </div>
        <div class="bg-surface-container-low rounded-2xl p-4 grid grid-cols-4 gap-2 shadow-sm">
          <button v-for="tab in orderTabs" :key="tab.key" class="flex flex-col items-center gap-2 py-1 bg-transparent border-none cursor-pointer relative active:scale-95 transition-transform" @click="router.push('/orders')">
            <div class="relative">
              <img :src="tab.icon" :alt="tab.label" class="w-8 h-8 object-contain" />
              <div v-if="orderCounts[tab.key] > 0" class="absolute -top-1.5 -right-2.5 bg-primary text-on-primary text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-sm shadow-primary/20">
                {{ orderCounts[tab.key] }}
              </div>
            </div>
            <span class="text-caption-sm text-on-surface-variant whitespace-nowrap">{{ tab.label }}</span>
          </button>
        </div>
      </section>

      <!-- Common Tools -->
      <section class="mb-4">
        <h3 class="text-title-md font-bold text-on-surface mb-3">常用工具</h3>
        <div class="bg-surface-container-low rounded-2xl overflow-hidden shadow-sm">
          <button v-for="tool in tools" :key="tool.key" class="flex items-center justify-between w-full px-4 py-3.5 border-b last:border-b-0 border-outline-variant/30 bg-transparent cursor-pointer hover:bg-surface-container/50 transition-colors" @click="handleToolClick(tool)">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 flex items-center justify-center">
                <img :src="tool.icon" :alt="tool.label" class="w-full h-full object-contain" />
              </div>
              <span class="text-body-md text-on-surface">{{ tool.label }}</span>
            </div>
            <span class="material-symbols-outlined text-on-surface-variant" style="font-size: 18px;">chevron_right</span>
          </button>
        </div>
      </section>
    </main>
  </div>
</template>
