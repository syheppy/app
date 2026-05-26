<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '../utils/supabase'
import { useCart } from '../composables/useCart'
import { useToast } from '../composables/useToast'

const router = useRouter()
const { addItem } = useCart()
const { show: showToast } = useToast()

const allProducts = ref([])
const categories = ref([])
const activeCategory = ref('')
const loading = ref(true)
const sortMode = ref('default')
const showSortMenu = ref(false)

const sortOptions = [
  { value: 'default', label: '综合排序' },
  { value: 'price_asc', label: '价格从低到高' },
  { value: 'price_desc', label: '价格从高到低' },
  { value: 'sales', label: '销量优先' }
]

const handleAddToCart = (product) => {
  addItem(product)
  showToast('已加入购物车')
}

onMounted(async () => {
  try {
    // Fetch categories
    const { data: catData } = await supabase
      .from('categories')
      .select('*')
      .order('sort_order')
    if (catData && catData.length > 0) {
      categories.value = catData
      activeCategory.value = catData[0].name
    }

    // Fetch products
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('status', true)

    if (error) throw error

    allProducts.value = data.map(p => ({
      ...p,
      image: p.image_url,
      image_url: p.image_url
    }))

    // Fallback categories from products if categories table is empty
    if (categories.value.length === 0) {
      const catSet = [...new Set(allProducts.value.map(p => p.category).filter(Boolean))]
      categories.value = catSet.map((name, i) => ({ id: String(i), name, icon_url: null }))
      if (catSet.length > 0) activeCategory.value = catSet[0]
    }
  } catch (err) {
    console.error('Failed to fetch data:', err)
  } finally {
    loading.value = false
  }
})

const currentCategory = computed(() =>
  categories.value.find(c => c.name === activeCategory.value)
)

const currentProducts = computed(() => {
  let list = allProducts.value.filter(p => p.category === activeCategory.value)
  switch (sortMode.value) {
    case 'price_asc':
      return [...list].sort((a, b) => a.price - b.price)
    case 'price_desc':
      return [...list].sort((a, b) => b.price - a.price)
    case 'sales':
      return [...list].sort((a, b) => (b.sales_count || 0) - (a.sales_count || 0))
    default:
      return list
  }
})
</script>

<template>
  <div class="bg-background text-on-background font-body antialiased selection:bg-primary-container selection:text-on-primary-container min-h-screen flex flex-col">
    <!-- Search Bar -->
    <div class="fixed top-0 left-0 w-full z-40 bg-surface px-4 py-3 border-b border-surface-variant shadow-sm shadow-[#c2652a]/5">
      <div class="relative w-full max-w-2xl mx-auto">
        <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]">search</span>
        <input @keyup.enter="$event.target.value.trim() && router.push(`/search?q=${$event.target.value.trim()}`)" class="w-full pl-10 pr-4 py-2.5 bg-surface-container-low border border-outline-variant rounded-full font-body text-sm text-on-surface placeholder-on-surface-variant focus:border-primary focus:ring-1 outline-none transition-colors" placeholder="搜索新鲜农品..." type="text" />
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex items-center justify-center py-20">
      <div class="text-on-surface-variant">加载中...</div>
    </div>

    <main v-else class="pt-[64px] pb-[80px] flex min-h-screen max-w-lg mx-auto w-full">
      <!-- Left Sidebar -->
      <aside class="w-[90px] flex-shrink-0 bg-surface-container-low border-r border-surface-variant sticky top-[64px] h-[calc(100vh-144px)] overflow-y-auto hide-scrollbar">
        <nav class="flex flex-col py-2">
          <button
            v-for="cat in categories"
            :key="cat.id || cat.name"
            @click="activeCategory = cat.name"
            class="relative w-full flex flex-col items-center justify-center transition-colors py-5 border-none cursor-pointer"
            :class="activeCategory === cat.name ? 'bg-surface text-primary font-bold' : 'text-on-surface-variant hover:bg-surface-container bg-transparent'"
          >
            <div v-if="activeCategory === cat.name" class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full"></div>
            <img v-if="cat.icon_url" class="object-contain mb-2 w-10 h-10" :src="cat.icon_url" :alt="cat.name" />
            <span v-else class="material-symbols-outlined mb-2 text-[24px]">category</span>
            <span class="font-body text-[13px] text-center">{{ cat.name }}</span>
          </button>
        </nav>
      </aside>

      <!-- Right Content -->
      <section class="flex-1 bg-background p-4 overflow-y-auto">
        <!-- Category Banner -->
        <div class="w-full h-24 rounded-xl mb-6 bg-surface-container-high overflow-hidden relative shadow-sm">
          <img v-if="currentCategory?.icon_url" class="w-full h-full object-cover opacity-80" :src="currentCategory.icon_url" />
          <div class="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex flex-col justify-center px-6">
            <h2 class="text-white font-headline text-lg font-bold tracking-wide">精选原产地{{ activeCategory }}</h2>
            <p class="text-white/90 font-body text-xs mt-1">大地馈赠，新鲜出土</p>
          </div>
        </div>

        <!-- Sort Bar -->
        <div class="flex items-center justify-between mb-4">
          <h3 class="font-headline text-lg font-bold text-on-background">全部{{ activeCategory }}</h3>
          <div class="relative">
            <button @click="showSortMenu = !showSortMenu" class="flex bg-transparent border-none items-center gap-1 text-outline font-label text-xs cursor-pointer">
              {{ sortOptions.find(o => o.value === sortMode)?.label || '综合排序' }} <span class="material-symbols-outlined text-[16px]">expand_more</span>
            </button>
            <div v-if="showSortMenu" class="absolute right-0 top-full mt-1 bg-surface-container-lowest rounded-xl shadow-lg border border-outline-variant/30 overflow-hidden z-30 min-w-[140px]">
              <button
                v-for="opt in sortOptions"
                :key="opt.value"
                @click="sortMode = opt.value; showSortMenu = false"
                class="w-full text-left px-4 py-2.5 font-body text-sm border-none cursor-pointer transition-colors"
                :class="sortMode === opt.value ? 'bg-primary/10 text-primary font-medium' : 'bg-transparent text-on-surface hover:bg-surface-container'"
              >
                {{ opt.label }}
              </button>
            </div>
          </div>
        </div>

        <!-- Product Grid -->
        <div class="grid grid-cols-2 gap-3">
          <router-link
            v-for="product in currentProducts"
            :key="product.id"
            :to="`/product/${product.id}`"
            class="bg-surface-container-lowest rounded-xl overflow-hidden shadow-[0_2px_12px_rgba(194,101,42,0.04)] border border-surface-variant flex flex-col active:scale-[0.98] transition-transform text-on-background cursor-pointer"
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
        <div v-if="currentProducts.length === 0" class="text-center py-12 text-on-surface-variant">
          暂无商品
        </div>
      </section>
    </main>
  </div>
</template>
