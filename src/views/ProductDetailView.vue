<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { supabase } from '../utils/supabase'
import { useCart } from '../composables/useCart'
import { useToast } from '../composables/useToast'

const route = useRoute()
const router = useRouter()
const { addItem } = useCart()
const { show: showToast } = useToast()

const product = ref(null)
const loading = ref(true)
const quantity = ref(1)
const selectedSpec = ref(null)
const drawerOpen = ref(false)

onMounted(async () => {
  const id = route.params.id
  if (!id) { loading.value = false; return }
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single()
    if (error) throw error
    product.value = { ...data, image: data.image_url, image_url: data.image_url }
    // Default spec
    if (data.specs && data.specs.length > 0) {
      selectedSpec.value = data.specs[0]
    }
  } catch (err) {
    console.error('Failed to fetch product:', err)
  } finally {
    loading.value = false
  }
})

const currentPrice = () => selectedSpec.value?.price || product.value?.price || 0

const handleAddToCart = () => {
  if (!product.value) return
  addItem({ ...product.value, price: currentPrice() })
  showToast('已加入购物车')
  drawerOpen.value = false
}

const handleBuyNow = () => {
  if (!product.value) return
  addItem({ ...product.value, price: currentPrice() })
  router.push('/checkout')
}
</script>

<template>
  <div class="min-h-screen bg-background text-on-surface">
    <!-- Loading -->
    <div v-if="loading" class="flex items-center justify-center py-20">
      <div class="text-on-surface-variant">加载中...</div>
    </div>

    <!-- Not Found -->
    <div v-else-if="!product" class="flex flex-col items-center justify-center py-20">
      <span class="material-symbols-outlined text-outline mb-4" style="font-size: 48px;">search_off</span>
      <p class="text-on-surface-variant">商品不存在</p>
      <button class="mt-4 text-primary-container font-medium" @click="router.push('/')">返回首页</button>
    </div>

    <template v-else>
      <!-- Top Bar -->
      <div class="sticky top-0 z-40 bg-background/95 backdrop-blur-md">
        <div class="flex items-center justify-between px-4 h-14 max-w-lg mx-auto">
          <button class="p-2 active:scale-95 transition-transform" @click="router.back()">
            <span class="material-symbols-outlined text-on-surface">arrow_back</span>
          </button>
          <span class="font-headline text-sm font-bold text-on-surface">商品介绍</span>
          <button class="p-2 active:scale-95 transition-transform relative" @click="router.push('/cart')">
            <span class="material-symbols-outlined text-on-surface">shopping_bag</span>
            <div class="absolute top-1 right-1 w-2 h-2 bg-error rounded-full"></div>
          </button>
        </div>
      </div>

      <!-- Product Image -->
      <div class="max-w-lg mx-auto">
        <div class="relative aspect-[4/3] w-full bg-surface-container overflow-hidden">
          <img :src="product.image_url" :alt="product.name" class="w-full h-full object-cover" />
        </div>
      </div>

      <!-- Product Info -->
      <div class="max-w-lg mx-auto px-4 py-4">
        <div class="flex items-baseline gap-2 mb-2">
          <span class="text-error text-sm font-bold">¥</span>
          <span class="font-headline text-3xl font-bold text-error">{{ currentPrice() }}</span>
          <span class="text-sm text-on-surface-variant ml-1">{{ selectedSpec?.name || '' }}</span>
        </div>
        <h1 class="font-headline text-xl font-bold text-on-surface mb-3">{{ product.name }}</h1>

        <!-- Feature Cards -->
        <div class="grid grid-cols-3 gap-2 mb-4">
          <div v-if="product.origin" class="bg-surface-container-low rounded-xl p-3 text-center">
            <span class="material-symbols-outlined text-primary text-[20px] mb-1">location_on</span>
            <p class="font-label text-[10px] text-outline mb-0.5">核心产区</p>
            <p class="font-body text-xs font-bold text-on-surface">{{ product.origin }}</p>
          </div>
          <div v-if="product.taste" class="bg-surface-container-low rounded-xl p-3 text-center">
            <span class="material-symbols-outlined text-primary text-[20px] mb-1">restaurant</span>
            <p class="font-label text-[10px] text-outline mb-0.5">极致口感</p>
            <p class="font-body text-xs font-bold text-on-surface">{{ product.taste }}</p>
          </div>
          <div class="bg-surface-container-low rounded-xl p-3 text-center">
            <span class="material-symbols-outlined text-primary text-[20px] mb-1">eco</span>
            <p class="font-label text-[10px] text-outline mb-0.5">产品特色</p>
            <p class="font-body text-xs font-bold text-on-surface">甜度爆表</p>
          </div>
        </div>

        <!-- Description -->
        <div v-if="product.description" class="mb-4">
          <h3 class="font-headline text-lg font-bold text-on-surface mb-2">产品故事</h3>
          <p class="text-sm text-on-surface-variant leading-relaxed">{{ product.description }}</p>
        </div>

        <!-- Category Tag -->
        <div class="flex flex-wrap gap-2 mb-4">
          <div class="flex items-center gap-1.5 bg-surface-container-high rounded-lg px-3 py-2">
            <span class="material-symbols-outlined text-primary-container" style="font-size: 16px;">sell</span>
            <span class="text-xs text-on-surface-variant">{{ product.category }}</span>
          </div>
        </div>

        <!-- Reviews -->
        <section class="mb-24">
          <h2 class="font-headline text-xl font-bold text-on-surface mb-1">口碑鉴赏</h2>
          <div class="flex items-center gap-2 mb-4">
            <div class="flex gap-0.5">
              <span v-for="i in 5" :key="i" class="material-symbols-outlined text-primary" style="font-size: 18px; font-variation-settings: 'FILL' 1;">star</span>
            </div>
            <span class="text-sm text-on-surface-variant">{{ product.rating || '5.0' }} / 5.0 · {{ product.review_count || 0 }}+ 条评价</span>
          </div>
          <div class="bg-surface-container-low rounded-xl p-4">
            <div class="flex items-center gap-3 mb-2">
              <div class="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center text-on-primary text-xs font-bold">薯</div>
              <span class="text-sm font-medium text-on-surface">薯友</span>
              <div class="flex gap-0.5 ml-auto">
                <span v-for="i in 5" :key="i" class="material-symbols-outlined text-primary" style="font-size: 14px; font-variation-settings: 'FILL' 1;">star</span>
              </div>
            </div>
            <p class="text-sm text-on-surface-variant">非常好吃，品质很好，新鲜直达！包装也非常用心，值得回购。</p>
          </div>
        </section>
      </div>

      <!-- Bottom Action Bar -->
      <div class="fixed bottom-0 left-0 w-full z-40 bg-surface-container-lowest/95 backdrop-blur-md border-t border-outline-variant/30 px-4 py-3 pb-safe">
        <div class="max-w-lg mx-auto flex gap-3">
          <button class="flex-1 py-3 rounded-xl border-2 border-primary text-primary font-bold active:scale-95 transition-transform" @click="handleAddToCart">
            加入购物车
          </button>
          <button class="flex-1 py-3 rounded-xl bg-primary text-on-primary font-bold shadow-[0_4px_20px_rgba(194,101,42,0.2)] active:scale-95 transition-transform" @click="drawerOpen = true">
            立即购买
          </button>
        </div>
      </div>

      <!-- Spec Drawer -->
      <Teleport to="body">
        <Transition name="drawer">
          <div v-if="drawerOpen" class="fixed inset-0 z-50 flex items-end justify-center" @click.self="drawerOpen = false">
            <div class="absolute inset-0 bg-black/40"></div>
            <div class="relative bg-surface-container-lowest rounded-t-2xl w-full max-w-lg p-6 pb-safe z-10">
              <!-- Close -->
              <button @click="drawerOpen = false" class="absolute top-4 right-4 text-on-surface-variant">
                <span class="material-symbols-outlined">close</span>
              </button>

              <!-- Product Summary -->
              <div class="flex gap-4 mb-6">
                <img :src="product.image_url" :alt="product.name" class="w-20 h-20 rounded-xl object-cover" />
                <div>
                  <p class="font-headline text-lg font-bold text-error">¥{{ currentPrice() }}</p>
                  <p class="text-sm text-on-surface-variant mt-1">已选：{{ selectedSpec?.name || '默认' }}</p>
                </div>
              </div>

              <!-- Spec Selector -->
              <div v-if="product.specs && product.specs.length > 0" class="mb-6">
                <p class="font-label text-sm text-on-surface-variant mb-3">规格</p>
                <div class="flex flex-wrap gap-2">
                  <button
                    v-for="spec in product.specs"
                    :key="spec.name"
                    @click="selectedSpec = spec"
                    class="px-4 py-2 rounded-lg text-sm font-medium transition-all border"
                    :class="selectedSpec?.name === spec.name
                      ? 'bg-primary text-on-primary border-primary'
                      : 'bg-surface-container-low text-on-surface-variant border-outline-variant'"
                  >
                    {{ spec.name }}
                  </button>
                </div>
              </div>

              <!-- Quantity -->
              <div class="mb-6">
                <p class="font-label text-sm text-on-surface-variant mb-3">数量</p>
                <div class="flex items-center gap-4">
                  <button @click="quantity > 1 && quantity--" class="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center border-none">
                    <span class="material-symbols-outlined text-on-surface">remove</span>
                  </button>
                  <span class="font-headline text-lg font-bold text-on-surface w-8 text-center">{{ quantity }}</span>
                  <button @click="quantity++" class="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center border-none">
                    <span class="material-symbols-outlined text-on-surface">add</span>
                  </button>
                </div>
              </div>

              <!-- Confirm -->
              <router-link to="/checkout" @click="handleBuyNow" class="block w-full py-4 rounded-xl bg-primary text-on-primary text-center font-bold text-lg shadow-[0_4px_20px_rgba(194,101,42,0.2)] active:scale-[0.98] transition-transform">
                前往确认
              </router-link>
            </div>
          </div>
        </Transition>
      </Teleport>
    </template>
  </div>
</template>

<style scoped>
.drawer-enter-active,
.drawer-leave-active {
  transition: all 0.3s ease;
}
.drawer-enter-active > div:last-child,
.drawer-leave-active > div:last-child {
  transition: transform 0.3s ease;
}
.drawer-enter-from > div:last-child,
.drawer-leave-to > div:last-child {
  transform: translateY(100%);
}
.drawer-enter-from > div:first-child,
.drawer-leave-to > div:first-child {
  opacity: 0;
}
</style>
