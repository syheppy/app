<script setup>
const orderInfo = {
  amount: '128.50',
  paymentMethod: '微信支付',
  orderTime: '2023-10-24 14:30:00',
  orderId: 'SHR202310249876'
}

const recommendProducts = [
  {
    name: '手作蜜汁烤瓜干',
    price: '38.00',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAQ0uF_3QAWFwCRB3gi8j47ivRDfQV_N_KFIi0dlbumTNE68Mk9i8s-ezPMuIsy4qmG-qhTp-p2y13e7W4_Hj6Kdz4lGxTPkgwthiKlEjO4u7ObCTOG2nASTL-yQ85OWoshDHxwfy1dEIMLy1bESHYqZkRx-y-TAipwLyqF4Rwl3hKWHEjio4CHoqrfzk7n6S67xaUJ-Pj-BP_wC5cUYCki-aVXIB9oVlk-C0YogOeIoxsMwLSX_ZgtndtVImEfMPIHjD9ZD3UyzMk8'
  },
  {
    name: '紫薯薄片脆脆',
    price: '29.90',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBulzCTbA-MIR6eQbf4DpQHLzJNb2HbGtWLsuDzB_QH0eUPM4bXAmGbZsIfGRxgg-XwNU3kh7bjgqbHGk4vPUha1kpfTRdUk9aErCtoiuex3Mv_EvcCSTM-pKt_k5pXtts3CszmwzXWGMaot8adLqXWEiXgNtDiF7JtlHNlyfpKJdtIwBKpwZqmFNnUhWsh-EgrU025ET_XqpzmFJSZKehHU60_hv1ZOFeDVmtvm3IX2f5Pnk4O0Jl3erj-IZKjlituOvH2SKLAWUez'
  }
]
</script>

<template>
  <div class="min-h-screen bg-background text-on-surface">
    <!-- Header -->
    <div class="flex items-center justify-between px-4 h-14">
      <button class="p-2 active:scale-95 transition-transform">
        <span class="material-symbols-outlined text-on-surface">arrow_back</span>
      </button>
      <h1 class="text-lg font-semibold text-on-background font-display italic">Sahara</h1>
      <div class="w-10"></div>
    </div>

    <div class="px-5 py-4">
      <!-- Success Icon -->
      <div class="flex flex-col items-center mb-6">
        <div class="w-20 h-20 rounded-full bg-primary-container/10 flex items-center justify-center mb-4">
          <span class="material-symbols-outlined text-primary-container" style="font-size: 48px;">check_circle</span>
        </div>
        <h1 class="font-display text-2xl font-bold text-on-background mb-2">支付成功</h1>
        <p class="text-sm text-on-surface-variant text-center">农场正在为您火速备货中，美味稍后就到。</p>
      </div>

      <!-- Order Details -->
      <div class="bg-surface-container-low rounded-2xl p-5 mb-6 border border-outline-variant/30">
        <div class="flex items-center justify-between py-2.5 border-b border-outline-variant/30">
          <span class="text-sm text-on-surface-variant">实付金额</span>
          <span class="text-error font-bold text-lg">¥ {{ orderInfo.amount }}</span>
        </div>
        <div class="flex items-center justify-between py-2.5 border-b border-outline-variant/30">
          <span class="text-sm text-on-surface-variant">支付方式</span>
          <span class="text-sm text-on-surface">{{ orderInfo.paymentMethod }}</span>
        </div>
        <div class="flex items-center justify-between py-2.5 border-b border-outline-variant/30">
          <span class="text-sm text-on-surface-variant">下单时间</span>
          <span class="text-sm text-on-surface">{{ orderInfo.orderTime }}</span>
        </div>
        <div class="flex items-center justify-between py-2.5">
          <span class="text-sm text-on-surface-variant">订单编号</span>
          <span class="text-sm text-on-surface">{{ orderInfo.orderId }}</span>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex gap-3 mb-8">
        <button class="flex-1 py-3 rounded-full border-2 border-outline-variant text-on-surface font-medium active:scale-95 transition-transform">
          查看订单
        </button>
        <button class="flex-1 py-3 rounded-full bg-primary-container text-white font-medium active:scale-95 transition-transform">
          返回首页
        </button>
      </div>

      <!-- Recommended Products -->
      <section>
        <h2 class="text-base font-semibold text-on-background mb-3">为您推荐</h2>
        <div class="grid grid-cols-2 gap-3">
          <div
            v-for="(product, index) in recommendProducts"
            :key="index"
            class="bg-surface-container-low rounded-2xl overflow-hidden border border-outline-variant/30 group cursor-pointer"
          >
            <div class="h-32 overflow-hidden">
              <img
                :src="product.image"
                :alt="product.name"
                class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div class="p-3">
              <h4 class="text-sm font-medium text-on-surface line-clamp-1 mb-2">{{ product.name }}</h4>
              <div class="flex items-center justify-between">
                <div class="flex items-baseline gap-0.5">
                  <span class="text-error text-sm font-bold">¥</span>
                  <span class="text-error text-lg font-bold">{{ product.price }}</span>
                </div>
                <button class="w-7 h-7 rounded-full bg-primary-container text-white flex items-center justify-center active:scale-90 transition-transform">
                  <span class="material-symbols-outlined" style="font-size: 16px;">add</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>
