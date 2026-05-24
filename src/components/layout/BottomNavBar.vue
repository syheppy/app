<script setup>
defineProps({
  active: { type: String, default: 'home' }
})

defineEmits(['navigate'])
</script>

<template>
  <nav class="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center h-20 pb-safe px-6 bg-white/95 backdrop-blur-md rounded-t-2xl border-t border-stone-100 shadow-[0_-4px_16px_rgba(242,140,40,0.06)] md:hidden">
    <button
      v-for="item in [
        { key: 'home', icon: 'home', label: '首页' },
        { key: 'category', icon: 'grid_view', label: '分类' },
        { key: 'cart', icon: 'shopping_cart', label: '购物车', badge: 2 },
        { key: 'user', icon: 'person', label: '我的' }
      ]"
      :key="item.key"
      class="flex flex-col items-center justify-center relative transition-colors active:scale-90 duration-200 flex-1 h-full"
      :class="active === item.key ? 'text-primary' : 'text-stone-400 hover:bg-stone-50'"
      @click="$emit('navigate', item.key)"
    >
      <span
        class="material-symbols-outlined"
        :style="{ fontVariationSettings: active === item.key ? `'FILL' 1` : `'FILL' 0` }"
      >{{ item.icon }}</span>
      <span class="text-[11px] mt-1" :class="active === item.key ? 'font-bold' : 'font-medium'">{{ item.label }}</span>
      <div v-if="active === item.key" class="w-1 h-1 bg-primary rounded-full mt-0.5"></div>
      <div v-if="item.badge" class="absolute -top-1 -right-2 bg-error text-white text-[8px] font-bold px-1.5 rounded-full">{{ item.badge }}</div>
    </button>
  </nav>
</template>
