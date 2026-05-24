<script setup>
import TopHeader from '../components/layout/TopHeader.vue'
import BottomNavBar from '../components/layout/BottomNavBar.vue'

const userInfo = {
  name: '番番小芋',
  member: '金牌会员',
  avatar: ''
}

const orderTabs = [
  { key: 'unpaid', icon: 'receipt_long', label: '待付款', badge: 2 },
  { key: 'unshipped', icon: 'inventory_2', label: '待发货', badge: 0 },
  { key: 'unreceived', icon: 'local_shipping', label: '待收货', badge: 1 },
  { key: 'unreviewed', icon: 'rate_review', label: '待评价', badge: 0 }
]

const tools = [
  { key: 'coupon', icon: 'confirmation_number', label: '优惠券', color: 'text-tertiary' },
  { key: 'favorite', icon: 'favorite', label: '我的收藏', color: 'text-primary-container' },
  { key: 'address', icon: 'location_on', label: '地址管理', color: 'text-secondary' },
  { key: 'help', icon: 'help', label: '帮助中心', color: 'text-on-surface-variant' }
]
</script>

<template>
  <div class="min-h-screen bg-background text-on-surface">
    <TopHeader />

    <!-- User Info -->
    <div class="px-6 py-8 flex items-center gap-5">
      <div class="w-18 h-18 rounded-full bg-surface-container-high border-2 border-outline-variant flex items-center justify-center">
        <span class="material-symbols-outlined text-outline" style="font-size: 36px;">person</span>
      </div>
      <div class="flex-1 min-w-0">
        <h2 class="text-xl font-bold text-on-background">{{ userInfo.name }}</h2>
        <span class="inline-flex items-center gap-1.5 mt-1.5 px-3 py-1 rounded-full bg-surface-container-high text-xs font-medium text-on-surface-variant">
          <span class="text-primary-container text-sm">⭐</span>
          {{ userInfo.member }}
        </span>
      </div>
      <button class="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center active:scale-95 transition-transform flex-shrink-0">
        <span class="material-symbols-outlined text-on-surface-variant" style="font-size: 22px;">settings</span>
      </button>
    </div>

    <!-- My Orders -->
    <section class="px-6 mb-6">
      <h3 class="text-lg font-semibold text-on-background mb-4">我的订单</h3>
      <div class="bg-surface-container-low rounded-2xl p-5 grid grid-cols-4 gap-2">
        <button
          v-for="tab in orderTabs"
          :key="tab.key"
          class="flex flex-col items-center gap-2.5 relative active:scale-95 transition-transform py-1"
        >
          <div class="relative">
            <span
              class="material-symbols-outlined text-on-surface-variant"
              style="font-size: 26px; font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;"
            >{{ tab.icon }}</span>
            <div
              v-if="tab.badge > 0"
              class="absolute -top-1.5 -right-2.5 bg-error text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center"
            >
              {{ tab.badge }}
            </div>
          </div>
          <span class="text-xs text-on-surface-variant whitespace-nowrap">{{ tab.label }}</span>
        </button>
      </div>
    </section>

    <!-- Common Tools -->
    <section class="px-6 mb-24 md:mb-10">
      <h3 class="text-lg font-semibold text-on-background mb-4">常用工具</h3>
      <div class="bg-surface-container-low rounded-2xl overflow-hidden">
        <button
          v-for="(tool, index) in tools"
          :key="tool.key"
          class="w-full flex items-center justify-between px-5 py-4.5 active:bg-surface-container transition-colors"
          :class="index < tools.length - 1 ? 'border-b border-outline-variant/40' : ''"
        >
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center flex-shrink-0">
              <span
                class="material-symbols-outlined"
                :class="tool.color"
                style="font-size: 22px; font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24;"
              >{{ tool.icon }}</span>
            </div>
            <span class="text-[15px] text-on-surface font-medium">{{ tool.label }}</span>
          </div>
          <span
            class="material-symbols-outlined text-outline flex-shrink-0"
            style="font-size: 20px; font-variation-settings: 'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24;"
          >chevron_right</span>
        </button>
      </div>
    </section>

    <BottomNavBar active="user" />
  </div>
</template>
