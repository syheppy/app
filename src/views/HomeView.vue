<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '../utils/supabase'
import { useCart } from '../composables/useCart'
import { useToast } from '../composables/useToast'

const router = useRouter()
const { addItem } = useCart()
const { show: showToast } = useToast()

const hotProducts = ref([])
const recommendProducts = ref([])
const loading = ref(true)

const handleAddToCart = (product) => {
  addItem(product)
  showToast('已加入购物车')
}

onMounted(async () => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('status', true)

    if (error) throw error

    const mapped = data.map(p => ({
      ...p,
      image: p.image_url,
      image_url: p.image_url
    }))

    hotProducts.value = mapped.filter(p => p.is_hot).slice(0, 4)
    if (hotProducts.value.length === 0) hotProducts.value = mapped.slice(0, 4)
    recommendProducts.value = mapped.filter(p => p.is_recommended).slice(0, 6)
    if (recommendProducts.value.length === 0) recommendProducts.value = mapped.slice(4, 10)
  } catch (err) {
    console.error('Failed to fetch products:', err)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="bg-background text-on-background font-body min-h-screen flex flex-col pb-20 md:pb-0">
    <!-- Top Bar -->
    <div class="fixed top-0 left-0 w-full z-50 bg-background/95 backdrop-blur-md px-4 py-3 md:hidden flex items-center gap-4">
      <div class="flex items-center gap-1 text-primary-container font-label text-sm whitespace-nowrap active:opacity-70 transition-opacity cursor-pointer">
        <span class="material-symbols-outlined text-[18px]">location_on</span>
        <span>北京市</span>
      </div>
      <div class="flex-1 relative border-none">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <span class="material-symbols-outlined text-outline text-[20px]">search</span>
        </div>
        <input @keyup.enter="$event.target.value.trim() && router.push(`/search?q=${$event.target.value.trim()}`)" class="w-full bg-surface-container rounded-lg py-2 pl-10 pr-4 text-sm font-body text-on-surface placeholder:text-outline border-none focus:ring-2 focus:ring-primary-container transition-all outline-none" placeholder="搜索新鲜红薯、紫薯..." type="text" />
      </div>
    </div>

    <main class="flex-1 max-w-lg mx-auto w-full pt-16 flex flex-col gap-6 overflow-x-hidden">
      <!-- Hero Banner -->
      <section class="px-4 relative group overflow-hidden">
        <div class="flex overflow-x-auto snap-x snap-mandatory rounded-2xl" style="scrollbar-width: none;">
          <div class="flex-none w-full snap-center relative h-[200px] overflow-hidden">
            <img alt="Hero Banner" class="absolute inset-0 w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida/ADBb0ugom4b42mVeWgxkrN4CP7T8-AQdnScXdtRZZ1bqzk5KuNFnyj_oz4l5kG20JMMZeAwO9DRhsBe3K3kEslrQPh27zUsnZ72K2ebSJcCtHNZr0rm1eoQYmXMmffoD7GnpqK5OkQIr77h_jAKcf_2SzblJYZe7l0LSELmkqzvZjXJgTGS8oKNp2-L1CIAxXZqdnQzwim4i2SGslgI7htmlzQTvOV-bWp4h3G1RaJn73hIH8qiZfhZwU_0eUTTPffkSJt2SmSUCIiTym3c" />
            <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end p-6">
              <span class="inline-block bg-primary-container text-on-primary font-label text-[10px] px-2 py-1 rounded w-max mb-2">新季丰收</span>
              <h2 class="font-display text-2xl text-white mb-1 font-bold">大地甄选 直送到家</h2>
              <p class="font-body text-sm text-surface-container-low opacity-90">从田间直达餐桌，锁住每一份自然的甜蜜</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Trust Badges -->
      <section class="px-4 grid grid-cols-4 gap-4 pb-2">
        <div v-for="item in [
          { icon: 'agriculture', label: '产地直发', color: 'text-primary-container' },
          { icon: 'eco', label: '有机认证', color: 'text-secondary' },
          { icon: 'verified', label: '品质严选', color: 'text-tertiary' },
          { icon: 'local_shipping', label: '极速冷链', color: 'text-primary-container' }
        ]" :key="item.label" class="flex flex-col items-center gap-2">
          <div class="w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center" :class="item.color">
            <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">{{ item.icon }}</span>
          </div>
          <span class="font-label text-xs text-on-surface-variant font-medium">{{ item.label }}</span>
        </div>
      </section>

      <!-- Loading -->
      <div v-if="loading" class="flex items-center justify-center py-20">
        <div class="text-on-surface-variant">加载中...</div>
      </div>

      <template v-else>
        <!-- Hot Sales -->
        <section v-if="hotProducts.length > 0" class="px-4 flex flex-col gap-4">
          <div class="flex items-center justify-between">
            <h3 class="font-headline text-xl font-bold text-on-background flex items-center gap-2">
              <span class="material-symbols-outlined text-error" style="font-variation-settings: 'FILL' 1;">local_fire_department</span>
              热销爆款
            </h3>
            <router-link to="/category" class="font-label text-xs text-primary-container flex items-center font-medium">
              查看全部 <span class="material-symbols-outlined text-[16px]">chevron_right</span>
            </router-link>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <!-- TOP 1 Large Card -->
            <router-link v-if="hotProducts[0]" :to="`/product/${hotProducts[0].id}`" class="col-span-2 relative rounded-2xl overflow-hidden bg-surface shadow-[0_4px_20px_rgba(242,140,40,0.05)] border border-surface-variant group cursor-pointer">
              <div class="absolute top-3 left-3 z-10 bg-error text-on-error font-label text-[10px] px-2 py-0.5 rounded-full font-bold tracking-wider">TOP 1</div>
              <div class="block w-full h-[200px]">
                <img :alt="hotProducts[0].name" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" :src="hotProducts[0].image_url" />
              </div>
              <div class="p-4 bg-surface relative z-20">
                <h4 class="font-headline text-lg font-bold text-on-surface mb-1">{{ hotProducts[0].name }}</h4>
                <p class="font-body text-sm text-on-surface-variant line-clamp-1 mb-2">{{ hotProducts[0].description }}</p>
                <div class="flex items-center justify-between mt-1">
                  <div class="flex items-baseline gap-1">
                    <span class="text-error font-bold text-sm">¥</span>
                    <span class="font-headline text-2xl font-bold text-error">{{ hotProducts[0].price }}</span>
                    <span v-if="hotProducts[0].original_price" class="text-outline text-xs line-through ml-1">¥{{ hotProducts[0].original_price }}</span>
                  </div>
                  <button @click.prevent="handleAddToCart(hotProducts[0])" class="w-8 h-8 rounded-full bg-primary-container text-on-primary flex items-center justify-center shadow-md active:scale-95 transition-transform border-none">
                    <span class="material-symbols-outlined text-[18px]">add</span>
                  </button>
                </div>
              </div>
            </router-link>

            <!-- Smaller Cards -->
            <router-link v-for="product in hotProducts.slice(1, 3)" :key="product.id" :to="`/product/${product.id}`" class="rounded-2xl overflow-hidden bg-surface shadow-[0_4px_20px_rgba(242,140,40,0.05)] border border-surface-variant flex flex-col group cursor-pointer">
              <img :alt="product.name" class="w-full h-[120px] object-cover transition-transform duration-500 group-hover:scale-105" :src="product.image_url" />
              <div class="p-3 flex flex-col flex-1 justify-between">
                <div>
                  <h4 class="font-body text-sm font-bold text-on-surface line-clamp-1 mb-1">{{ product.name }}</h4>
                  <div class="flex gap-1 mb-2">
                    <span class="bg-secondary-container text-on-secondary-container text-[10px] px-1.5 rounded font-medium">{{ product.taste || product.category }}</span>
                  </div>
                </div>
                <div class="flex items-center justify-between">
                  <div class="font-headline text-lg font-bold text-error">¥{{ product.price }}</div>
                  <button @click.prevent="handleAddToCart(product)" class="w-6 h-6 rounded-full bg-surface-container-highest text-on-surface flex items-center justify-center active:scale-95 transition-transform border-none">
                    <span class="material-symbols-outlined text-[14px]">add</span>
                  </button>
                </div>
              </div>
            </router-link>
          </div>
        </section>

        <!-- Recommendations -->
        <section v-if="recommendProducts.length > 0" class="px-4 flex flex-col gap-4 mt-2">
          <div class="flex items-center justify-between">
            <h3 class="font-headline text-xl font-bold text-on-background flex items-center gap-2">
              <span class="material-symbols-outlined text-primary-container" style="font-variation-settings: 'FILL' 1;">recommend</span>
              为您推荐
            </h3>
          </div>
          <div class="grid grid-cols-2 gap-4 pb-6">
            <router-link v-for="product in recommendProducts" :key="product.id" :to="`/product/${product.id}`" class="rounded-2xl overflow-hidden bg-surface shadow-[0_4px_20px_rgba(242,140,40,0.05)] border border-surface-variant flex flex-col group cursor-pointer">
              <img :src="product.image_url" :alt="product.name" class="w-full h-[120px] object-cover transition-transform duration-500 group-hover:scale-105" />
              <div class="p-3">
                <h4 class="font-body text-sm font-bold text-on-surface line-clamp-1 mb-1">{{ product.name }}</h4>
                <div class="flex gap-1 mb-2">
                  <span class="bg-secondary-container text-on-secondary-container text-[10px] px-1.5 rounded">{{ product.taste || '新鲜直供' }}</span>
                </div>
                <div class="flex justify-between items-center">
                  <div class="font-headline text-lg text-error font-bold">¥{{ product.price }}</div>
                  <button @click.prevent="handleAddToCart(product)" class="w-6 h-6 rounded-full bg-surface-container border-none flex items-center justify-center">
                    <span class="material-symbols-outlined text-[14px]">add</span>
                  </button>
                </div>
              </div>
            </router-link>
          </div>
        </section>
      </template>
    </main>
  </div>
</template>
