<script setup>
import { ref } from 'vue'

const address = {
  name: '张三先生',
  phone: '138****8888',
  address: '朝阳区建国路88号'
}

const orderItems = [
  {
    name: '烟薯25号 5KG/箱',
    desc: '精品级，有机',
    price: '39.90',
    quantity: 1,
    image: 'https://lh3.googleusercontent.com/aida/ADBb0uiSU54_g3nmA8rJT-tXJpsN0WgzHOkS5cHyxyj1qSH-2i7pDm2oRxLrhtnA9J8gD0p6K8axFH-dzIVy2Qyj6bBSdsYqlAtCH_hVccROJWcD5XVwMFDU5UG6-Bwck8dvQPSS1l2AEZNzStQBeZqphuQ-KBjXGyIPj3aQdPBtAFe7ny95_h2wV9cnOn9xSTQV5kNSafz3f1uGOjxtKRCFB0trQJnNOE8mqozujZTrCOZvQ3TKKfmenGn8sNAL'
  }
]

const couponDiscount = 15.00
const shipping = '极速冷链'

const paymentMethods = [
  { key: 'wechat', label: '微信支付', icon: '💳', iconColor: 'bg-[#07C160]/10' },
  { key: 'alipay', label: '支付宝', icon: '💳', iconColor: 'bg-[#1677FF]/10' },
  { key: 'unionpay', label: '云闪付', icon: '💳', iconColor: 'bg-[#E21E2D]/10' }
]
const selectedPayment = ref('wechat')

const totalAmount = ref(24.90)
</script>

<template>
  <div class="min-h-screen bg-background text-on-surface pb-24">
    <!-- Header -->
    <div class="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-outline-variant/30">
      <div class="flex items-center justify-between px-4 h-14">
        <button class="p-2 active:scale-95 transition-transform">
          <span class="material-symbols-outlined text-on-surface">arrow_back</span>
        </button>
        <h1 class="text-lg font-semibold text-on-background font-display italic">Sahara</h1>
        <div class="w-10"></div>
      </div>
    </div>

    <div class="px-5 py-5">
      <!-- Title -->
      <h1 class="font-display text-2xl font-bold text-on-background mb-1">确认订单</h1>
      <p class="text-sm text-on-surface-variant mb-6">请在下方核对您的订单详情。</p>

      <!-- Address Card -->
      <div class="bg-surface-container-low rounded-2xl p-4 mb-5 flex items-center justify-between border border-outline-variant/30">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-full bg-primary-container/10 flex items-center justify-center">
            <span class="material-symbols-outlined text-primary-container" style="font-size: 22px;">location_on</span>
          </div>
          <div>
            <div class="flex items-center gap-2">
              <span class="text-base font-semibold text-on-background">{{ address.name }}</span>
              <span class="text-sm text-on-surface-variant">{{ address.phone }}</span>
            </div>
            <p class="text-sm text-on-surface-variant mt-0.5">{{ address.address }}</p>
          </div>
        </div>
        <span class="material-symbols-outlined text-outline" style="font-size: 20px;">chevron_right</span>
      </div>

      <!-- Order Items -->
      <div class="bg-surface-container-low rounded-2xl p-4 mb-5 border border-outline-variant/30">
        <h3 class="text-base font-semibold text-on-background mb-3">商品清单</h3>
        <div
          v-for="(item, index) in orderItems"
          :key="index"
          class="flex gap-3"
        >
          <img :src="item.image" :alt="item.name" class="w-16 h-16 rounded-xl object-cover" />
          <div class="flex-1">
            <h4 class="text-sm font-medium text-on-surface">{{ item.name }}</h4>
            <p class="text-xs text-on-surface-variant mt-0.5">{{ item.desc }}</p>
            <div class="flex items-center justify-between mt-2">
              <span class="text-error font-bold">¥ {{ item.price }}</span>
              <span class="text-xs text-outline">x{{ item.quantity }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Coupon & Shipping -->
      <div class="bg-surface-container-low rounded-2xl mb-5 border border-outline-variant/30 overflow-hidden">
        <div class="flex items-center justify-between px-4 py-3.5 border-b border-outline-variant/30">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-tertiary" style="font-size: 20px;">local_offer</span>
            <span class="text-sm text-on-surface">优惠券</span>
          </div>
          <div class="flex items-center gap-1">
            <span class="text-sm text-tertiary font-medium">- ¥{{ couponDiscount.toFixed(2) }}</span>
            <span class="material-symbols-outlined text-outline" style="font-size: 18px;">chevron_right</span>
          </div>
        </div>
        <div class="flex items-center justify-between px-4 py-3.5">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-on-surface-variant" style="font-size: 20px;">local_shipping</span>
            <span class="text-sm text-on-surface">配送方式</span>
          </div>
          <span class="text-sm text-on-surface-variant">{{ shipping }}</span>
        </div>
      </div>

      <!-- Payment Method -->
      <div class="bg-surface-container-low rounded-2xl p-4 border border-outline-variant/30">
        <h3 class="text-base font-semibold text-on-background mb-3">支付方式</h3>
        <div class="flex flex-col gap-3">
          <button
            v-for="method in paymentMethods"
            :key="method.key"
            class="flex items-center justify-between p-3 rounded-xl border transition-colors"
            :class="selectedPayment === method.key
              ? 'border-primary-container bg-primary-container/5'
              : 'border-outline-variant/50'"
            @click="selectedPayment = method.key"
          >
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-lg flex items-center justify-center text-lg" :class="method.iconColor">
                {{ method.icon }}
              </div>
              <span class="text-sm font-medium text-on-surface">{{ method.label }}</span>
            </div>
            <div
              class="w-5 h-5 rounded-full border-2 flex items-center justify-center"
              :class="selectedPayment === method.key ? 'border-primary-container' : 'border-outline-variant'"
            >
              <div
                v-if="selectedPayment === method.key"
                class="w-3 h-3 rounded-full bg-primary-container"
              />
            </div>
          </button>
        </div>
      </div>
    </div>

    <!-- Bottom Bar -->
    <div class="fixed bottom-0 left-0 w-full z-40 bg-surface-container-lowest border-t border-outline-variant/30 px-5 py-4 pb-safe">
      <div class="flex items-center justify-between">
        <div>
          <span class="text-xs text-on-surface-variant">合计</span>
          <div class="flex items-baseline gap-0.5">
            <span class="text-error text-sm font-bold">¥</span>
            <span class="font-display text-2xl font-bold text-error">{{ totalAmount.toFixed(2) }}</span>
          </div>
        </div>
        <button class="bg-primary-container text-white px-10 py-3 rounded-full font-medium flex items-center gap-2 active:scale-95 transition-transform">
          立即支付
          <span class="material-symbols-outlined" style="font-size: 18px;">arrow_forward</span>
        </button>
      </div>
    </div>
  </div>
</template>
