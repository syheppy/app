<script setup>
import { ref } from 'vue'

const tabs = ['全部', '待付款', '待发货', '待收货', '待评价']
const activeTab = ref('待收货')

const orders = ref([])

const goBack = () => {
  // TODO: navigate back
}
</script>

<template>
  <div class="min-h-screen bg-background text-on-surface">
    <!-- Header -->
    <div class="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-outline-variant/30">
      <div class="flex items-center justify-between px-4 h-14">
        <button class="p-2 active:scale-95 transition-transform" @click="goBack">
          <span class="material-symbols-outlined text-on-surface">arrow_back</span>
        </button>
        <h1 class="text-lg font-semibold text-on-background">我的订单</h1>
        <button class="p-2 active:scale-95 transition-transform">
          <span class="material-symbols-outlined text-on-surface">search</span>
        </button>
      </div>

      <!-- Tabs -->
      <div class="flex overflow-x-auto hide-scrollbar px-4 gap-6">
        <button
          v-for="tab in tabs"
          :key="tab"
          class="pb-3 text-sm whitespace-nowrap transition-colors relative"
          :class="activeTab === tab ? 'text-primary-container font-semibold' : 'text-on-surface-variant'"
          @click="activeTab = tab"
        >
          {{ tab }}
          <div
            v-if="activeTab === tab"
            class="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-primary-container rounded-full"
          />
        </button>
      </div>
    </div>

    <!-- Empty State -->
    <div class="flex flex-col items-center justify-center pt-32 px-8">
      <div class="w-20 h-20 rounded-full bg-surface-container-high flex items-center justify-center mb-4">
        <span class="material-symbols-outlined text-outline" style="font-size: 40px;">receipt_long</span>
      </div>
      <p class="text-on-surface-variant text-sm">暂无订单</p>
    </div>

    <!-- Bottom Nav -->
    <div class="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center h-16 pb-safe bg-white/95 backdrop-blur-md border-t border-outline-variant/30 md:hidden">
      <button class="flex flex-col items-center gap-0.5 text-stone-400">
        <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 0;">home</span>
        <span class="text-[10px]">首页</span>
      </button>
      <button class="flex flex-col items-center gap-0.5 text-stone-400">
        <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 0;">grid_view</span>
        <span class="text-[10px]">分类</span>
      </button>
      <button class="flex flex-col items-center gap-0.5 text-stone-400">
        <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 0;">shopping_cart</span>
        <span class="text-[10px]">购物车</span>
      </button>
      <button class="flex flex-col items-center gap-0.5 text-primary">
        <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">person</span>
        <span class="text-[10px] font-bold">我的</span>
      </button>
    </div>
  </div>
</template>
