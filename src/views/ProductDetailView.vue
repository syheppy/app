<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { supabase } from '../utils/supabase'
import { useCart } from '../composables/useCart'
import { useToast } from '../composables/useToast'
import { staggerItems, imageFadeIn } from '../utils/animations'
import SkeletonLoader from '../components/common/SkeletonLoader.vue'

const route = useRoute()
const router = useRouter()
const { addItem, setBuyNowItem } = useCart()
const { show: showToast } = useToast()

const product = ref(null)
const loading = ref(true)
const selectedSpec = ref(null)
const drawerOpen = ref(false)
const isFavorited = ref(false)
const heroImage = ref(null)

const toggleFavorite = () => {
  if (!product.value) return
  const ids = JSON.parse(localStorage.getItem('favorites') || '[]')
  if (isFavorited.value) {
    localStorage.setItem('favorites', JSON.stringify(ids.filter(i => i !== product.value.id)))
    isFavorited.value = false
    showToast('已取消收藏')
  } else {
    ids.push(product.value.id)
    localStorage.setItem('favorites', JSON.stringify(ids))
    isFavorited.value = true
    showToast('已收藏')
  }
}

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
    if (data.specs && data.specs.length > 0) {
      selectedSpec.value = data.specs[0]
    }
    const favIds = JSON.parse(localStorage.getItem('favorites') || '[]')
    isFavorited.value = favIds.includes(data.id)
  } catch (err) {
    console.error('Failed to fetch product:', err)
  } finally {
    loading.value = false

    // 入场动画
    await nextTick()
    if (heroImage.value) {
      imageFadeIn(heroImage.value)
    }
    staggerItems('.detail-section', { duration: 0.5, stagger: 0.1 })
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
  setBuyNowItem({ ...product.value, price: currentPrice() })
  router.push('/checkout')
}
</script>

<template>
  <div class="font-body antialiased selection:bg-primary-container selection:text-on-primary-container min-h-screen" style="background-color: var(--color-background); color: var(--color-on-background);">
    <!-- Loading with Skeleton -->
    <Transition name="fade">
      <SkeletonLoader v-if="loading" type="product" />
    </Transition>

    <!-- Not Found -->
    <div v-if="!loading && !product" class="flex flex-col items-center justify-center py-20">
      <span class="material-symbols-outlined text-outline mb-4" style="font-size: 48px;">search_off</span>
      <p class="text-on-surface-variant">商品不存在</p>
      <button class="mt-4 text-primary-container font-medium" @click="router.push('/')">返回首页</button>
    </div>

    <!-- Content -->
    <div v-if="!loading && product" class="content-fade-in">
      <!-- TopAppBar -->
      <header class="flex items-center justify-between px-6 py-4 w-full h-16 bg-surface text-primary font-display text-2xl italic tracking-tight docked full-width top-0 z-50 border-b border-outline-variant/60 shadow-[0_2px_16px_rgba(58,48,42,0.04)] sticky">
        <button aria-label="Go back" class="p-2 -ml-2 rounded-full hover:bg-surface-variant transition-colors group" @click="router.back()">
          <span class="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors duration-300">arrow_back</span>
        </button>
        <span class="font-display text-2xl italic text-primary">商品介绍</span>
        <div class="flex items-center gap-1">
          <button class="p-2 rounded-full hover:bg-surface-variant transition-colors group" @click="toggleFavorite">
            <span class="material-symbols-outlined group-hover:text-primary transition-colors duration-300" :class="isFavorited ? 'text-error' : 'text-on-surface-variant'" :style="isFavorited ? 'font-variation-settings: FILL 1' : ''">favorite</span>
          </button>
          <button aria-label="Cart" class="p-2 -mr-2 rounded-full hover:bg-surface-variant transition-colors group relative" @click="router.push('/cart')">
            <span class="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors duration-300">shopping_bag</span>
            <span class="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full border border-surface"></span>
          </button>
        </div>
      </header>

      <main class="pb-32">
        <!-- Hero Section -->
        <div class="px-4 pt-6 pb-8 md:px-8 md:pt-10 max-w-5xl mx-auto detail-section">
          <div class="aspect-[4/3] md:aspect-[16/9] w-full rounded-2xl overflow-hidden shadow-[0_2px_24px_rgba(58,48,42,0.06)] bg-surface-container relative group">
            <img
              ref="heroImage"
              :alt="product.name"
              class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              :src="product.image_url"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-60"></div>
          </div>
        </div>

        <!-- Product Header Info -->
        <section class="px-6 md:px-12 max-w-4xl mx-auto mt-2 product-card">
          <div class="flex flex-col gap-4">
            <h1 class="font-display text-3xl md:text-5xl text-on-surface font-bold leading-tight tracking-tight">{{ product.name }}</h1>
            <div class="flex items-end justify-between border-b border-outline-variant/40 pb-6 mt-2">
              <div class="flex items-baseline gap-3">
                <span class="text-price-lg text-primary">¥</span>
                <span class="text-[40px] md:text-[48px] text-price-lg text-primary">{{ currentPrice() }}</span>
                <span v-if="selectedSpec" class="text-body-sm text-secondary bg-surface-container py-1.5 px-3 rounded-md border border-outline-variant/30">{{ selectedSpec.name }}</span>
              </div>
            </div>
          </div>
        </section>

        <!-- Key Details Grid -->
        <section class="px-6 md:px-12 max-w-4xl mx-auto mt-8 product-card">
          <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div v-if="product.origin" class="bg-surface-container-low p-6 rounded-xl border border-outline-variant/40 flex flex-col gap-2 shadow-[0_2px_12px_rgba(58,48,42,0.02)]">
              <div class="flex items-center gap-2 text-tertiary/80 mb-1">
                <span class="material-symbols-outlined text-lg">location_on</span>
                <span class="text-xs font-label uppercase tracking-widest">核心产区</span>
              </div>
              <span class="font-display text-xl text-on-surface">{{ product.origin }}</span>
            </div>

            <div v-if="product.taste" class="bg-surface-container-low p-6 rounded-xl border border-outline-variant/40 flex flex-col gap-2 shadow-[0_2px_12px_rgba(58,48,42,0.02)]">
              <div class="flex items-center gap-2 text-tertiary/80 mb-1">
                <span class="material-symbols-outlined text-lg">restaurant</span>
                <span class="text-xs font-label uppercase tracking-widest">极致口感</span>
              </div>
              <span class="font-display text-xl text-on-surface">{{ product.taste }}</span>
            </div>

            <div v-if="product.feature" class="col-span-2 md:col-span-1 bg-primary-fixed/30 p-6 rounded-xl border border-primary-fixed-dim/40 flex flex-col gap-2 shadow-[0_2px_12px_rgba(58,48,42,0.02)] justify-center">
              <div class="flex items-center gap-2 text-primary mb-1">
                <span class="material-symbols-outlined text-lg">local_fire_department</span>
                <span class="text-xs font-label uppercase tracking-widest text-primary">产品特色</span>
              </div>
              <span class="font-display text-lg text-on-primary-fixed font-medium">{{ product.feature }}</span>
            </div>
          </div>
        </section>

        <!-- Product Description -->
        <section v-if="product.description" class="px-6 md:px-12 max-w-3xl mx-auto mt-16 md:mt-24 product-card">
          <div class="text-center mb-10">
            <span class="text-xs text-secondary font-label uppercase tracking-widest block mb-2">The Origin</span>
            <h2 class="font-display text-3xl md:text-4xl text-on-surface italic">自然源味，静待成熟</h2>
            <div class="w-12 h-px bg-primary mx-auto mt-6"></div>
          </div>

          <div class="space-y-8 text-on-surface-variant leading-relaxed text-base md:text-lg font-light">
            <p>{{ product.description }}</p>
          </div>
        </section>

        <!-- Specs Section -->
        <section v-if="product.specs && product.specs.length > 0" class="px-6 md:px-12 max-w-4xl mx-auto mt-16 product-card">
          <h3 class="font-display text-2xl text-on-surface mb-4">规格选择</h3>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="spec in product.specs"
              :key="spec.name"
              @click="selectedSpec = spec"
              class="px-4 py-2 rounded-lg text-sm font-medium transition-all border"
              :class="selectedSpec?.name === spec.name
                ? 'bg-white border-primary'
                : 'bg-surface-container-low text-on-surface-variant border-outline-variant hover:border-primary/50'"
            >
              {{ spec.name }} - <span class="text-price-sm">¥{{ spec.price }}</span>
            </button>
          </div>
        </section>

        <!-- User Reviews Section -->
        <section class="px-6 md:px-12 max-w-4xl mx-auto mt-20 mb-10 product-card">
          <div class="bg-surface-container-low p-8 rounded-2xl flex flex-col md:flex-row items-center justify-between border border-outline-variant/30 gap-6 relative overflow-hidden">
            <div class="absolute top-0 right-0 w-64 h-64 bg-primary-fixed/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>

            <div class="relative z-10 text-center md:text-left">
              <h3 class="font-display text-2xl text-on-surface mb-1">口碑鉴赏</h3>
              <p class="text-sm text-secondary font-label tracking-wide">来自 {{ product.review_count || 0 }}+ 位品鉴者的真实评价</p>
            </div>

            <div class="relative z-10 flex flex-col items-center bg-surface px-8 py-4 rounded-xl shadow-[0_4px_16px_rgba(58,48,42,0.05)] border border-outline-variant/20">
              <div class="flex items-center gap-1 text-primary mb-1">
                <span v-for="i in 5" :key="i" class="material-symbols-outlined text-2xl" style="font-variation-settings: 'FILL' 1">star</span>
              </div>
              <div class="flex items-baseline gap-2">
                <span class="font-display text-4xl font-bold text-on-surface">{{ product.rating || '5.0' }}</span>
                <span class="text-xs text-secondary uppercase tracking-widest font-label">/ 5.0</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      <!-- Contextual Bottom Bar -->
      <div class="fixed bottom-0 left-0 w-full bg-surface/90 backdrop-blur-xl border-t border-outline-variant/40 px-6 py-4 pb-safe z-50 shadow-[0_-8px_32px_rgba(58,48,42,0.06)]">
        <div class="max-w-4xl mx-auto w-full flex items-center justify-center gap-4">
          <button class="flex-1 max-w-xs py-3.5 px-6 rounded-lg border border-primary text-primary font-label font-bold tracking-widest uppercase hover:bg-primary/5 transition-colors duration-300 flex justify-center items-center gap-2" @click="handleAddToCart">
            <span class="material-symbols-outlined text-lg">add_shopping_cart</span>
            加入购物车
          </button>
          <button class="flex-1 max-w-xs py-3.5 px-6 rounded-lg bg-primary text-on-primary font-label font-bold tracking-widest uppercase shadow-md hover:bg-primary/90 hover:shadow-lg transition-all duration-300 flex justify-center items-center gap-2" @click="drawerOpen = true">
            立即购买
            <span class="material-symbols-outlined text-lg">arrow_forward</span>
          </button>
        </div>
      </div>

      <!-- Spec Drawer -->
      <Teleport to="body">
        <Transition name="drawer">
          <div v-if="drawerOpen" class="fixed inset-0 z-50 flex items-end justify-center" @click.self="drawerOpen = false">
            <div class="absolute inset-0 bg-black/40"></div>
            <div class="relative bg-surface rounded-t-2xl w-full max-w-lg p-6 pb-safe z-10">
              <button @click="drawerOpen = false" class="absolute top-4 right-4 text-on-surface-variant">
                <span class="material-symbols-outlined">close</span>
              </button>

              <div class="flex gap-4 mb-6">
                <img :src="product.image_url" :alt="product.name" class="w-20 h-20 rounded-xl object-cover" />
                <div>
                  <p class="text-price-md text-primary">¥{{ currentPrice() }}</p>
                  <p class="text-sm text-on-surface-variant mt-1">已选：{{ selectedSpec?.name || '默认' }}</p>
                </div>
              </div>

              <div v-if="product.specs && product.specs.length > 0" class="mb-6">
                <p class="font-label text-sm text-on-surface-variant mb-3">规格</p>
                <div class="flex flex-wrap gap-2">
                  <button
                    v-for="spec in product.specs"
                    :key="spec.name"
                    @click="selectedSpec = spec"
                    class="px-4 py-2 rounded-lg text-sm font-medium transition-all border"
                    :class="selectedSpec?.name === spec.name
                      ? 'bg-white border-primary'
                      : 'bg-surface-container-low text-on-surface-variant border-outline-variant'"
                  >
                    {{ spec.name }} - <span class="text-price-sm">¥{{ spec.price }}</span>
                  </button>
                </div>
              </div>

              <button @click="handleBuyNow" class="block w-full py-4 rounded-xl bg-primary text-on-primary text-center font-bold text-lg shadow-md active:scale-[0.98] transition-transform">
                前往确认
              </button>
            </div>
          </div>
        </Transition>
      </Teleport>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.content-fade-in {
  animation: fadeIn 0.4s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

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
