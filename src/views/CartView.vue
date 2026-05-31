<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCart } from '../composables/useCart'
import { useAuth } from '../composables/useAuth'
import { supabase } from '../utils/supabase'

const router = useRouter()
const { items, removeItem, updateQuantity, totalCount, totalPrice } = useCart()
const { user } = useAuth()

const isEmpty = computed(() => items.length === 0)
const defaultAddress = ref(null)
const freeShippingDiff = computed(() => Math.max(0, 99 - totalPrice.value).toFixed(2))

onMounted(async () => {
  if (user.value) {
    const { data } = await supabase
      .from('addresses')
      .select('*')
      .eq('user_id', user.value.id)
      .eq('is_default', true)
      .maybeSingle()
    if (data) defaultAddress.value = data
  }
})
</script>

<template>
  <div class="min-h-screen font-body pb-20 theme-bg">
    <main class="max-w-lg mx-auto px-5 pt-2 pb-6">
      <!-- Title -->
      <h1 class="font-headline text-2xl font-bold text-on-background mb-0.5">购物车</h1>
      <p class="font-body text-xs text-on-surface-variant mb-4">查看您的精选好物</p>

      <!-- Default Address -->
      <div v-if="defaultAddress" class="theme-card rounded-2xl p-4 mb-4 shadow-sm flex items-center gap-3 cursor-pointer border-l-4 border-primary" @click="router.push('/address')">
        <span class="material-symbols-outlined text-primary text-[20px]">location_on</span>
        <div class="flex-1 min-w-0">
          <p class="font-body text-xs theme-text-secondary">{{ defaultAddress.address }}</p>
          <p class="font-body text-[11px] theme-text-secondary mt-0.5">{{ defaultAddress.name }} · {{ defaultAddress.phone }}</p>
        </div>
        <span class="material-symbols-outlined text-[18px] theme-text-secondary">chevron_right</span>
      </div>

      <!-- Empty State -->
      <div v-if="isEmpty" class="flex flex-col items-center justify-center py-20">
        <span class="material-symbols-outlined text-outline mb-4" style="font-size: 56px;">shopping_cart</span>
        <p class="text-on-surface-variant mb-4">购物车空空如也</p>
        <button class="px-8 py-3 rounded-full bg-primary text-on-primary font-medium active:scale-95 transition-transform" @click="router.push('/')">
          去逛逛
        </button>
      </div>

      <template v-else>
        <!-- Cart Items -->
        <div class="flex flex-col gap-3 mb-4">
          <div v-for="item in items" :key="item.id" class="theme-card rounded-2xl p-4 flex gap-3 shadow-sm">
            <img :src="item.image" :alt="item.name" class="w-20 h-20 rounded-xl object-cover flex-shrink-0" />
            <div class="flex-1 flex flex-col justify-between min-w-0">
              <div>
                <div class="flex items-start justify-between">
                  <h4 class="font-headline text-sm font-bold theme-text line-clamp-1">{{ item.name }}</h4>
                  <button class="ml-2 flex-shrink-0 bg-transparent border-none cursor-pointer p-0" @click="removeItem(item.id)">
                    <span class="material-symbols-outlined text-outline" style="font-size: 18px;">delete</span>
                  </button>
                </div>
                <p class="font-body text-[11px] mt-0.5 theme-text-secondary">5斤装 · 人气之选</p>
              </div>
              <div class="flex items-center justify-between mt-2">
                <div class="flex items-baseline text-primary">
                  <span class="text-[12px] font-bold">¥</span>
                  <span class="font-headline font-bold text-base">{{ item.price.toFixed(2) }}</span>
                </div>
                <div class="flex items-center gap-2">
                  <button class="w-7 h-7 rounded-full flex items-center justify-center active:scale-90 transition-transform border-none" style="background: var(--theme-card-border);" @click="updateQuantity(item.id, -1)">
                    <span class="material-symbols-outlined theme-text-secondary" style="font-size: 16px;">remove</span>
                  </button>
                  <span class="text-sm font-medium w-5 text-center theme-text">{{ item.quantity }}</span>
                  <button class="w-7 h-7 rounded-full flex items-center justify-center active:scale-90 transition-transform border-none" style="background: var(--theme-card-border);" @click="updateQuantity(item.id, 1)">
                    <span class="material-symbols-outlined theme-text-secondary" style="font-size: 16px;">add</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Free Shipping Tip -->
        <div class="theme-card rounded-2xl px-4 py-3 flex items-center justify-between mb-4 shadow-sm">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-primary" style="font-size: 18px;">local_shipping</span>
            <span class="font-body text-[11px] theme-text-secondary">再买 ¥{{ freeShippingDiff }} 即可享受免邮</span>
          </div>
          <button class="font-label text-[11px] text-primary font-medium bg-transparent border-none cursor-pointer" @click="router.push('/category')">去凑单</button>
        </div>

        <!-- Bottom Checkout Bar -->
        <div class="fixed bottom-[60px] left-0 w-full z-30">
          <div class="max-w-lg mx-auto px-5">
            <div class="theme-card rounded-2xl p-4 flex items-center justify-between shadow-md" style="border: 1px solid var(--theme-card-border);">
              <div class="flex items-center gap-3">
                <div class="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                  <span class="material-symbols-outlined text-white text-[14px]" style="font-variation-settings: 'FILL' 1;">check</span>
                </div>
                <span class="font-body text-xs theme-text-secondary">全选</span>
              </div>
              <div class="flex items-center gap-4">
                <div>
                  <span class="font-body text-xs theme-text-secondary">合计：</span>
                  <span class="text-primary font-headline font-bold text-lg">¥{{ totalPrice.toFixed(2) }}</span>
                </div>
                <button class="bg-primary text-on-primary px-6 py-2.5 rounded-xl font-bold text-sm shadow-[0_4px_20px_rgba(194,101,42,0.2)] active:scale-95 transition-transform" @click="router.push('/checkout')">
                  去结算
                </button>
              </div>
            </div>
          </div>
        </div>
      </template>
    </main>
  </div>
</template>
