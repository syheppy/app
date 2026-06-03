<script setup>
import { computed, ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { supabase } from '../utils/supabase'
import { useCart } from '../composables/useCart'

const route = useRoute()
const router = useRouter()
const { addItem } = useCart()

const orderInfo = computed(() => ({
  amount: route.query.amount || '0.00',
  orderNo: route.query.order_no || '-',
  orderTime: new Date().toLocaleString('zh-CN')
}))

const recommendations = ref([])
onMounted(async () => {
  const { data } = await supabase
    .from('products')
    .select('*')
    .eq('status', true)
    .eq('is_recommended', true)
    .limit(2)
  if (data) recommendations.value = data.map(p => ({ ...p, image: p.image_url, image_url: p.image_url }))
})

const handleAddToCart = (product) => {
  addItem(product)
}
</script>

<template>
  <div class="min-h-screen theme-bg theme-text">
    <!-- Header -->
    <div class="flex items-center justify-between px-4 h-14 max-w-lg mx-auto">
      <button class="p-2 active:scale-95 transition-transform" @click="router.push('/')">
        <span class="material-symbols-outlined text-on-surface">arrow_back</span>
      </button>
      <div class="w-10"></div>
    </div>

    <div class="max-w-lg mx-auto px-4 py-4">
      <!-- Success Icon -->
      <div class="flex flex-col items-center mb-6">
        <div class="relative mb-4">
          <div class="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
            <span class="material-symbols-outlined text-green-600" style="font-size: 48px;">check_circle</span>
          </div>
          <div class="absolute inset-0 w-20 h-20 rounded-full bg-green-200/50 animate-ping"></div>
        </div>
        <h1 class="font-headline text-2xl font-bold text-on-surface mb-2">支付成功</h1>
        <p class="font-body text-sm text-on-surface-variant text-center">农场正在为您火速备货中</p>
      </div>

      <!-- Order Details -->
      <div class="theme-card rounded-xl p-5 mb-6" style="border: 1px solid var(--theme-card-border);">
        <div class="flex items-center justify-between py-2.5 border-b border-outline-variant/20">
          <span class="font-body text-sm text-on-surface-variant">实付金额</span>
          <span class="text-price-md text-error">¥{{ orderInfo.amount }}</span>
        </div>
        <div class="flex items-center justify-between py-2.5 border-b border-outline-variant/20">
          <span class="font-body text-sm text-on-surface-variant">支付方式</span>
          <span class="font-body text-sm text-on-surface">微信支付</span>
        </div>
        <div class="flex items-center justify-between py-2.5 border-b border-outline-variant/20">
          <span class="font-body text-sm text-on-surface-variant">下单时间</span>
          <span class="font-body text-sm text-on-surface">{{ orderInfo.orderTime }}</span>
        </div>
        <div class="flex items-center justify-between py-2.5">
          <span class="font-body text-sm text-on-surface-variant">订单编号</span>
          <span class="font-body text-sm text-on-surface">{{ orderInfo.orderNo }}</span>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex gap-3 mb-8">
        <button class="flex-1 py-3 rounded-xl border-2 border-outline-variant text-on-surface font-bold active:scale-95 transition-transform bg-transparent" @click="router.push('/orders')">
          查看订单
        </button>
        <button class="flex-1 py-3 rounded-xl bg-primary text-on-primary font-bold shadow-[0_4px_20px_rgba(194,101,42,0.2)] active:scale-95 transition-transform" @click="router.push('/')">
          返回首页
        </button>
      </div>

      <!-- Recommendations -->
      <section v-if="recommendations.length > 0">
        <h3 class="font-headline text-lg font-bold text-on-surface mb-3">为您推荐</h3>
        <div class="grid grid-cols-2 gap-3">
          <router-link v-for="product in recommendations" :key="product.id" :to="`/product/${product.id}`" class="theme-card rounded-xl overflow-hidden shadow-sm" style="border: 1px solid var(--theme-card-border);">
            <img :src="product.image_url" :alt="product.name" class="w-full h-[100px] object-cover" />
            <div class="p-3">
              <h4 class="font-body text-sm font-bold text-on-surface line-clamp-1 mb-1">{{ product.name }}</h4>
              <div class="flex justify-between items-center">
                <span class="text-price-sm text-error">¥{{ product.price }}</span>
                <button @click.prevent="handleAddToCart(product)" class="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white border-none">
                  <span class="material-symbols-outlined text-[14px]">add</span>
                </button>
              </div>
            </div>
          </router-link>
        </div>
      </section>
    </div>
  </div>
</template>
