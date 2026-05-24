<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  slides: {
    type: Array,
    default: () => [
      {
        image: 'https://lh3.googleusercontent.com/aida/ADBb0ugom4b42mVeWgxkrN4CP7T8-AQdnScXdtRZZ1bqzk5KuNFnyj_oz4l5kG20JMMZeAwO9DRhsBe3K3kEslrQPh27zUsnZ72K2ebSJcCtHNZr0rm1eoQYmXMmffoD7GnpqK5OkQIr77h_jAKcf_2SzblJYZe7l0LSELmkqzvZjXJgTGS8oKNp2-L1CIAxXZqdnQzwim4i2SGslgI7htmlzQTvOV-bWp4h3G1RaJn73hIH8qiZfhZwU_0eUTTPffkSJt2SmSUCIiTym3c',
        tag: '新季丰收',
        title: '大地甄选 直送到家',
        subtitle: '从田间直达餐桌，锁住每一份自然的甜蜜'
      },
      {
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBcHm2XJltGZx-0vpLaqqQnItgdCunqWFNAwKEdM61bOCyjvLt0xU5J4ajLaE2T4DGa4IrK2mF9ah0654oEjqehwzlaspqDvqD23aKtk89Qrzkq4yVcCGuCF6uh5fra74SbpKOccrPV4DovPRwro0ay-AtIGB0FlSJHVHVSc2J_QsqcpAyn9Kf21XwCRPkirvbWev3Yv-sl6lWi9xKkMk3iqV0dFTK8tarwRMA9McaAOwqv1vBoTA8Uy9Y-dPmQeNIlp3XqWSD1z21B',
        tag: '尊享礼遇',
        title: '精选红薯 礼盒首发',
        subtitle: '传递大地的情意与温暖'
      },
      {
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD1g3itVqnBX71cxvBcSClx8F8MKi40DkcW1yjdnUKO2FpMsEo6SFPP7koCPSWfEdI9sDA4gmWAXC0oWItSlVrAcXSy6bDGKs-IN8cvoRJox_8cnGN_budV6o2-_mlMP-bFhXfUsJE9xCYJPXeOrCIvlnvL9d4l98EMZLDviD1ZcjOItQbCSivKst48H230EjkTMehgOMI7nJNn99pPzP1FdwxI4D0-SlYwBKvKb2FyHBA0ahCpZND_fm-WuJQHpvRIubhqvdgW71Hz',
        tag: '醇香午后',
        title: '蜜汁烤薯 软糯流油',
        subtitle: '体验自然源味的极致享受'
      }
    ]
  }
})

const currentIndex = ref(0)
const carousel = ref(null)
let autoPlayInterval = null

const updateDots = (index) => {
  currentIndex.value = index
}

const startAutoPlay = () => {
  autoPlayInterval = setInterval(() => {
    const next = (currentIndex.value + 1) % props.slides.length
    scrollToSlide(next)
  }, 3000)
}

const stopAutoPlay = () => {
  clearInterval(autoPlayInterval)
}

const scrollToSlide = (index) => {
  if (!carousel.value) return
  const slideWidth = carousel.value.children[0]?.offsetWidth || 0
  carousel.value.scrollTo({ left: slideWidth * index, behavior: 'smooth' })
  currentIndex.value = index
}

onMounted(() => {
  startAutoPlay()
})

onUnmounted(() => {
  stopAutoPlay()
})
</script>

<template>
  <section class="px-5 md:px-0 relative group overflow-hidden">
    <div
      ref="carousel"
      class="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar scroll-smooth"
      @mouseenter="stopAutoPlay"
      @mouseleave="startAutoPlay"
      @touchstart.passive="stopAutoPlay"
      @touchend.passive="startAutoPlay"
    >
      <div
        v-for="(slide, index) in slides"
        :key="index"
        class="flex-none w-full snap-center relative h-[200px] md:h-[400px] rounded-2xl overflow-hidden"
      >
        <img :alt="slide.title" class="absolute inset-0 w-full h-full object-cover" :src="slide.image" />
        <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end p-6">
          <span class="inline-block bg-primary-container text-white text-xs font-medium px-2 py-1 rounded w-max mb-2">{{ slide.tag }}</span>
          <h2 class="font-display text-3xl font-bold text-white mb-1">{{ slide.title }}</h2>
          <p class="text-sm text-surface-container-low opacity-90">{{ slide.subtitle }}</p>
        </div>
      </div>
    </div>

    <!-- Pagination Dots -->
    <div class="flex justify-center gap-2 mt-2">
      <button
        v-for="(_, index) in slides"
        :key="index"
        class="transition-all duration-300 rounded-full"
        :class="currentIndex === index ? 'w-6 h-1.5 bg-primary-container' : 'w-1.5 h-1.5 bg-surface-variant'"
        @click="scrollToSlide(index)"
      />
    </div>
  </section>
</template>
