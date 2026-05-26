<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCart } from '../composables/useCart'
import { useToast } from '../composables/useToast'
import { supabase } from '../utils/supabase'

const router = useRouter()
const { addItem } = useCart()
const { show: showToast } = useToast()

const products = ref([])
const loading = ref(true)

const loadFavorites = async () => {
  try {
    const ids = JSON.parse(localStorage.getItem('favorites') || '[]')
    if (ids.length === 0) { products.value = []; return }
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .in('id', ids)
      .eq('status', true)
    if (error) throw error
    products.value = (data || []).map((p, i) => ({
      ...p,
      image_url: p.image_url,
      isFavorite: true,
      isPrimaryAction: i === 0
    }))
  } catch (err) {
    console.error('Failed to load favorites:', err)
  } finally {
    loading.value = false
  }
}

const toggleFavorite = (product) => {
  product.isFavorite = !product.isFavorite
  const ids = JSON.parse(localStorage.getItem('favorites') || '[]')
  if (product.isFavorite) {
    ids.push(product.id)
  } else {
    const idx = ids.indexOf(product.id)
    if (idx > -1) ids.splice(idx, 1)
  }
  localStorage.setItem('favorites', JSON.stringify(ids))
  if (!product.isFavorite) {
    products.value = products.value.filter(p => p.isFavorite)
    showToast('已取消收藏')
  }
}

const handleAddToCart = (product) => {
  addItem(product)
  showToast('已加入购物车')
}

onMounted(loadFavorites)
</script>

<template>
  <div class="min-h-screen font-body relative pb-24" style="background: #FDF5ED;">
    <!-- Header -->
    <div class="sticky top-0 z-40 bg-surface/80 backdrop-blur-md border-b border-outline-variant/20">
      <div class="flex items-center justify-between px-4 h-14 max-w-lg mx-auto">
        <button class="p-2" @click="router.back()">
          <span class="material-symbols-outlined text-on-surface">arrow_back</span>
        </button>
        <h1 class="font-headline text-lg font-bold text-on-surface">我的收藏</h1>
        <button class="p-2" @click="router.push('/cart')">
          <span class="material-symbols-outlined text-on-surface">shopping_basket</span>
        </button>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex items-center justify-center py-20">
      <div class="text-on-surface-variant">加载中...</div>
    </div>

    <main v-else class="px-4 py-6 max-w-lg mx-auto">
      <!-- Title -->
      <div class="mb-6 flex justify-between items-end">
        <div>
          <p class="text-on-surface-variant font-medium text-sm">{{ products.length }} 个商品</p>
          <h2 class="font-headline text-2xl text-on-surface mt-1 font-bold">您喜爱的地道风味</h2>
        </div>
        <button class="flex items-center text-sm font-medium text-primary bg-transparent border-none cursor-pointer">
          <span class="material-symbols-outlined mr-1 text-lg">filter_list</span>
          <span>筛选</span>
        </button>
      </div>

      <!-- Empty -->
      <div v-if="products.length === 0" class="flex flex-col items-center justify-center pt-24">
        <span class="material-symbols-outlined text-outline text-[48px] mb-4">favorite_border</span>
        <p class="text-on-surface-variant text-sm">还没有收藏商品</p>
        <button class="mt-4 px-6 py-2 rounded-xl bg-primary text-on-primary font-label text-sm border-none cursor-pointer" @click="router.push('/category')">去逛逛</button>
      </div>

      <!-- Grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-5">
        <article v-for="product in products" :key="product.id" class="bg-surface-container-low rounded-2xl overflow-hidden shadow-sm border border-outline-variant/40 flex flex-col">
          <div class="relative aspect-square overflow-hidden bg-surface-container">
            <img :src="product.image_url" :alt="product.name" class="w-full h-full object-cover" />
            <button @click="toggleFavorite(product)" class="absolute top-3 right-3 p-2 bg-surface/80 backdrop-blur-md rounded-full shadow-sm cursor-pointer border-none" :class="product.isFavorite ? 'text-tertiary' : 'text-on-surface-variant'">
              <span class="material-symbols-outlined text-xl" :class="{ 'fill': product.isFavorite }">favorite</span>
            </button>
            <div class="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/40 to-transparent pointer-events-none"></div>
          </div>
          <div class="p-4 flex flex-col flex-1">
            <div class="flex justify-between items-start mb-2">
              <h3 class="font-headline text-lg text-on-surface font-bold">{{ product.name }}</h3>
              <span class="font-body text-base font-bold text-primary shrink-0 ml-2">¥{{ product.price }}</span>
            </div>
            <p class="text-on-surface-variant text-xs line-clamp-2 mb-4">{{ product.description }}</p>
            <div class="mt-auto">
              <button v-if="product.isPrimaryAction" class="w-full bg-primary text-on-primary font-medium py-2.5 rounded-xl cursor-pointer border-none active:scale-[0.98] transition-transform flex items-center justify-center text-sm">
                <span class="material-symbols-outlined mr-1 text-lg">add_shopping_cart</span>
                加入购物车
              </button>
              <button v-else class="w-full border-2 border-primary text-primary font-medium py-2.5 rounded-xl cursor-pointer bg-transparent active:scale-[0.98] transition-transform flex items-center justify-center text-sm">
                <span class="material-symbols-outlined mr-1 text-lg">add_shopping_cart</span>
                加入购物车
              </button>
            </div>
          </div>
        </article>
      </div>
    </main>
  </div>
</template>
