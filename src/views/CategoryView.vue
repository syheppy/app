<script setup>
import { ref } from 'vue'
import TopHeader from '../components/layout/TopHeader.vue'
import BottomNavBar from '../components/layout/BottomNavBar.vue'

const categories = [
  { key: 'honey', label: '蜜薯系列', icon: '🍠' },
  { key: 'purple', label: '紫薯系列', icon: '🟣' },
  { key: 'red', label: '红薯系列', icon: '🔴' },
  { key: 'processed', label: '薯类加工品', icon: '🍟' },
  { key: 'gift', label: '礼盒专区', icon: '🎁' }
]

const activeCategory = ref('honey')

const banners = {
  honey: { title: '精选原产地蜜薯', subtitle: '大地馈赠，新鲜出土', gradient: 'from-[#8B6914]/80 to-[#D4A843]/60' },
  purple: { title: '精选原产地紫薯', subtitle: '高原直采，天然美味', gradient: 'from-[#5B2C6F]/80 to-[#8E44AD]/60' },
  red: { title: '自然馈赠，原生态红薯', subtitle: '大地馈赠，新鲜出土', gradient: 'from-[#922B21]/80 to-[#C0392B]/60' },
  processed: { title: '精选薯类加工品', subtitle: '', gradient: 'from-[#7D6608]/80 to-[#D4AC0D]/60' },
  gift: { title: 'Sakura Potato in Gifts Set', subtitle: 'Premium Gift Boxes', gradient: 'from-[#8B4513]/80 to-[#CD853F]/60' }
}

const sortOptions = ['综合排序', '销量优先', '价格最低', '最新上架']
const activeSort = ref('综合排序')
const showSortMenu = ref(false)

const products = {
  honey: [
    { name: '六鳌红蜜薯', desc: '产地直采，个大饱满，皮薄肉厚', price: '39.9', tag: '当季鲜采', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDBy2A6zE0BECANX8jnVMrYT2AxFjCwNIdVfo_qxBLEaYIecSfvuxnvrWoWvWy9r8muZKZ24VmsRwJCz7exVuuK-d-iS1lZOYqw5AfgupZXnCF3IsNexd07n7sfYdTfbddhRRbynFa7komAWYqfXGxIFILGMUfCGUBi13risQXsU3QYYiQP2fhj0_0kCqTdiIZqYtwKN2Obo1noWH2PxAFCSFV862KKdd_JoutTvRrO8S4EOdvvIDJxUkCFf320LVcqLYA51ymjCJEQ' },
    { name: '红蜜薯（生品）', desc: '红皮红心，适合蒸烤', price: '32.9', tag: '适合蒸烤', tagColor: 'bg-tertiary-container text-on-tertiary-container', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBb6Zt8PKcuaxdCK_Z3WNVY7I765-K9pIIqOn0zSvUwPRMAMo-JnGP1fxJ03A-1oFXd7WtacP8TcsNrS34ZGsBZV7hiextWnWIqUtaScXov835vJ3v5tyLALo_yYF1XaDedG0TT8BNqL9OjT1zEtpblijY_qQ4vwSEkYpg-rii4M3UbwmbJLaO0Z5hLee8huS120hH_gzj6rH1pkj3JiUbsCsDAttww3fbDs2Gdksoh_-53ziQMiOf1o9a_j3xKn3KETeHpU9Jr6HMy' },
    { name: '迷你小香薯', desc: '一口一个，粉糯清甜，产地直供', price: '35.0', tag: '产地直供', image: 'https://lh3.googleusercontent.com/aida/ADBb0uiSU54_g3nmA8rJT-tXJpsN0WgzHOkS5cHyxyj1qSH-2i7pDm2oRxLrhtnA9J8gD0p6K8axFH-dzIVy2Qyj6bBSdsYqlAtCH_hVccROJWcD5XVwMFDU5UG6-Bwck8dvQPSS1l2AEZNzStQBeZqphuQ-KBjXGyIPj3aQdPBtAFe7ny95_h2wV9cnOn9xSTQV5kNSafz3f1uGOjxtKRCFB0trQJnNOE8mqozujZTrCOZvQ3TKKfmenGn8sNAL' }
  ],
  purple: [
    { name: '高原有机紫薯...', desc: '产地直达，天然生长，软糯细腻...', price: '45.0/5斤', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAQ0uF_3QAWFwCRB3gi8j47ivRDfQV_N_KFIi0dlbumTNE68Mk9i8s-ezPMuIsy4qmG-qhTp-p2y13e7W4_Hj6Kdz4lGxTPkgwthiKlEjO4u7ObCTOG2nASTL-yQ85OWoshDHxwfy1dEIMLy1bESHYqZkRx-y-TAipwLyqF4Rwl3hKWHEjio4CHoqrfzk7n6S67xaUJ-Pj-BP_wC5cUYCki-aVXIB9oVlk-C0YogOeIoxsMwLSX_ZgtndtVImEfMPIHjD9ZD3UyzMk8' },
    { name: '高纯离心紫薯...', desc: '肉质深紫，口感绵软细腻，沁人心...', price: '38.0/3斤', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBulzCTbA-MIR6eQbf4DpQHLzJNb2HbGtWLsuDzB_QH0eUPM4bXAmGbZsIfGRxgg-XwNU3kh7bjgqbHGk4vPUha1kpfTRdUk9aErCtoiuex3Mv_EvcCSTM-pKt_k5pXtts3CszmwzXWGMaot8adLqXWEiXgNtDiF7JtlHNlyfpKJdtIwBKpwZqmFNnUhWsh-EgrU025ET_XqpzmFJSZKehHU60_hv1ZOFeDVmtvm3IX2f5Pnk4O0Jl3erj-IZKjlituOvH2SKLAWUez' },
    { name: '农家迷你小紫...', desc: '精选小果，皮脆易剥，一口一个，...', price: '32.0/5斤', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBb1oKbF9q9lhzpOHe56dId3xj8GjrTX155fyHBpfOqWL4sWM2TVuzY0leRiKyaulRdzde-FlTtRIXIdaTcL7FWjaAZr9N6HDlhRvcHKFJ1qvP-1bzBOWZyzgqoMb0KI8pceIhUWs61shR86ZW7tvo7BKxkWpBVmQlmRQXD2SwtPRN38FikNPAnWISuXpfq1RK-_s2sAZN6w5WKrNCvIzSJVm4lTm16j59Ctt4pxQ9COSiYm95RlaAfnKK5jTq61mVz2qCx3batzu_G' }
  ],
  red: [
    { name: '六鳌红薯（生品）', desc: '沙地种植，皮薄肉厚', price: '39.9/5斤', tag: '产地直供', image: 'https://lh3.googleusercontent.com/aida/ADBb0uiSU54_g3nmA8rJT-tXJpsN0WgzHOkS5cHyxyj1qSH-2i7pDm2oRxLrhtnA9J8gD0p6K8axFH-dzIVy2Qyj6bBSdsYqlAtCH_hVccROJWcD5XVwMFDU5UG6-Bwck8dvQPSS1l2AEZNzStQBeZqphuQ-KBjXGyIPj3aQdPBtAFe7ny95_h2wV9cnOn9xSTQV5kNSafz3f1uGOjxtKRCFB0trQJnNOE8mqozujZTrCOZvQ3TKKfmenGn8sNAL' },
    { name: '西瓜红薯（生品）', desc: '红皮红心，软糯可口', price: '32.9/3斤', tag: '口感甜如瓜', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBb6Zt8PKcuaxdCK_Z3WNVY7I765-K9pIIqOn0zSvUwPRMAMo-JnGP1fxJ03A-1oFXd7WtacP8TcsNrS34ZGsBZV7hiextWnWIqUtaScXov835vJ3v5tyLALo_yYF1XaDedG0TT8BNqL9OjT1zEtpblijY_qQ4vwSEkYpg-rii4M3UbwmbJLaO0Z5hLee8huS120hH_gzj6rH1pkj3JiUbsCsDAttww3fbDs2Gdksoh_-53ziQMiOf1o9a_j3xKn3KETeHpU9Jr6HMy' },
    { name: '精品红薯（生品）', desc: '新鲜采挖，自然美味', price: '25.0/5斤', tag: '精选大薯', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAhsdcd550KEitOvIobpzJ2JUot-zFMIzVcCZY816jhSwwaEr4RY6m4jfhw809YlaWdPVa6OJ3DsD0g2I_MZW2_M30LU_0r4ETcF6_UsHU3xTWaWL2D1xV1QuwteeDrotZ0hmizVGVXYReEpWR-J47f2E7r_2RliX9Es-dtKW1_aIMN0abB5C4E827OR114z_PTdC3xIQAMBoI5XBRFNe4pL0qbfKK_g-VVbcq_fia3qODjjjNzRIzkm4-j7rB8P5efdZOgIpquOP_e' }
  ],
  processed: [
    { name: '手工纯薯粉条', desc: '爽滑Q弹，纯度高', price: '32.0/份', tag: '传统手作', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBulzCTbA-MIR6eQbf4DpQHLzJNb2HbGtWLsuDzB_QH0eUPM4bXAmGbZsIfGRxgg-XwNU3kh7bjgqbHGk4vPUha1kpfTRdUk9aErCtoiuex3Mv_EvcCSTM-pKt_k5pXtts3CszmwzXWGMaot8adLqXWEiXgNtDiF7JtlHNlyfpKJdtIwBKpwZqmFNnUhWsh-EgrU025ET_XqpzmFJSZKehHU60_hv1ZOFeDVmtvm3IX2f5Pnk4O0Jl3erj-IZKjlituOvH2SKLAWUez' },
    { name: '农家自制地瓜干', desc: '香甜软糯，无添加', price: '28.0/500g', tag: '自然风干', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAQ0uF_3QAWFwCRB3gi8j47ivRDfQV_N_KFIi0dlbumTNE68Mk9i8s-ezPMuIsy4qmG-qhTp-p2y13e7W4_Hj6Kdz4lGxTPkgwthiKlEjO4u7ObCTOG2nASTL-yQ85OWoshDHxwfy1dEIMLy1bESHYqZkRx-y-TAipwLyqF4Rwl3hKWHEjio4CHoqrfzk7n6S67xaUJ-Pj-BP_wC5cUYCki-aVXIB9oVlk-C0YogOeIoxsMwLSX_ZgtndtVImEfMPIHjD9ZD3UyzMk8' },
    { name: '香酥紫薯片', desc: '嘎嘣脆，薯香浓郁', price: '19.9/罐', tag: '脆脆零食', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBb1oKbF9q9lhzpOHe56dId3xj8GjrTX155fyHBpfOqWL4sWM2TVuzY0leRiKyaulRdzde-FlTtRIXIdaTcL7FWjaAZr9N6HDlhRvcHKFJ1qvP-1bzBOWZyzgqoMb0KI8pceIhUWs61shR86ZW7tvo7BKxkWpBVmQlmRQXD2SwtPRN38FikNPAnWISuXpfq1RK-_s2sAZN6w5WKrNCvIzSJVm4lTm16j59Ctt4pxQ9COSiYm95RlaAfnKK5jTq61mVz2qCx3batzu_G' }
  ],
  gift: [
    { name: 'Harvest Celebration Gift...', desc: '', price: '168', image: 'https://lh3.googleusercontent.com/aida/ADBb0ui39Q3pPKe5VvNg4y8AiTtYqWEyxhnhhTOKiWojxcOEJsVuB5vYQH7mioGcJNstwmBjY-Kl-eT4SwRa-p84SR9rmD5z0ZsmnktiHWDE4hmmyaTZIyvyeFavhugJy87CKSshtPVXJL1v1O21ghPlypw01KLe4NrP-oFxFTyiPjBl27jj3d-LRrlCSqax02z4b_eSLJLkpAcnWwQuMjwls2k8-QsT_VB0gSs0RKVYJfthBrfxayltpttF56A' },
    { name: 'Classic Sweetness Bundle', desc: '', price: '89', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDBy2A6zE0BECANX8jnVMrYT2AxFjCwNIdVfo_qxBLEaYIecSfvuxnvrWoWvWy9r8muZKZ24VmsRwJCz7exVuuK-d-iS1lZOYqw5AfgupZXnCF3IsNexd07n7sfYdTfbddhRRbynFa7komAWYqfXGxIFILGMUfCGUBi13risQXsU3QYYiQP2fhj0_0kCqTdiIZqYtwKN2Obo1noWH2PxAFCSFV862KKdd_JoutTvRrO8S4EOdvvIDJxUkCFf320LVcqLYA51ymjCJEQ' },
    { name: 'Premium Choices Gift Set', desc: '', price: '', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBb6Zt8PKcuaxdCK_Z3WNVY7I765-K9pIIqOn0zSvUwPRMAMo-JnGP1fxJ03A-1oFXd7WtacP8TcsNrS34ZGsBZV7hiextWnWIqUtaScXov835vJ3v5tyLALo_yYF1XaDedG0TT8BNqL9OjT1zEtpblijY_qQ4vwSEkYpg-rii4M3UbwmbJLaO0Z5hLee8huS120hH_gzj6rH1pkj3JiUbsCsDAttww3fbDs2Gdksoh_-53ziQMiOf1o9a_j3xKn3KETeHpU9Jr6HMy' },
    { name: 'Elite Farm Direct Gift Set', desc: '', price: '218', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAhsdcd550KEitOvIobpzJ2JUot-zFMIzVcCZY816jhSwwaEr4RY6m4jfhw809YlaWdPVa6OJ3DsD0g2I_MZW2_M30LU_0r4ETcF6_UsHU3xTWaWL2D1xV1QuwteeDrotZ0hmizVGVXYReEpWR-J47f2E7r_2RliX9Es-dtKW1_aIMN0abB5C4E827OR114z_PTdC3xIQAMBoI5XBRFNe4pL0qbfKK_g-VVbcq_fia3qODjjjNzRIzkm4-j7rB8P5efdZOgIpquOP_e' }
  ]
}
</script>

<template>
  <div class="min-h-screen bg-background text-on-surface">
    <TopHeader />

    <!-- Search Bar -->
    <div class="px-5 pt-2 pb-3 md:hidden">
      <div class="flex items-center bg-surface-container rounded-lg py-2.5 px-4 gap-2">
        <span class="material-symbols-outlined text-outline" style="font-size: 20px;">search</span>
        <span class="text-sm text-outline">搜索新鲜农产品...</span>
      </div>
    </div>

    <div class="flex flex-1 pb-20 md:pb-8">
      <!-- Left Sidebar -->
      <aside class="w-24 md:w-32 flex-shrink-0 bg-surface-container-low border-r border-outline-variant">
        <button
          v-for="cat in categories"
          :key="cat.key"
          class="w-full py-4 px-3 text-left text-sm transition-colors border-l-3"
          :class="activeCategory === cat.key
            ? 'bg-surface-container-lowest text-primary-container font-semibold border-primary-container'
            : 'text-on-surface-variant border-transparent hover:bg-surface-container'"
          @click="activeCategory = cat.key"
        >
          {{ cat.label }}
        </button>
      </aside>

      <!-- Right Content -->
      <main class="flex-1 px-4 py-4">
        <!-- Banner -->
        <div
          class="rounded-2xl p-5 mb-4 text-white bg-gradient-to-br"
          :class="banners[activeCategory].gradient"
        >
          <h2 class="font-display text-xl font-bold mb-1">{{ banners[activeCategory].title }}</h2>
          <p v-if="banners[activeCategory].subtitle" class="text-sm opacity-90">{{ banners[activeCategory].subtitle }}</p>
        </div>

        <!-- Sort Bar -->
        <div class="flex items-center justify-between mb-3">
          <h3 class="text-base font-semibold text-on-surface">全部{{ categories.find(c => c.key === activeCategory)?.label.replace('系列','').replace('专区','') }}</h3>
          <div class="relative">
            <button
              class="text-xs text-on-surface-variant flex items-center gap-1"
              @click="showSortMenu = !showSortMenu"
            >
              {{ activeSort }}
              <span class="material-symbols-outlined" style="font-size: 16px;">expand_more</span>
            </button>
            <div v-if="showSortMenu" class="absolute right-0 top-8 bg-surface-container-lowest rounded-xl shadow-lg border border-outline-variant py-2 z-10 w-28">
              <button
                v-for="opt in sortOptions"
                :key="opt"
                class="w-full text-left px-4 py-2 text-sm hover:bg-surface-container transition-colors"
                :class="activeSort === opt ? 'text-primary-container font-medium' : 'text-on-surface-variant'"
                @click="activeSort = opt; showSortMenu = false"
              >
                {{ opt }}
              </button>
            </div>
          </div>
        </div>

        <!-- Product Grid -->
        <div class="grid grid-cols-2 gap-3">
          <div
            v-for="(product, index) in products[activeCategory]"
            :key="index"
            class="bg-surface-container-lowest rounded-2xl overflow-hidden border border-outline-variant/50 group cursor-pointer"
          >
            <div class="relative h-28 overflow-hidden">
              <img
                :src="product.image"
                :alt="product.name"
                class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <span
                v-if="product.tag"
                class="absolute top-2 left-2 text-[10px] px-2 py-0.5 rounded bg-surface-container-lowest/90 text-on-surface-variant"
              >
                {{ product.tag }}
              </span>
            </div>
            <div class="p-3">
              <h4 class="text-sm font-medium text-on-surface line-clamp-1 mb-1">{{ product.name }}</h4>
              <p class="text-[11px] text-on-surface-variant line-clamp-2 mb-2">{{ product.desc }}</p>
              <div class="flex items-center justify-between">
                <div class="flex items-baseline gap-0.5">
                  <span class="text-error text-sm font-bold">¥</span>
                  <span class="text-error text-lg font-bold">{{ product.price }}</span>
                </div>
                <button class="w-7 h-7 rounded-full bg-primary-container text-white flex items-center justify-center active:scale-90 transition-transform">
                  <span class="material-symbols-outlined" style="font-size: 16px;">add</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>

    <BottomNavBar active="category" />
  </div>
</template>
