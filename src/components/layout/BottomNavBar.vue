<script setup>
import { useRoute } from 'vue-router'
import { useCart } from '../../composables/useCart'
import { computed } from 'vue'

import homeInactive from '../../assets/icons-nav/home-inactive.png'
import homeActive from '../../assets/icons-nav/home-active.png'
import categoryInactive from '../../assets/icons-nav/category-inactive.png'
import categoryActive from '../../assets/icons-nav/category-active.png'
import cartInactive from '../../assets/icons-nav/cart-inactive.png'
import cartActive from '../../assets/icons-nav/cart-active.png'
import profileInactive from '../../assets/icons-nav/profile-inactive.png'
import profileActive from '../../assets/icons-nav/profile-active.png'

const route = useRoute()
const { totalCount } = useCart()

const navItems = [
  { path: '/', icon: { active: homeActive, inactive: homeInactive }, label: '首页' },
  { path: '/category', icon: { active: categoryActive, inactive: categoryInactive }, label: '分类' },
  { path: '/cart', icon: { active: cartActive, inactive: cartInactive }, label: '购物车' },
  { path: '/profile', icon: { active: profileActive, inactive: profileInactive }, label: '我的' }
]
</script>

<template>
  <nav class="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center h-20 pb-safe px-6 backdrop-blur-md rounded-t-2xl border-t shadow-[0_-4px_16px_rgba(242,140,40,0.06)] md:hidden" style="background-color: var(--color-surface); border-color: var(--color-outline-variant);">
    <router-link
      v-for="item in navItems"
      :key="item.path"
      :to="item.path"
      class="flex flex-col items-center justify-center relative transition-all active:scale-90 duration-200 flex-1 h-full"
      :class="route.path === item.path ? '' : 'hover:bg-surface-container'"
    >
      <img
        :src="route.path === item.path ? item.icon.active : item.icon.inactive"
        :alt="item.label"
        class="w-[35px] h-[35px] object-contain transition-transform duration-200"
        :class="route.path === item.path ? 'scale-105' : ''"
      >
      <span class="text-[11px] mt-1" :class="route.path === item.path ? 'font-bold' : 'font-medium'" :style="{ color: route.path === item.path ? '#e88a2d' : '#666' }">{{ item.label }}</span>
      <div v-if="route.path === item.path" class="w-1 h-1 rounded-full mt-0.5" style="background-color: #e88a2d;"></div>
      <div
        v-if="item.path === '/cart' && totalCount > 0"
        class="absolute -top-1 -right-2 bg-error text-white text-[8px] font-bold px-1.5 rounded-full min-w-[16px] text-center"
      >
        {{ totalCount > 99 ? '99+' : totalCount }}
      </div>
    </router-link>
  </nav>
</template>
