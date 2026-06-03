<script setup>
const props = defineProps({
  type: { type: String, default: 'card' }
})
</script>

<template>
  <!-- 首页骨架屏 -->
  <div v-if="type === 'home'" class="space-y-6 px-4">
    <!-- 横幅骨架 -->
    <div class="h-[200px] rounded-2xl bg-surface-container animate-pulse overflow-hidden">
      <div class="w-full h-full bg-gradient-to-r from-surface-container via-surface-container-high to-surface-container animate-shimmer"></div>
    </div>

    <!-- 信任标识骨架 -->
    <div class="grid grid-cols-4 gap-4">
      <div v-for="i in 4" :key="i" class="flex flex-col items-center gap-2">
        <div class="w-12 h-12 rounded-full bg-surface-container animate-pulse"></div>
        <div class="w-12 h-3 rounded bg-surface-container animate-pulse"></div>
      </div>
    </div>

    <!-- 热销标题骨架 -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <div class="w-6 h-6 rounded bg-surface-container animate-pulse"></div>
        <div class="w-24 h-5 rounded bg-surface-container animate-pulse"></div>
      </div>
      <div class="w-16 h-4 rounded bg-surface-container animate-pulse"></div>
    </div>

    <!-- 商品卡片骨架 -->
    <div class="grid grid-cols-2 gap-4">
      <!-- 大卡片骨架 -->
      <div class="col-span-2 rounded-2xl bg-surface-container animate-pulse overflow-hidden">
        <div class="h-[200px] bg-surface-container-high"></div>
        <div class="p-4 space-y-2">
          <div class="w-3/4 h-5 rounded bg-surface-container-high animate-pulse"></div>
          <div class="w-1/2 h-4 rounded bg-surface-container-high animate-pulse"></div>
          <div class="flex justify-between items-center">
            <div class="w-20 h-6 rounded bg-surface-container-high animate-pulse"></div>
            <div class="w-8 h-8 rounded-full bg-surface-container-high animate-pulse"></div>
          </div>
        </div>
      </div>

      <!-- 小卡片骨架 -->
      <div v-for="i in 2" :key="i" class="rounded-2xl bg-surface-container animate-pulse overflow-hidden">
        <div class="h-[120px] bg-surface-container-high"></div>
        <div class="p-3 space-y-2">
          <div class="w-3/4 h-4 rounded bg-surface-container-high animate-pulse"></div>
          <div class="w-1/2 h-3 rounded bg-surface-container-high animate-pulse"></div>
          <div class="w-16 h-5 rounded bg-surface-container-high animate-pulse"></div>
        </div>
      </div>
    </div>

    <!-- 推荐标题骨架 -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <div class="w-6 h-6 rounded bg-surface-container animate-pulse"></div>
        <div class="w-20 h-5 rounded bg-surface-container animate-pulse"></div>
      </div>
    </div>

    <!-- 推荐商品骨架 -->
    <div class="grid grid-cols-2 gap-4">
      <div v-for="i in 4" :key="i" class="rounded-2xl bg-surface-container animate-pulse overflow-hidden">
        <div class="h-[120px] bg-surface-container-high"></div>
        <div class="p-3 space-y-2">
          <div class="w-3/4 h-4 rounded bg-surface-container-high animate-pulse"></div>
          <div class="w-1/2 h-3 rounded bg-surface-container-high animate-pulse"></div>
          <div class="w-16 h-5 rounded bg-surface-container-high animate-pulse"></div>
        </div>
      </div>
    </div>
  </div>

  <!-- 商品详情骨架屏 -->
  <div v-else-if="type === 'product'" class="space-y-6 px-4">
    <!-- 商品图片骨架 -->
    <div class="aspect-[4/3] rounded-2xl bg-surface-container animate-pulse"></div>

    <!-- 商品信息骨架 -->
    <div class="space-y-3">
      <div class="w-3/4 h-8 rounded bg-surface-container animate-pulse"></div>
      <div class="flex items-baseline gap-3">
        <div class="w-16 h-8 rounded bg-surface-container animate-pulse"></div>
        <div class="w-24 h-6 rounded bg-surface-container animate-pulse"></div>
      </div>
    </div>

    <!-- 特色卡片骨架 -->
    <div class="grid grid-cols-2 gap-4">
      <div v-for="i in 3" :key="i" class="h-24 rounded-xl bg-surface-container animate-pulse"></div>
    </div>

    <!-- 描述骨架 -->
    <div class="space-y-2">
      <div class="w-1/3 h-5 rounded bg-surface-container animate-pulse"></div>
      <div class="w-full h-4 rounded bg-surface-container animate-pulse"></div>
      <div class="w-5/6 h-4 rounded bg-surface-container animate-pulse"></div>
      <div class="w-2/3 h-4 rounded bg-surface-container animate-pulse"></div>
    </div>
  </div>

  <!-- 列表骨架屏 -->
  <div v-else-if="type === 'list'" class="space-y-4 px-4">
    <div v-for="i in 5" :key="i" class="flex gap-3 p-4 rounded-xl bg-surface-container animate-pulse">
      <div class="w-20 h-20 rounded-lg bg-surface-container-high"></div>
      <div class="flex-1 space-y-2">
        <div class="w-3/4 h-5 rounded bg-surface-container-high"></div>
        <div class="w-1/2 h-4 rounded bg-surface-container-high"></div>
        <div class="w-16 h-5 rounded bg-surface-container-high"></div>
      </div>
    </div>
  </div>

  <!-- 通用骨架屏 -->
  <div v-else class="space-y-3 px-4">
    <div v-for="i in 5" :key="i" class="h-16 rounded-xl bg-surface-container animate-pulse"></div>
  </div>
</template>

<style scoped>
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

.animate-shimmer {
  background: linear-gradient(90deg,
    var(--color-surface-container) 25%,
    var(--color-surface-container-high) 50%,
    var(--color-surface-container) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}
</style>
