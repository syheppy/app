<script setup>
import { ref } from 'vue'
import TopHeader from '../components/layout/TopHeader.vue'
import BottomNavBar from '../components/layout/BottomNavBar.vue'

const address = {
  tag: '家',
  address: '朝阳区建国路88号 现代城4号楼',
  name: '张伟',
  phone: '138 0013 8000'
}

const cartItems = ref([
  {
    id: 1,
    name: '六鳌蜜薯 5kg装',
    desc: '5kg，精心挑选',
    price: 59.90,
    quantity: 1,
    checked: true,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDBy2A6zE0BECANX8jnVMrYT2AxFjCwNIdVfo_qxBLEaYIecSfvuxnvrWoWvWy9r8muZKZ24VmsRwJCz7exVuuK-d-iS1lZOYqw5AfgupZXnCF3IsNexd07n7sfYdTfbddhRRbynFa7komAWYqfXGxIFILGMUfCGUBi13risQXsU3QYYiQP2fhj0_0kCqTdiIZqYtwKN2Obo1noWH2PxAFCSFV862KKdd_JoutTvRrO8S4EOdvvIDJxUkCFf320LVcqLYA51ymjCJEQ'
  },
  {
    id: 2,
    name: '烟薯25号 3kg装',
    desc: '3kg，新鲜采挖',
    price: 39.90,
    quantity: 2,
    checked: false,
    image: 'https://lh3.googleusercontent.com/aida/ADBb0uiSU54_g3nmA8rJT-tXJpsN0WgzHOkS5cHyxyj1qSH-2i7pDm2oRxLrhtnA9J8gD0p6K8axFH-dzIVy2Qyj6bBSdsYqlAtCH_hVccROJWcD5XVwMFDU5UG6-Bwck8dvQPSS1l2AEZNzStQBeZqphuQ-KBjXGyIPj3aQdPBtAFe7ny95_h2wV9cnOn9xSTQV5kNSafz3f1uGOjxtKRCFB0trQJnNOE8mqozujZTrCOZvQ3TKKfmenGn8sNAL'
  }
])

const toggleCheck = (item) => {
  item.checked = !item.checked
}

const updateQty = (item, delta) => {
  const newQty = item.quantity + delta
  if (newQty >= 1) item.quantity = newQty
}

const removeItem = (id) => {
  cartItems.value = cartItems.value.filter(i => i.id !== id)
}

const selectedTotal = ref(59.90)
const totalCount = ref(1)

const freeShippingGap = ref(15.01)
</script>

<template>
  <div class="min-h-screen bg-background text-on-surface">
    <TopHeader />

    <main class="px-5 pt-2 pb-24 md:pb-8">
      <!-- Title -->
      <h1 class="font-display text-2xl font-bold text-on-background mb-1">购物车</h1>
      <p class="text-sm text-on-surface-variant mb-4">查看您的精选商品</p>

      <!-- Address Card -->
      <div class="bg-surface-container-low rounded-2xl p-4 mb-4 flex items-center justify-between border border-outline-variant/30">
        <div class="flex-1">
          <div class="flex items-center gap-2 mb-1">
            <span class="text-[10px] bg-primary-container text-white px-1.5 py-0.5 rounded font-medium">默认</span>
            <span class="text-sm font-medium text-on-surface">{{ address.tag }}</span>
          </div>
          <p class="text-sm text-on-surface-variant">{{ address.address }}</p>
          <p class="text-xs text-outline mt-1">{{ address.name }} · {{ address.phone }}</p>
        </div>
        <span class="material-symbols-outlined text-outline" style="font-size: 20px;">chevron_right</span>
      </div>

      <!-- Cart Items -->
      <div class="flex flex-col gap-3 mb-4">
        <div
          v-for="item in cartItems"
          :key="item.id"
          class="bg-surface-container-low rounded-2xl p-4 flex gap-3 border border-outline-variant/30"
        >
          <!-- Checkbox -->
          <button
            class="w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center mt-1 transition-colors"
            :class="item.checked ? 'bg-primary-container border-primary-container' : 'border-outline-variant'"
            @click="toggleCheck(item)"
          >
            <span v-if="item.checked" class="material-symbols-outlined text-white" style="font-size: 14px;">check</span>
          </button>

          <!-- Image -->
          <img :src="item.image" :alt="item.name" class="w-20 h-20 rounded-xl object-cover flex-shrink-0" />

          <!-- Info -->
          <div class="flex-1 flex flex-col justify-between min-w-0">
            <div>
              <div class="flex items-start justify-between">
                <h4 class="text-sm font-medium text-on-surface line-clamp-1">{{ item.name }}</h4>
                <button class="ml-2 flex-shrink-0" @click="removeItem(item.id)">
                  <span class="material-symbols-outlined text-outline" style="font-size: 18px;">delete</span>
                </button>
              </div>
              <p class="text-xs text-on-surface-variant mt-0.5">{{ item.desc }}</p>
            </div>
            <div class="flex items-center justify-between mt-2">
              <span class="text-error font-bold">¥{{ item.price.toFixed(2) }}</span>
              <div class="flex items-center gap-2">
                <button
                  class="w-7 h-7 rounded-full bg-surface-container-high flex items-center justify-center active:scale-90 transition-transform"
                  @click="updateQty(item, -1)"
                >
                  <span class="material-symbols-outlined text-on-surface-variant" style="font-size: 16px;">remove</span>
                </button>
                <span class="text-sm font-medium w-5 text-center">{{ item.quantity }}</span>
                <button
                  class="w-7 h-7 rounded-full bg-surface-container-high flex items-center justify-center active:scale-90 transition-transform"
                  @click="updateQty(item, 1)"
                >
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
          <span class="material-symbols-outlined text-primary-container" style="font-size: 18px;">local_offer</span>
          <span class="text-xs text-on-surface-variant">再买 ¥{{ freeShippingGap.toFixed(2) }} 即可享受免邮</span>
        </div>
        <button class="text-xs text-primary-container font-medium">去凑单</button>
      </div>

      <!-- Bottom Bar -->
      <div class="bg-surface-container-lowest rounded-2xl p-4 flex items-center justify-between border border-outline-variant/30 shadow-md">
        <div class="flex items-center gap-3">
          <button class="w-5 h-5 rounded-full bg-primary-container flex items-center justify-center">
            <span class="material-symbols-outlined text-white" style="font-size: 14px;">check</span>
          </button>
          <div>
            <span class="text-xs text-on-surface-variant">合计 ({{ totalCount }}件)</span>
            <div class="text-error font-bold text-lg">¥{{ selectedTotal.toFixed(2) }}</div>
          </div>
        </div>
        <button class="bg-primary-container text-white px-8 py-3 rounded-full font-medium active:scale-95 transition-transform">
          去结算
        </button>
      </div>
    </main>

    <BottomNavBar active="cart" />
  </div>
</template>
