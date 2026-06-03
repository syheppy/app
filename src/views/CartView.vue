<script setup>
import { ref, computed, onMounted, nextTick, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useCart } from '../composables/useCart'
import { useAuth } from '../composables/useAuth'
import { useToast } from '../composables/useToast'
import { supabase } from '../utils/supabase'
import { staggerItems } from '../utils/animations'

const router = useRouter()
const { items, removeItem, updateQuantity, totalCount, totalPrice, clearCart } = useCart()
const { user } = useAuth()
const { show: showToast } = useToast()

const isEmpty = computed(() => items.length === 0)
const defaultAddress = ref(null)
const isEditing = ref(false)
const selectedItems = ref(new Set())

// 推荐商品
const recommendations = ref([])

const freeShippingDiff = computed(() => Math.max(0, 99 - totalPrice.value).toFixed(2))

// 全选状态
const allSelected = computed(() => {
  return items.length > 0 && items.every(item => selectedItems.value.has(item.id))
})

// 编辑模式下选择商品
const toggleSelect = (id) => {
  if (selectedItems.value.has(id)) {
    selectedItems.value.delete(id)
  } else {
    selectedItems.value.add(id)
  }
}

const toggleSelectAll = () => {
  if (allSelected.value) {
    selectedItems.value.clear()
  } else {
    items.forEach(item => selectedItems.value.add(item.id))
  }
}

// 删除选中的商品
const deleteSelected = () => {
  if (selectedItems.value.size === 0) {
    showToast('请选择要删除的商品')
    return
  }
  selectedItems.value.forEach(id => removeItem(id))
  selectedItems.value.clear()
  isEditing.value = false
  showToast('已删除')
}

onMounted(async () => {
  // 获取默认地址
  if (user.value) {
    const { data } = await supabase
      .from('addresses')
      .select('*')
      .eq('user_id', user.value.id)
      .eq('is_default', true)
      .maybeSingle()
    if (data) defaultAddress.value = data
  }

  // 获取推荐商品
  const { data } = await supabase
    .from('products')
    .select('*')
    .eq('status', true)
    .eq('is_recommended', true)
    .limit(4)
  if (data) recommendations.value = data

  // 入场动画
  await nextTick()
  staggerItems('.cart-item')
})
</script>

<template>
  <div class="min-h-screen font-body pb-20" style="background-color: var(--color-background);">
    <!-- Header with Gradient -->
    <div class="fixed top-0 left-0 w-full z-40 px-4 pt-3 pb-4 md:hidden" style="background: linear-gradient(to bottom, var(--theme-bg), color-mix(in srgb, var(--theme-bg) 80%, transparent));">
      <div class="flex items-center justify-between">
        <h1 class="font-headline text-lg font-bold text-on-surface">购物车</h1>
        <button
          v-if="!isEmpty"
          class="text-sm text-on-surface-variant font-medium px-3 py-1.5 rounded-full hover:bg-surface-container transition-colors"
          @click="isEditing = !isEditing"
        >
          {{ isEditing ? '完成' : '编辑' }}
        </button>
      </div>
    </div>

    <main class="pt-[70px] px-4 pb-6 max-w-lg mx-auto">
      <!-- Default Address -->
      <div v-if="defaultAddress" class="bg-surface-container-low rounded-2xl p-4 mb-4 shadow-sm flex items-center gap-3 cursor-pointer" @click="router.push('/address')">
        <div class="w-8 h-8 rounded-full bg-primary-fixed/50 flex items-center justify-center shrink-0">
          <span class="material-symbols-outlined text-primary" style="font-size: 18px;">location_on</span>
        </div>
        <div class="flex-1 min-w-0">
          <span class="text-[11px] text-on-surface-variant">送至</span>
          <p class="text-[13px] font-medium text-on-surface leading-tight truncate">{{ defaultAddress.address }}</p>
        </div>
        <span class="material-symbols-outlined text-outline" style="font-size: 20px;">chevron_right</span>
      </div>

      <!-- Empty State -->
      <div v-if="isEmpty" class="flex flex-col items-center justify-center py-20">
        <span class="material-symbols-outlined text-outline mb-4" style="font-size: 56px;">shopping_cart</span>
        <p class="text-on-surface-variant mb-4">购物车空空如也</p>
        <button class="px-8 py-3 rounded-xl bg-primary text-on-primary font-medium active:scale-95 transition-transform" @click="router.push('/')">
          去逛逛
        </button>
      </div>

      <template v-else>
        <!-- Cart Block -->
        <div class="bg-gradient-to-b from-surface-container-low/50 to-surface-container-low rounded-2xl shadow-sm overflow-hidden mb-4">
          <!-- Promo -->
          <div class="flex items-center justify-between px-4 py-3 bg-primary/5 mb-2">
            <div class="flex items-center gap-2">
              <span class="bg-primary text-on-primary text-[10px] px-1.5 py-0.5 rounded font-medium">满减</span>
              <span class="text-[12px] text-on-surface">已享满99减15优惠</span>
            </div>
            <button class="text-[12px] text-primary font-medium flex items-center bg-transparent border-none cursor-pointer">
              去凑单 <span class="material-symbols-outlined" style="font-size: 14px;">chevron_right</span>
            </button>
          </div>

          <!-- Store Header -->
          <div class="flex items-center gap-2 px-4 py-2">
            <button
              :class="['w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-colors', allSelected ? 'bg-primary' : 'border border-outline-variant']"
              @click="toggleSelectAll"
            >
              <span v-if="allSelected" class="material-symbols-outlined text-white" style="font-size: 14px;">check</span>
            </button>
            <span class="material-symbols-outlined text-on-surface" style="font-size: 18px;">storefront</span>
            <span class="text-[14px] font-medium text-on-surface flex items-center">
              薯鲜生官方旗舰店 <span class="material-symbols-outlined text-outline" style="font-size: 16px;">chevron_right</span>
            </span>
          </div>

          <!-- Items -->
          <div class="space-y-4 px-4 pt-2 pb-4">
            <div v-for="item in items" :key="item.id" class="flex gap-3 relative cart-item">
              <button
                :class="['w-5 h-5 mt-[32px] rounded-full flex items-center justify-center shrink-0 transition-colors', (isEditing ? selectedItems.has(item.id) : true) ? 'bg-primary' : 'border border-outline-variant']"
                @click="isEditing ? toggleSelect(item.id) : null"
              >
                <span v-if="isEditing ? selectedItems.has(item.id) : true" class="material-symbols-outlined text-white" style="font-size: 14px;">check</span>
              </button>

              <div class="w-[84px] h-[84px] rounded-lg bg-surface-container overflow-hidden shrink-0">
                <img :src="item.image" :alt="item.name" class="w-full h-full object-cover" />
              </div>

              <div class="flex-1 flex flex-col pt-0.5">
                <h3 class="text-[14px] font-medium text-on-surface leading-snug tracking-tight mb-1">{{ item.name }}</h3>
                <div class="inline-flex self-start items-center bg-surface-container px-2 py-0.5 rounded text-[11px] text-on-surface-variant mb-1.5">
                  {{ item.specs?.[0]?.name || '默认规格' }}
                </div>
                <span class="inline-flex self-start border border-primary/30 text-primary text-[10px] px-1 py-0.5 rounded-sm mb-auto">
                  产地直发
                </span>

                <div class="flex items-end justify-between mt-auto pt-2">
                  <div class="text-primary">
                    <span class="text-price-sm">¥</span>
                    <span class="text-price-md">{{ item.price.toFixed(2) }}</span>
                  </div>

                  <div v-if="!isEditing" class="flex items-center bg-surface-container-high border border-outline-variant rounded py-0.5 px-0.5">
                    <button @click="updateQuantity(item.id, -1)" class="w-6 h-5 flex items-center justify-center text-on-surface-variant">
                      <span class="material-symbols-outlined" style="font-size: 14px;">remove</span>
                    </button>
                    <span class="w-7 text-center text-[13px] font-medium text-on-surface">{{ item.quantity }}</span>
                    <button @click="updateQuantity(item.id, 1)" class="w-6 h-5 flex items-center justify-center text-on-surface">
                      <span class="material-symbols-outlined" style="font-size: 14px;">add</span>
                    </button>
                  </div>

                  <button v-else class="text-xs text-error font-medium bg-error/10 px-3 py-1 rounded-lg" @click="removeItem(item.id)">
                    删除
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Divider -->
        <div class="flex items-center justify-center gap-4 py-4">
          <div class="h-[1px] w-12 bg-outline-variant/50"></div>
          <span class="text-[11px] text-on-surface-variant tracking-widest font-serif">猜你喜欢</span>
          <div class="h-[1px] w-12 bg-outline-variant/50"></div>
        </div>

        <!-- Recommendations -->
        <div class="grid grid-cols-2 gap-3 mb-24">
          <div v-for="rec in recommendations" :key="rec.id" class="bg-surface-container-low rounded-2xl overflow-hidden shadow-sm flex flex-col cursor-pointer" @click="router.push(`/product/${rec.id}`)">
            <div class="aspect-[4/3] bg-surface-container overflow-hidden">
              <img :src="rec.image_url" :alt="rec.name" class="w-full h-full object-cover" />
            </div>
            <div class="p-3 flex flex-col flex-1">
              <h4 class="text-[13px] font-medium text-on-surface mb-1 truncate">{{ rec.name }}</h4>
              <p class="text-[11px] text-on-surface-variant mb-2">{{ rec.taste || rec.category }}</p>
              <div class="mt-auto flex items-center justify-between">
                <div class="text-primary">
                  <span class="text-price-sm">¥</span>
                  <span class="text-price-sm">{{ rec.price }}</span>
                </div>
                <button class="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary" @click.stop="router.push(`/product/${rec.id}`)">
                  <span class="material-symbols-outlined" style="font-size: 16px;">add</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </template>
    </main>

    <!-- Bottom Checkout Bar -->
    <div v-if="!isEmpty" class="fixed bottom-[70px] left-0 w-full z-30">
      <div class="max-w-lg mx-auto px-4">
        <div class="bg-surface/95 backdrop-blur-md rounded-full p-3 flex items-center justify-between shadow-lg border border-outline-variant/30">
          <div class="flex items-center gap-2" @click="toggleSelectAll">
            <button :class="['w-[18px] h-[18px] rounded-full flex items-center justify-center shrink-0 transition-colors', allSelected ? 'bg-primary' : 'border border-outline-variant']">
              <span v-if="allSelected" class="material-symbols-outlined text-white" style="font-size: 12px;">check</span>
            </button>
            <span class="text-[13px] text-on-surface">全选</span>
          </div>

          <div v-if="isEditing" class="flex items-center gap-3">
            <button
              class="bg-error text-on-error px-6 py-2 rounded-full text-[13px] font-medium shadow-sm active:scale-95 transition-transform"
              @click="deleteSelected"
            >
              删除 ({{ selectedItems.size }})
            </button>
          </div>

          <div v-else class="flex items-center gap-3">
            <div class="text-right">
              <span class="text-caption-sm text-on-surface-variant mr-1">合计:</span>
              <span class="text-price-md text-primary">¥{{ totalPrice.toFixed(2) }}</span>
            </div>
            <button
              class="bg-primary text-on-primary px-6 py-2 rounded-full text-[14px] font-medium shadow-sm active:scale-95 transition-transform"
              @click="router.push('/checkout')"
            >
              去结算 ({{ totalCount }})
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
