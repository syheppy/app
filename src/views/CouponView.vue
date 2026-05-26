<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from '../composables/useToast'

const router = useRouter()
const { show: showToast } = useToast()
const activeTab = ref('unused')

const tabs = [
  { id: 'unused', name: '未使用' },
  { id: 'used', name: '已使用' },
  { id: 'expired', name: '已过期' }
]

const coupons = ref([
  {
    id: 1,
    type: 'amount',
    value: 15,
    condition: '满99可用',
    title: '丰收节礼遇专享券',
    tag: '即将到期',
    description: '适用于全场薯类、生鲜产品',
    expiry: '2026.12.31',
    status: 'unused'
  },
  {
    id: 2,
    type: 'amount',
    value: 30,
    condition: '全场通用',
    title: '新客专享尊享券',
    tag: '',
    description: '薯鲜生首单诚挚礼遇',
    expiry: '2026.08.15',
    status: 'unused'
  },
  {
    id: 3,
    type: 'discount',
    value: 9.2,
    condition: '限时优惠',
    title: '会员回馈折扣券',
    tag: '',
    description: '感谢您的一路陪伴',
    expiry: '2026.09.28',
    status: 'unused'
  }
])

const filteredCoupons = computed(() => coupons.value.filter(c => c.status === activeTab.value))
const availableCount = computed(() => coupons.value.filter(c => c.status === 'unused').length)
</script>

<template>
  <div class="min-h-screen font-body" style="background: #FDF5ED;">
    <!-- Header -->
    <div class="sticky top-0 z-40 bg-surface/80 backdrop-blur-md border-b border-outline-variant/20">
      <div class="flex items-center justify-between px-4 h-14 max-w-lg mx-auto">
        <button class="p-2" @click="router.back()">
          <span class="material-symbols-outlined text-on-surface">arrow_back</span>
        </button>
        <h1 class="font-headline text-lg font-bold text-on-surface">我的优惠券</h1>
        <div class="w-10"></div>
      </div>
    </div>

    <!-- Tabs -->
    <div class="flex px-6 mt-4 gap-8 border-b border-outline-variant/30 max-w-lg mx-auto">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        @click="activeTab = tab.id"
        class="relative pb-3 text-sm transition-colors whitespace-nowrap bg-transparent border-none cursor-pointer"
        :class="activeTab === tab.id ? 'text-primary font-bold' : 'text-on-surface-variant font-medium'"
      >
        {{ tab.name }}
        <span v-if="activeTab === tab.id" class="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-full"></span>
      </button>
    </div>

    <!-- Coupon Summary -->
    <div class="px-6 py-5 flex items-center justify-between max-w-lg mx-auto">
      <div class="flex items-center gap-3">
        <div class="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
          <span class="material-symbols-outlined text-primary text-[24px]" style="font-variation-settings: 'FILL' 1;">confirmation_number</span>
        </div>
        <div>
          <h2 class="font-headline text-lg font-bold text-on-surface">专属礼遇</h2>
          <p class="text-xs text-on-surface-variant">您有 <span class="text-primary font-bold">{{ availableCount }}</span> 张可用优惠券</p>
        </div>
      </div>
      <button class="text-xs font-bold text-primary flex items-center gap-1 bg-primary/10 px-3 py-1.5 rounded-full cursor-pointer border-none" @click="showToast('兑换功能即将上线')">
        兑换中心
        <span class="material-symbols-outlined text-[16px]">chevron_right</span>
      </button>
    </div>

    <!-- Coupon List -->
    <div class="px-6 space-y-4 max-w-lg mx-auto pb-8">
      <div v-for="coupon in filteredCoupons" :key="coupon.id" class="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden flex">
        <!-- Left: Value -->
        <div class="w-1/3 p-5 flex flex-col items-center justify-center border-r border-dashed border-outline-variant/60">
          <div class="flex items-baseline text-primary">
            <template v-if="coupon.type === 'amount'">
              <span class="text-sm font-bold">¥</span>
              <span class="text-4xl font-extrabold tracking-tighter">{{ coupon.value }}</span>
            </template>
            <template v-else>
              <span class="text-4xl font-extrabold tracking-tighter">{{ coupon.value }}</span>
              <span class="text-sm font-bold ml-0.5">折</span>
            </template>
          </div>
          <span class="text-[10px] text-on-surface-variant font-medium mt-1">{{ coupon.condition }}</span>
        </div>
        <!-- Right: Info -->
        <div class="flex-1 p-5 flex flex-col justify-between">
          <div>
            <div class="flex justify-between items-start">
              <h3 class="font-bold text-on-surface text-base">{{ coupon.title }}</h3>
              <span v-if="coupon.tag" class="bg-tertiary/10 text-tertiary text-[9px] px-1.5 py-0.5 rounded font-bold shrink-0 ml-2">{{ coupon.tag }}</span>
            </div>
            <p class="text-[10px] text-on-surface-variant mt-1">{{ coupon.description }}</p>
          </div>
          <div class="flex items-center justify-between mt-4">
            <p class="text-[9px] text-outline">有效期至：{{ coupon.expiry }}</p>
            <button class="bg-primary text-on-primary text-xs font-bold px-4 py-1.5 rounded-full cursor-pointer border-none active:scale-95 transition-transform" @click="router.push('/category')">去使用</button>
          </div>
        </div>
      </div>

      <!-- Empty -->
      <div class="py-10 flex flex-col items-center justify-center text-on-surface-variant">
        <span class="material-symbols-outlined text-outline text-[40px] mb-2 opacity-50">confirmation_number</span>
        <p class="text-xs">没有更多可用优惠券了</p>
        <button class="mt-4 text-xs text-primary font-bold underline underline-offset-4 bg-transparent border-none cursor-pointer" @click="showToast('暂无历史优惠券')">查看历史记录</button>
      </div>
    </div>
  </div>
</template>
