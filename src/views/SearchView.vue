<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { supabase } from '../utils/supabase'
import { useCart } from '../composables/useCart'
import { useToast } from '../composables/useToast'

const route = useRoute()
const router = useRouter()
const { addItem } = useCart()
const { show: showToast } = useToast()

const keyword = ref(route.query.q || '')
const results = ref([])
const loading = ref(false)
const searched = ref(false)

const handleAddToCart = (product) => {
  addItem(product)
  showToast('已加入购物车')
}

const doSearch = async () => {
  const q = keyword.value.trim()
  if (!q) return
  loading.value = true
  searched.value = true
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('status', true)
      .or(`name.ilike.%${q}%,description.ilike.%${q}%,category.ilike.%${q}%,taste.ilike.%${q}%,origin.ilike.%${q}%`)

    if (error) throw error
    results.value = data.map(p => ({ ...p, image: p.image_url }))
  } catch (err) {
    console.error('Search failed:', err)
    results.value = []
  } finally {
    loading.value = false
  }
}

const goBack = () => router.back()

onMounted(() => {
  if (keyword.value.trim()) doSearch()
})

watch(() => route.query.q, (newQ) => {
  if (newQ && newQ !== keyword.value) {
    keyword.value = newQ
    doSearch()
  }
})
</script>

<template>
  <div class="theme-bg theme-text font-body min-h-screen flex flex-col">
    <!-- Search Header -->
    <div class="fixed top-0 left-0 w-full z-40 theme-card px-4 py-3 border-b shadow-sm" style="border-color: var(--theme-card-border);">
      <div class="flex items-center gap-3 max-w-lg mx-auto">
        <button @click="goBack" class="w-8 h-8 flex items-center justify-center text-on-surface bg-transparent border-none cursor-pointer">
          <span class="material-symbols-outlined">arrow_back</span>
        </button>
        <div class="flex-1 relative">
          <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]">search</span>
          <input
            v-model="keyword"
            @keyup.enter="doSearch"
            class="w-full pl-10 pr-4 py-2.5 bg-surface-container-low border border-outline-variant rounded-full font-body text-sm text-on-surface placeholder-on-surface-variant focus:border-primary focus:ring-1 outline-none transition-colors"
            placeholder="搜索新鲜农品..."
            type="text"
            autofocus
          />
        </div>
        <button @click="doSearch" class="text-primary font-label text-sm font-medium bg-transparent border-none cursor-pointer whitespace-nowrap">搜索</button>
      </div>
    </div>

    <main class="pt-[64px] pb-6 flex-1 max-w-lg mx-auto w-full px-4">
      <!-- Loading -->
      <div v-if="loading" class="flex items-center justify-center py-20">
        <div class="text-on-surface-variant">搜索中...</div>
      </div>

      <!-- Results -->
      <template v-else-if="searched">
        <div class="py-3 font-label text-sm text-on-surface-variant">
          找到 <span class="text-on-surface font-bold">{{ results.length }}</span> 个商品
        </div>

        <div v-if="results.length > 0" class="grid grid-cols-2 gap-3">
          <router-link
            v-for="product in results"
            :key="product.id"
            :to="`/product/${product.id}`"
            class="theme-card rounded-xl overflow-hidden shadow-[0_2px_12px_rgba(194,101,42,0.04)] border border-surface-variant flex flex-col active:scale-[0.98] transition-transform theme-text cursor-pointer"
          >
            <div class="relative aspect-square w-full bg-surface-container">
              <img class="w-full h-full object-cover" :src="product.image_url" :alt="product.name" />
              <div class="absolute top-2 left-2 bg-secondary-container text-on-secondary-container font-label text-[10px] px-1.5 py-0.5 rounded">{{ product.taste || product.category }}</div>
            </div>
            <div class="p-3 flex flex-col flex-1">
              <h4 class="font-headline font-bold text-[14px] text-on-surface line-clamp-2 leading-tight mb-1">{{ product.name }}</h4>
              <div class="flex items-center gap-1 mb-2 mt-auto">
                <span class="px-1 py-[2px] bg-surface-container-low text-outline font-label text-[10px] rounded border border-outline-variant/50 line-clamp-1">{{ product.origin || '产地直供' }}</span>
              </div>
              <div class="flex items-center justify-between">
                <div class="flex items-baseline text-primary">
                  <span class="text-[12px] font-bold">¥</span>
                  <span class="font-headline font-bold text-[16px]">{{ product.price }}</span>
                </div>
                <button @click.prevent="handleAddToCart(product)" class="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white border-none shadow-sm shadow-primary/30 cursor-pointer">
                  <span class="material-symbols-outlined text-[14px] font-bold">add</span>
                </button>
              </div>
            </div>
          </router-link>
        </div>

        <!-- Empty State -->
        <div v-else class="flex flex-col items-center justify-center py-20 text-on-surface-variant">
          <span class="material-symbols-outlined text-[48px] mb-4 text-outline">search_off</span>
          <p class="font-body text-sm">没有找到相关商品</p>
          <p class="font-body text-xs mt-1 text-outline">试试其他关键词</p>
        </div>
      </template>

      <!-- Initial State -->
      <div v-else class="flex flex-col items-center justify-center py-20 text-on-surface-variant">
        <span class="material-symbols-outlined text-[48px] mb-4 text-outline">search</span>
        <p class="font-body text-sm">输入关键词搜索商品</p>
      </div>
    </main>
  </div>
</template>
