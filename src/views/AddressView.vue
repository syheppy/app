<script setup>
import { ref } from 'vue'

const searchQuery = ref('')

const currentLocation = {
  address: '朝阳区大望路建国路88号 SOHO现代城'
}

const addresses = [
  {
    name: '张三',
    phone: '138****5678',
    tag: '家',
    tagColor: 'bg-primary-container/10 text-primary-container',
    address: '北京市朝阳区大望路建国路88号SOHO现代城 A座 1502室'
  },
  {
    name: '张三',
    phone: '138****5678',
    tag: '公司',
    tagColor: 'bg-secondary-container text-on-secondary-container',
    address: '北京市海淀区中关村大街甲59号文化大厦 8层 808室'
  },
  {
    name: '李四',
    phone: '139****1234',
    tag: '',
    address: '北京市丰台区南四环西路188号总部基地 16区 5号楼'
  }
]
</script>

<template>
  <div class="min-h-screen bg-background text-on-surface">
    <!-- Header -->
    <div class="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-outline-variant/30">
      <div class="flex items-center justify-between px-4 h-14">
        <button class="p-2 active:scale-95 transition-transform">
          <span class="material-symbols-outlined text-on-surface">arrow_back</span>
        </button>
        <h1 class="text-lg font-semibold text-on-background">选择收货地址</h1>
        <div class="w-10"></div>
      </div>
    </div>

    <div class="px-5 py-4">
      <!-- Search -->
      <div class="flex items-center bg-surface-container rounded-xl py-2.5 px-4 gap-2 mb-5">
        <span class="material-symbols-outlined text-outline" style="font-size: 20px;">search</span>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="搜索地址、小区、大厦等"
          class="flex-1 bg-transparent text-sm text-on-surface placeholder:text-outline outline-none"
        />
      </div>

      <!-- Current Location -->
      <div class="bg-surface-container-low rounded-2xl p-4 mb-5 border border-outline-variant/30">
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm text-on-surface-variant">当前定位</span>
          <button class="flex items-center gap-1 text-xs text-primary-container">
            <span class="material-symbols-outlined" style="font-size: 16px;">my_location</span>
            重新定位
          </button>
        </div>
        <div class="flex items-center gap-2">
          <span class="material-symbols-outlined text-primary-container" style="font-size: 20px;">location_on</span>
          <span class="text-sm font-medium text-on-surface">{{ currentLocation.address }}</span>
        </div>
      </div>

      <!-- Address List -->
      <h3 class="text-sm font-medium text-on-surface mb-3">我的收货地址</h3>
      <div class="flex flex-col gap-3 mb-6">
        <div
          v-for="(addr, index) in addresses"
          :key="index"
          class="bg-surface-container-low rounded-2xl p-4 border border-outline-variant/30 relative"
        >
          <!-- Selected Check -->
          <div v-if="index === 0" class="absolute top-3 right-3 w-6 h-6 rounded bg-primary-container flex items-center justify-center">
            <span class="material-symbols-outlined text-white" style="font-size: 16px;">check</span>
          </div>

          <div class="flex items-center gap-2 mb-2">
            <span class="text-base font-semibold text-on-background">{{ addr.name }}</span>
            <span class="text-sm text-on-surface-variant">{{ addr.phone }}</span>
            <span
              v-if="addr.tag"
              class="text-[10px] px-2 py-0.5 rounded-full"
              :class="addr.tagColor"
            >
              {{ addr.tag }}
            </span>
          </div>
          <p class="text-sm text-on-surface-variant leading-relaxed mb-3">{{ addr.address }}</p>
          <div class="flex justify-end">
            <button class="p-1 active:scale-95 transition-transform">
              <span class="material-symbols-outlined text-outline" style="font-size: 18px;">edit</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Add Button -->
      <button class="w-full py-3.5 rounded-full bg-primary-container text-white font-medium flex items-center justify-center gap-2 active:scale-[0.98] transition-transform">
        <span class="material-symbols-outlined" style="font-size: 20px;">add</span>
        新增收货地址
      </button>
    </div>
  </div>
</template>
