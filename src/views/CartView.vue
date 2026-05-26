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
  <div class="bg-background text-on-background font-body min-h-screen flex flex-col pb-20 md:pb-0">
    <main class="flex-1 max-w-lg mx-auto w-full px-4 pt-2">
      <!-- Title -->
      <h1 class="font-headline text-2xl font-bold text-on-background mb-1">购物车</h1>
      <p class="font-body text-sm text-on-surface-variant mb-4">查看您的精选好物</p>

      <!-- Default Address -->
      <div v-if="defaultAddress" class="bg-surface-container-low rounded-xl p-4 mb-4 border border-outline-variant/30 flex items-center gap-3">
        <span class="material-symbols-outlined text-primary text-[20px]">location_on</span>
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2 mb-0.5">
            <span class="font-label text-sm font-bold text-on-surface">{{ defaultAddress.name }}</span>
            <span class="text-[10px] px-1.5 py-0.5 bg-primary-container text-on-primary rounded font-label">默认</span>
          </div>
          <p class="font-body text-xs text-on-surface-variant truncate">{{ defaultAddress.address }} {{ defaultAddress.phone }}</p>
        </div>
        <span class="material-symbols-outlined text-outline text-[20px]">chevron_right</span>
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
          <div v-for="item in items" :key="item.id" class="bg-surface-container-lowest rounded-xl p-4 flex gap-3 border border-outline-variant/30 shadow-sm">
            <img :src="item.image" :alt="item.name" class="w-20 h-20 rounded-xl object-cover flex-shrink-0" />
            <div class="flex-1 flex flex-col justify-between min-w-0">
              <div>
                <div class="flex items-start justify-between">
                  <h4 class="font-headline text-sm font-bold text-on-surface line-clamp-1">{{ item.name }}</h4>
                  <button class="ml-2 flex-shrink-0" @click="removeItem(item.id)">
                    <span class="material-symbols-outlined text-outline" style="font-size: 18px;">delete</span>
                  </button>
                </div>
              </div>
              <div class="flex items-center justify-between mt-2">
                <div class="flex items-baseline text-error">
                  <span class="text-[12px] font-bold">¥</span>
                  <span class="font-headline font-bold text-base">{{ item.price.toFixed(2) }}</span>
                </div>
                <div class="flex items-center gap-2">
                  <button class="w-7 h-7 rounded-full bg-surface-container flex items-center justify-center active:scale-90 transition-transform border-none" @click="updateQuantity(item.id, -1)">
                    <span class="material-symbols-outlined text-on-surface-variant" style="font-size: 16px;">remove</span>
                  </button>
                  <span class="text-sm font-medium w-5 text-center text-on-surface">{{ item.quantity }}</span>
                  <button class="w-7 h-7 rounded-full bg-surface-container flex items-center justify-center active:scale-90 transition-transform border-none" @click="updateQuantity(item.id, 1)">
                    <span class="material-symbols-outlined text-on-surface-variant" style="font-size: 16px;">add</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Free Shipping Tip -->
        <div class="bg-surface-container-low rounded-xl px-4 py-3 flex items-center justify-between mb-4 border border-outline-variant/30">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-primary" style="font-size: 18px;">local_shipping</span>
            <span class="font-body text-xs text-on-surface-variant">再买 ¥{{ freeShippingDiff }} 即可享受免邮</span>
          </div>
          <button class="font-label text-xs text-primary font-medium" @click="router.push('/category')">去凑单</button>
        </div>

        <!-- Bottom Bar -->
        <div class="bg-surface-container-lowest/95 backdrop-blur-md rounded-2xl p-4 flex items-center justify-between border border-outline-variant/30 shadow-md">
          <div>
            <span class="font-label text-xs text-on-surface-variant">合计 ({{ totalCount }}件)</span>
            <div class="flex items-baseline gap-0.5">
              <span class="text-error text-sm font-bold">¥</span>
              <span class="font-headline text-error font-bold text-lg">{{ totalPrice.toFixed(2) }}</span>
            </div>
          </div>
          <button class="bg-primary text-on-primary px-8 py-3 rounded-xl font-bold shadow-[0_4px_20px_rgba(194,101,42,0.2)] active:scale-95 transition-transform" @click="router.push('/checkout')">
            去结算
          </button>
        </div>
      </template>
    </main>
  </div>
</template>
