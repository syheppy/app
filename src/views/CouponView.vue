<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 示例优惠券数据，后续可从 Supabase 拉取
const coupons = ref([
  { id: 1, title: '新人专享券', amount: 5, condition: '满39可用', expires: '2026-06-30', used: false },
  { id: 2, title: '满减优惠', amount: 10, condition: '满99可用', expires: '2026-06-15', used: false },
  { id: 3, title: '限时折扣', amount: 15, condition: '满149可用', expires: '2026-05-31', used: true }
])
</script>

<template>
  <div class="min-h-screen bg-background text-on-surface">
    <div class="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-outline-variant/30">
      <div class="flex items-center justify-between px-4 h-14 max-w-lg mx-auto">
        <button class="p-2" @click="router.back()"><span class="material-symbols-outlined">arrow_back</span></button>
        <h1 class="font-headline text-base font-bold">我的优惠券</h1>
        <div class="w-10"></div>
      </div>
    </div>

    <main class="max-w-lg mx-auto px-4 py-4 pb-8">
      <div v-if="coupons.length === 0" class="flex flex-col items-center justify-center pt-24">
        <span class="material-symbols-outlined text-outline text-[48px] mb-4">confirmation_number</span>
        <p class="text-on-surface-variant text-sm">暂无优惠券</p>
      </div>

      <div v-else class="flex flex-col gap-3">
        <div v-for="coupon in coupons" :key="coupon.id" class="rounded-xl overflow-hidden border" :class="coupon.used ? 'border-outline-variant/30 opacity-50' : 'border-primary/30'">
          <div class="flex">
            <!-- Left: amount -->
            <div class="w-24 flex flex-col items-center justify-center py-4" :class="coupon.used ? 'bg-surface-container-high' : 'bg-primary/10'">
              <span class="text-[12px] font-label" :class="coupon.used ? 'text-outline' : 'text-primary'">¥</span>
              <span class="font-headline text-2xl font-bold" :class="coupon.used ? 'text-outline' : 'text-primary'">{{ coupon.amount }}</span>
              <span class="text-[10px] font-label mt-1" :class="coupon.used ? 'text-outline' : 'text-on-surface-variant'">{{ coupon.condition }}</span>
            </div>
            <!-- Right: info -->
            <div class="flex-1 p-4 flex flex-col justify-between bg-surface-container-lowest">
              <div>
                <h3 class="font-label text-sm font-bold text-on-surface">{{ coupon.title }}</h3>
                <p class="font-body text-[11px] text-on-surface-variant mt-1">有效期至 {{ coupon.expires }}</p>
              </div>
              <div class="flex justify-end">
                <button v-if="coupon.used" class="px-4 py-1 rounded-lg border border-outline-variant text-outline font-label text-xs bg-transparent" disabled>已使用</button>
                <button v-else class="px-4 py-1 rounded-lg bg-primary text-on-primary font-label text-xs border-none" @click="router.push('/category')">去使用</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
