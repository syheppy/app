<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCart } from '../composables/useCart'
import { useToast } from '../composables/useToast'
import { supabase } from '../utils/supabase'

const router = useRouter()
const { addItem } = useCart()
const { show: showToast } = useToast()

const favorites = ref([])
const loading = ref(true)

const loadFavorites = async () => {
  try {
    const ids = JSON.parse(localStorage.getItem('favorites') || '[]')
    if (ids.length === 0) { favorites.value = []; return }
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .in('id', ids)
      .eq('status', true)
    if (error) throw error
    favorites.value = (data || []).map(p => ({ ...p, image: p.image_url }))
  } catch (err) {
    console.error('Failed to load favorites:', err)
  } finally {
    loading.value = false
  }
}

const removeFavorite = (id) => {
  const ids = JSON.parse(localStorage.getItem('favorites') || '[]')
  localStorage.setItem('favorites', JSON.stringify(ids.filter(i => i !== id)))
  favorites.value = favorites.value.filter(p => p.id !== id)
  showToast('已取消收藏')
}

const handleAddToCart = (product) => {
  addItem(product)
  showToast('已加入购物车')
}

onMounted(loadFavorites)
</script>

<template>
  <div class="min-h-screen bg-background text-on-surface">
    <div class="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-outline-variant/30">
      <div class="flex items-center justify-between px-4 h-14 max-w-lg mx-auto">
        <button class="p-2" @click="router.back()"><span class="material-symbols-outlined">arrow_back</span></button>
        <h1 class="font-headline text-base font-bold">我的收藏</h1>
        <div class="w-10"></div>
      </div>
    </div>

    <main class="max-w-lg mx-auto px-4 py-4 pb-8">
      <div v-if="loading" class="flex items-center justify-center py-20"><div class="text-on-surface-variant">加载中...</div></div>

      <div v-else-if="favorites.length === 0" class="flex flex-col items-center justify-center pt-24">
        <span class="material-symbols-outlined text-outline text-[48px] mb-4">favorite_border</span>
        <p class="text-on-surface-variant text-sm">还没有收藏商品</p>
        <button class="mt-4 px-6 py-2 rounded-xl bg-primary text-on-primary font-label text-sm border-none" @click="router.push('/category')">去逛逛</button>
      </div>

      <div v-else class="flex flex-col gap-3">
        <div v-for="product in favorites" :key="product.id" class="flex gap-3 bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-3">
          <router-link :to="`/product/${product.id}`" class="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
            <img :src="product.image_url" :alt="product.name" class="w-full h-full object-cover" />
          </router-link>
          <div class="flex-1 flex flex-col justify-between min-w-0">
            <router-link :to="`/product/${product.id}`" class="font-body text-sm text-on-surface line-clamp-2 no-underline">{{ product.name }}</router-link>
            <div class="flex items-center justify-between mt-1">
              <span class="text-primary font-headline font-bold">¥{{ product.price }}</span>
              <div class="flex gap-2">
                <button @click="removeFavorite(product.id)" class="w-6 h-6 rounded-full bg-surface-container-high flex items-center justify-center border-none">
                  <span class="material-symbols-outlined text-error text-[16px]" style="font-variation-settings: 'FILL' 1">favorite</span>
                </button>
                <button @click="handleAddToCart(product)" class="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white border-none">
                  <span class="material-symbols-outlined text-[14px] font-bold">add</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
