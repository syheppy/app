<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import TopHeader from './components/layout/TopHeader.vue'
import BottomNavBar from './components/layout/BottomNavBar.vue'
import Toast from './components/common/Toast.vue'

const route = useRoute()
const showNav = computed(() => !route.meta.hideNav)
const showHeader = computed(() => !route.meta.hideHeader)
</script>

<template>
  <div class="min-h-screen theme-bg theme-text flex flex-col">
    <TopHeader v-if="showHeader" />
    <div :class="showHeader ? 'pt-[88px] md:pt-16' : ''">
      <router-view />
    </div>
    <BottomNavBar v-if="showNav" />
    <Toast />
  </div>
</template>
