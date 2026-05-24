<script setup>
import { ref } from 'vue'
import TopHeader from './components/layout/TopHeader.vue'
import BottomNavBar from './components/layout/BottomNavBar.vue'
import HeroBanner from './components/home/HeroBanner.vue'
import ValueProps from './components/home/ValueProps.vue'
import SectionHeader from './components/home/SectionHeader.vue'
import ProductCard from './components/common/ProductCard.vue'
import ProductCardLarge from './components/common/ProductCardLarge.vue'
import LoginView from './views/LoginView.vue'
import RegisterView from './views/RegisterView.vue'
import CategoryView from './views/CategoryView.vue'
import ProfileView from './views/ProfileView.vue'
import OrderListView from './views/OrderListView.vue'
import CartView from './views/CartView.vue'
import ProductDetailView from './views/ProductDetailView.vue'
import AddressView from './views/AddressView.vue'
import CheckoutView from './views/CheckoutView.vue'
import PaymentSuccessView from './views/PaymentSuccessView.vue'

const currentView = ref('login')

const navigate = (view) => {
  currentView.value = view === 'user' ? 'profile' : view
}

const hotProducts = [
  {
    image: 'https://lh3.googleusercontent.com/aida/ADBb0uiSU54_g3nmA8rJT-tXJpsN0WgzHOkS5cHyxyj1qSH-2i7pDm2oRxLrhtnA9J8gD0p6K8axFH-dzIVy2Qyj6bBSdsYqlAtCH_hVccROJWcD5XVwMFDU5UG6-Bwck8dvQPSS1l2AEZNzStQBeZqphuQ-KBjXGyIPj3aQdPBtAFe7ny95_h2wV9cnOn9xSTQV5kNSafz3f1uGOjxtKRCFB0trQJnNOE8mqozujZTrCOZvQ3TKKfmenGn8sNAL',
    title: '烟薯25号 冰糖蜜薯',
    description: '出蜜多，肉质细腻，入口即化',
    price: '29.9',
    originalPrice: '39.9',
    badge: 'TOP 1'
  },
  {
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAQ0uF_3QAWFwCRB3gi8j47ivRDfQV_N_KFIi0dlbumTNE68Mk9i8s-ezPMuIsy4qmG-qhTp-p2y13e7W4_Hj6Kdz4lGxTPkgwthiKlEjO4u7ObCTOG2nASTL-yQ85OWoshDHxwfy1dEIMLy1bESHYqZkRx-y-TAipwLyqF4Rwl3hKWHEjio4CHoqrfzk7n6S67xaUJ-Pj-BP_wC5cUYCki-aVXIB9oVlk-C0YogOeIoxsMwLSX_ZgtndtVImEfMPIHjD9ZD3UyzMk8',
    title: '富硒紫薯 饱腹代餐',
    price: '19.9',
    tag: '低卡'
  },
  {
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBulzCTbA-MIR6eQbf4DpQHLzJNb2HbGtWLsuDzB_QH0eUPM4bXAmGbZsIfGRxgg-XwNU3kh7bjgqbHGk4vPUha1kpfTRdUk9aErCtoiuex3Mv_EvcCSTM-pKt_k5pXtts3CszmwzXWGMaot8adLqXWEiXgNtDiF7JtlHNlyfpKJdtIwBKpwZqmFNnUhWsh-EgrU025ET_XqpzmFJSZKehHU60_hv1ZOFeDVmtvm3IX2f5Pnk4O0Jl3erj-IZKjlituOvH2SKLAWUez',
    title: '原味地瓜干 零添加',
    price: '25.9',
    tag: '休闲零食',
    tagColor: 'bg-tertiary-container text-on-tertiary-container'
  },
  {
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBb1oKbF9q9lhzpOHe56dId3xj8GjrTX155fyHBpfOqWL4sWM2TVuzY0leRiKyaulRdzde-FlTtRIXIdaTcL7FWjaAZr9N6HDlhRvcHKFJ1qvP-1bzBOWZyzgqoMb0KI8pceIhUWs61shR86ZW7tvo7BKxkWpBVmQlmRQXD2SwtPRN38FikNPAnWISuXpfq1RK-_s2sAZN6w5WKrNCvIzSJVm4lTm16j59Ctt4pxQ9COSiYm95RlaAfnKK5jTq61mVz2qCx3batzu_G',
    title: '有机紫薯脆片',
    price: '19.9',
    tag: '天然原香，极致酥脆',
    tagColor: 'bg-primary-container text-white'
  },
  {
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAhsdcd550KEitOvIobpzJ2JUot-zFMIzVcCZY816jhSwwaEr4RY6m4jfhw809YlaWdPVa6OJ3DsD0g2I_MZW2_M30LU_0r4ETcF6_UsHU3xTWaWL2D1xV1QuwteeDrotZ0hmizVGVXYReEpWR-J47f2E7r_2RliX9Es-dtKW1_aIMN0abB5C4E827OR114z_PTdC3xIQAMBoI5XBRFNe4pL0qbfKK_g-VVbcq_fia3qODjjjNzRIzkm4-j7rB8P5efdZOgIpquOP_e',
    title: '高原紫薯',
    price: '19.9',
    tag: '富含花青素'
  }
]

const recommendProducts = [
  {
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDBy2A6zE0BECANX8jnVMrYT2AxFjCwNIdVfo_qxBLEaYIecSfvuxnvrWoWvWy9r8muZKZ24VmsRwJCz7exVuuK-d-iS1lZOYqw5AfgupZXnCF3IsNexd07n7sfYdTfbddhRRbynFa7komAWYqfXGxIFILGMUfCGUBi13risQXsU3QYYiQP2fhj0_0kCqTdiIZqYtwKN2Obo1noWH2PxAFCSFV862KKdd_JoutTvRrO8S4EOdvvIDJxUkCFf320LVcqLYA51ymjCJEQ',
    title: '六鳌红蜜薯',
    price: '39.90',
    tag: '粉糯香甜'
  },
  {
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBb6Zt8PKcuaxdCK_Z3WNVY7I765-K9pIIqOn0zSvUwPRMAMo-JnGP1fxJ03A-1oFXd7WtacP8TcsNrS34ZGsBZV7hiextWnWIqUtaScXov835vJ3v5tyLALo_yYF1XaDedG0TT8BNqL9OjT1zEtpblijY_qQ4vwSEkYpg-rii4M3UbwmbJLaO0Z5hLee8huS120hH_gzj6rH1pkj3JiUbsCsDAttww3fbDs2Gdksoh_-53ziQMiOf1o9a_j3xKn3KETeHpU9Jr6HMy',
    title: '手作蜜汁烤地瓜',
    price: '25.00',
    tag: '适合烤制',
    tagColor: 'bg-tertiary-container text-on-tertiary-container'
  },
  {
    image: 'https://lh3.googleusercontent.com/aida/ADBb0ui39Q3pPKe5VvNg4y8AiTtYqWEyxhnhhTOKiWojxcOEJsVuB5vYQH7mioGcJNstwmBjY-Kl-eT4SwRa-p84SR9rmD5z0ZsmnktiHWDE4hmmyaTZIyvyeFavhugJy87CKSshtPVXJL1v1O21ghPlypw01KLe4NrP-oFxFTyiPjBl27jj3d-LRrlCSqax02z4b_eSLJLkpAcnWwQuMjwls2k8-QsT_VB0gSs0RKVYJfthBrfxayltpttF56A',
    title: '薯鲜生精选礼盒',
    price: '199.00',
    tag: '送礼佳品',
    tagColor: 'bg-primary-container text-white'
  }
]

const navItems = [
  { key: 'home', label: '首页' },
  { key: 'category', label: '分类' },
  { key: 'product', label: '详情' },
  { key: 'cart', label: '购物车' },
  { key: 'checkout', label: '确认订单' },
  { key: 'success', label: '支付成功' },
  { key: 'address', label: '地址管理' },
  { key: 'orders', label: '订单列表' },
  { key: 'profile', label: '我的' },
  { key: 'login', label: '登录' },
  { key: 'register', label: '注册' }
]
</script>

<template>
  <!-- Navigation Picker (for preview) -->
  <div class="fixed top-0 left-0 w-full z-[100] bg-surface-container-lowest border-b border-outline-variant shadow-lg">
    <div class="flex flex-wrap gap-1 p-2 max-w-7xl mx-auto">
      <button
        v-for="item in navItems"
        :key="item.key"
        class="px-3 py-1.5 rounded-full text-xs font-medium transition-colors"
        :class="currentView === item.key ? 'bg-primary-container text-white' : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'"
        @click="navigate(item.key)"
      >
        {{ item.label }}
      </button>
    </div>
  </div>

  <!-- Login View -->
  <LoginView
    v-if="currentView === 'login'"
    :on-back="() => navigate('home')"
    :on-register="() => navigate('register')"
    :on-forgot-password="() => {}"
  />

  <!-- Register View -->
  <RegisterView
    v-else-if="currentView === 'register'"
    :on-back="() => navigate('login')"
    :on-login="() => navigate('login')"
  />

  <!-- Category View -->
  <CategoryView v-else-if="currentView === 'category'" />

  <!-- Profile View -->
  <ProfileView v-else-if="currentView === 'profile'" />

  <!-- Order List View -->
  <OrderListView v-else-if="currentView === 'orders'" />

  <!-- Cart View -->
  <CartView v-else-if="currentView === 'cart'" />

  <!-- Product Detail View -->
  <ProductDetailView v-else-if="currentView === 'product'" />

  <!-- Address View -->
  <AddressView v-else-if="currentView === 'address'" />

  <!-- Checkout View -->
  <CheckoutView v-else-if="currentView === 'checkout'" />

  <!-- Payment Success View -->
  <PaymentSuccessView v-else-if="currentView === 'success'" />

  <!-- Home View -->
  <div v-else class="min-h-screen bg-background text-on-surface">
    <TopHeader />
    <BottomNavBar active="home" @navigate="navigate" />

    <main class="flex-1 max-w-7xl mx-auto w-full pt-14 md:pt-16 flex flex-col gap-8 overflow-x-hidden pb-24 md:pb-8">
      <!-- Hero Banner -->
      <HeroBanner />

      <!-- Value Props -->
      <ValueProps />

      <!-- Hot Sales -->
      <section class="px-5 md:px-0 flex flex-col gap-4">
        <SectionHeader title="热销爆款" icon="local_fire_department" icon-color="text-error" />
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <ProductCardLarge
            :image="hotProducts[0].image"
            :title="hotProducts[0].title"
            :description="hotProducts[0].description"
            :price="hotProducts[0].price"
            :original-price="hotProducts[0].originalPrice"
            :badge="hotProducts[0].badge"
          />
          <ProductCard
            v-for="(product, index) in hotProducts.slice(1)"
            :key="index"
            v-bind="product"
          />
        </div>
      </section>

      <!-- Recommend -->
      <section class="px-5 md:px-0 flex flex-col gap-4 mt-8">
        <SectionHeader title="为您推荐" icon="recommend" />
        <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
          <ProductCard
            v-for="(product, index) in recommendProducts"
            :key="index"
            v-bind="product"
          />
        </div>
      </section>
    </main>
  </div>
</template>
