<script setup>
import { ref } from 'vue'

const product = {
  name: '烟薯25号 - 蜜薯篇的"扛把子"',
  price: '39.90',
  unit: '5KG/箱',
  origin: '山东烟台',
  features: ['流蜜软糯', '蜜薯爆衣，皮焦蜜透'],
  images: [
    'https://lh3.googleusercontent.com/aida/ADBb0uiSU54_g3nmA8rJT-tXJpsN0WgzHOkS5cHyxyj1qSH-2i7pDm2oRxLrhtnA9J8gD0p6K8axFH-dzIVy2Qyj6bBSdsYqlAtCH_hVccROJWcD5XVwMFDU5UG6-Bwck8dvQPSS1l2AEZNzStQBeZqphuQ-KBjXGyIPj3aQdPBtAFe7ny95_h2wV9cnOn9xSTQV5kNSafz3f1uGOjxtKRCFB0trQJnNOE8mqozujZTrCOZvQ3TKKfmenGn8sNAL',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAQ0uF_3QAWFwCRB3gi8j47ivRDfQV_N_KFIi0dlbumTNE68Mk9i8s-ezPMuIsy4qmG-qhTp-p2y13e7W4_Hj6Kdz4lGxTPkgwthiKlEjO4u7ObCTOG2nASTL-yQ85OWoshDHxwfy1dEIMLy1bESHYqZkRx-y-TAipwLyqF4Rwl3hKWHEjio4CHoqrfzk7n6S67xaUJ-Pj-BP_wC5cUYCki-aVXIB9oVlk-C0YogOeIoxsMwLSX_ZgtndtVImEfMPIHjD9ZD3UyzMk8'
  ],
  rating: 4.9,
  reviewCount: 2400
}

const specs = [
  { label: '3KG/箱', value: '3kg' },
  { label: '5KG/箱', value: '5kg' }
]
const selectedSpec = ref('5kg')
const quantity = ref(1)
const currentImageIndex = ref(0)
const showSpecSheet = ref(false)

const reviews = [
  { name: '用户A', rating: 5, content: '非常好吃，蜜汁很多！', date: '2024-10-15' },
  { name: '用户B', rating: 5, content: '品质很好，包装也不错', date: '2024-10-12' }
]
</script>

<template>
  <div class="min-h-screen bg-background text-on-surface pb-20">
    <!-- Top Bar -->
    <div class="sticky top-0 z-40 bg-background/95 backdrop-blur-md">
      <div class="flex items-center justify-between px-4 h-14">
        <button class="p-2 active:scale-95 transition-transform">
          <span class="material-symbols-outlined text-on-surface">arrow_back</span>
        </button>
        <span class="text-sm font-medium text-on-surface">Sahara</span>
        <div class="flex items-center gap-2">
          <button class="p-2 active:scale-95 transition-transform">
            <span class="material-symbols-outlined text-on-surface" style="font-size: 22px;">share</span>
          </button>
          <button class="p-2 active:scale-95 transition-transform relative">
            <span class="material-symbols-outlined text-on-surface" style="font-size: 22px;">shopping_cart</span>
            <div class="absolute top-1 right-1 w-2 h-2 bg-error rounded-full"></div>
          </button>
        </div>
      </div>
    </div>

    <!-- Image Carousel -->
    <div class="relative">
      <div class="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar">
        <div
          v-for="(img, index) in product.images"
          :key="index"
          class="flex-none w-full snap-center"
        >
          <img :src="img" :alt="product.name" class="w-full h-[300px] object-cover" />
        </div>
      </div>
      <div class="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
        <div
          v-for="(_, index) in product.images"
          :key="index"
          class="w-1.5 h-1.5 rounded-full transition-all"
          :class="currentImageIndex === index ? 'w-4 bg-white' : 'bg-white/50'"
        />
      </div>
    </div>

    <!-- Product Info -->
    <div class="px-5 py-4">
      <h1 class="font-display text-2xl font-bold text-on-background mb-2">{{ product.name }}</h1>
      <div class="flex items-baseline gap-2 mb-4">
        <span class="text-error text-sm font-bold">¥</span>
        <span class="font-display text-3xl font-bold text-error">{{ product.price }}</span>
        <span class="text-outline text-sm">SAC / {{ product.unit }}</span>
      </div>

      <!-- Tags -->
      <div class="flex flex-wrap gap-2 mb-4">
        <div class="flex items-center gap-1.5 bg-surface-container-high rounded-lg px-3 py-2">
          <span class="material-symbols-outlined text-primary-container" style="font-size: 16px;">location_on</span>
          <span class="text-xs text-on-surface-variant">{{ product.origin }}</span>
        </div>
        <div class="flex items-center gap-1.5 bg-surface-container-high rounded-lg px-3 py-2">
          <span class="material-symbols-outlined text-primary-container" style="font-size: 16px;">local_fire_department</span>
          <span class="text-xs text-on-surface-variant">{{ product.features[0] }}</span>
        </div>
      </div>

      <!-- Product Features -->
      <div class="bg-surface-container-low rounded-xl p-4 mb-6">
        <div class="flex items-center gap-2 mb-2">
          <span class="material-symbols-outlined text-primary-container" style="font-size: 18px;">sell</span>
          <span class="text-sm font-medium text-on-surface">产品特点</span>
        </div>
        <p class="text-sm text-on-surface-variant">{{ product.features[1] }}</p>
      </div>
    </div>

    <!-- Origin Story -->
    <section class="px-5 mb-6">
      <p class="text-xs text-on-surface-variant tracking-widest uppercase mb-2">THE ORIGIN</p>
      <h2 class="font-display text-xl font-bold text-on-background mb-3">自然源味，静待成熟</h2>
      <p class="text-sm text-on-surface-variant leading-relaxed mb-4">
        生于北纬37°的黄金种植带，山东烟台的沙质土壤赋予了烟薯25号独特的糖分沉积。我们坚持自然熟成，拒绝催熟，让每一颗薯都在阳光下缓慢积累甜蜜。
      </p>
      <div class="rounded-2xl overflow-hidden h-40">
        <img
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBulzCTbA-MIR6eQbf4DpQHLzJNb2HbGtWLsuDzB_QH0eUPM4bXAmGbZsIfGRxgg-XwNU3kh7bjgqbHGk4vPUha1kpfTRdUk9aErCtoiuex3Mv_EvcCSTM-pKt_k5pXtts3CszmwzXWGMaot8adLqXWEiXgNtDiF7JtlHNlyfpKJdtIwBKpwZqmFNnUhWsh-EgrU025ET_XqpzmFJSZKehHU60_hv1ZOFeDVmtvm3IX2f5Pnk4O0Jl3erj-IZKjlituOvH2SKLAWUez"
          alt="产地故事"
          class="w-full h-full object-cover"
        />
      </div>
      <p class="text-sm text-on-surface-variant leading-relaxed mt-4">
        不论是蒸烤后的蜜汁四溢，还是煮粥时的绵软香甜，每一口都是大自然最真诚的馈赠。这不仅是味蕾的享受，更是对健康生活的追求。
      </p>
    </section>

    <!-- Reviews -->
    <section class="px-5 mb-6">
      <h2 class="font-display text-xl font-bold text-on-background mb-1">口碑鉴赏</h2>
      <p class="text-xs text-on-surface-variant mb-4">来自 2,400+ 位薯客的真实评价</p>
      <div class="flex items-center gap-3 mb-4">
        <span class="font-display text-4xl font-bold text-on-background">{{ product.rating }}</span>
        <div class="flex flex-col">
          <div class="flex gap-0.5">
            <span v-for="i in 5" :key="i" class="text-primary-container text-lg">★</span>
          </div>
          <span class="text-xs text-on-surface-variant">{{ product.reviewCount }} 条评价</span>
        </div>
      </div>

      <div class="flex flex-col gap-3">
        <div
          v-for="(review, index) in reviews"
          :key="index"
          class="bg-surface-container-low rounded-xl p-4"
        >
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm font-medium text-on-surface">{{ review.name }}</span>
            <span class="text-xs text-outline">{{ review.date }}</span>
          </div>
          <div class="flex gap-0.5 mb-2">
            <span v-for="i in review.rating" :key="i" class="text-primary-container text-sm">★</span>
          </div>
          <p class="text-sm text-on-surface-variant">{{ review.content }}</p>
        </div>
      </div>
    </section>

    <!-- Bottom Action Bar -->
    <div class="fixed bottom-0 left-0 w-full z-40 bg-surface-container-lowest border-t border-outline-variant/30 px-5 py-3 pb-safe">
      <div class="flex gap-3">
        <button class="flex-1 py-3 rounded-full border-2 border-primary-container text-primary-container font-medium active:scale-95 transition-transform">
          加入购物车
        </button>
        <button
          class="flex-1 py-3 rounded-full bg-primary-container text-white font-medium active:scale-95 transition-transform"
          @click="showSpecSheet = true"
        >
          立即购买
        </button>
      </div>
    </div>

    <!-- Spec Selection Bottom Sheet -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="showSpecSheet" class="fixed inset-0 z-50 flex items-end">
          <div class="absolute inset-0 bg-black/40" @click="showSpecSheet = false" />
          <div class="relative w-full bg-surface-container-lowest rounded-t-3xl px-5 pt-5 pb-safe animate-slide-up">
            <!-- Close -->
            <button
              class="absolute top-4 right-4 w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center"
              @click="showSpecSheet = false"
            >
              <span class="material-symbols-outlined text-on-surface-variant" style="font-size: 18px;">close</span>
            </button>

            <!-- Product Summary -->
            <div class="flex gap-4 mb-5">
              <img :src="product.images[0]" class="w-24 h-24 rounded-xl object-cover" />
              <div>
                <div class="flex items-baseline gap-1 mb-1">
                  <span class="text-error text-sm font-bold">¥</span>
                  <span class="font-display text-2xl font-bold text-error">{{ product.price }}</span>
                </div>
                <p class="text-sm text-on-surface-variant">库存充足</p>
                <p class="text-xs text-outline mt-1">已选: {{ specs.find(s => s.value === selectedSpec)?.label }}</p>
              </div>
            </div>

            <!-- Specs -->
            <div class="mb-5">
              <h4 class="text-sm font-medium text-on-surface mb-3">规格</h4>
              <div class="flex gap-3">
                <button
                  v-for="spec in specs"
                  :key="spec.value"
                  class="px-5 py-2 rounded-full text-sm border transition-colors"
                  :class="selectedSpec === spec.value
                    ? 'border-primary-container bg-primary-container/10 text-primary-container font-medium'
                    : 'border-outline-variant text-on-surface-variant'"
                  @click="selectedSpec = spec.value"
                >
                  {{ spec.label }}
                </button>
              </div>
            </div>

            <!-- Quantity -->
            <div class="flex items-center justify-between mb-6">
              <span class="text-sm font-medium text-on-surface">数量</span>
              <div class="flex items-center gap-3">
                <button
                  class="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center active:scale-90 transition-transform"
                  @click="quantity = Math.max(1, quantity - 1)"
                >
                  <span class="material-symbols-outlined text-on-surface-variant" style="font-size: 18px;">remove</span>
                </button>
                <span class="text-base font-medium w-6 text-center">{{ quantity }}</span>
                <button
                  class="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center active:scale-90 transition-transform"
                  @click="quantity++"
                >
                  <span class="material-symbols-outlined text-on-surface-variant" style="font-size: 18px;">add</span>
                </button>
              </div>
            </div>

            <!-- Confirm Button -->
            <button class="w-full py-3.5 rounded-full bg-primary-container text-white font-medium text-base active:scale-[0.98] transition-transform">
              确认购买
            </button>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.animate-slide-up {
  animation: slideUp 0.3s ease-out;
}
@keyframes slideUp {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}
</style>
