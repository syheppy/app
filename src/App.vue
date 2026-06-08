<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import TopHeader from './components/layout/TopHeader.vue'
import BottomNavBar from './components/layout/BottomNavBar.vue'
import Toast from './components/common/Toast.vue'
import { pageEnter, pageLeave, subPageEnter, subPageLeave } from './utils/animations'

const route = useRoute()
const showNav = computed(() => !route.meta.hideNav)
const showHeader = computed(() => !route.meta.hideHeader)
const isSlideTransition = computed(() => route.meta.transition === 'slide')
</script>

<template>
  <div class="min-h-screen flex flex-col" style="background-color: var(--color-background); color: var(--color-on-background);">
    <TopHeader v-if="showHeader" />
    <div :class="showHeader ? 'pt-[88px] md:pt-16' : ''">
      <router-view v-slot="{ Component }">
        <Transition
          @enter="isSlideTransition ? subPageEnter : pageEnter"
          @leave="isSlideTransition ? subPageLeave : pageLeave"
          :css="false"
        >
          <component :is="Component" />
        </Transition>
      </router-view>
    </div>
    <BottomNavBar v-if="showNav" />
    <Toast />
  </div>
</template>
