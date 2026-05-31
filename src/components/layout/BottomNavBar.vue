<script setup>
import { useRoute } from 'vue-router'
import { useCart } from '../../composables/useCart'

const route = useRoute()
const { totalCount } = useCart()

const navItems = [
  { path: '/', icon: 'home', label: '首页' },
  { path: '/category', icon: 'grid_view', label: '分类' },
  { path: '/cart', icon: 'shopping_cart', label: '购物车' },
  { path: '/profile', icon: 'person', label: '我的' }
]
</script>

<template>
  <nav class="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center h-20 pb-safe px-6 backdrop-blur-md rounded-t-2xl border-t theme-card shadow-[0_-4px_16px_rgba(242,140,40,0.06)] md:hidden" style="border-color: var(--theme-card-border);">
    <router-link
      v-for="item in navItems"
      :key="item.path"
      :to="item.path"
      class="flex flex-col items-center justify-center relative transition-colors active:scale-90 duration-200 flex-1 h-full"
      :class="route.path === item.path ? 'text-primary' : 'theme-text-secondary hover:bg-surface-container'"
    >
      <span
        class="material-symbols-outlined"
        :style="{ fontVariationSettings: route.path === item.path ? `'FILL' 1` : `'FILL' 0` }"
      >{{ item.icon }}</span>
      <span class="text-[11px] mt-1" :class="route.path === item.path ? 'font-bold' : 'font-medium'">{{ item.label }}</span>
      <div v-if="route.path === item.path" class="w-1 h-1 bg-primary rounded-full mt-0.5"></div>
      <div
        v-if="item.path === '/cart' && totalCount > 0"
        class="absolute -top-1 -right-2 bg-error text-white text-[8px] font-bold px-1.5 rounded-full min-w-[16px] text-center"
      >
        {{ totalCount > 99 ? '99+' : totalCount }}
      </div>
    </router-link>
  </nav>
</template>
