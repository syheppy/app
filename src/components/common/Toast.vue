<script setup>
import { useToast } from '../../composables/useToast'

const { state } = useToast()
</script>

<template>
  <Teleport to="body">
    <Transition name="toast">
      <div
        v-if="state.visible"
        class="fixed top-16 left-1/2 z-[100] -translate-x-1/2 bg-on-surface text-white text-sm font-medium px-6 py-3 rounded-full shadow-lg whitespace-nowrap"
      >
        {{ state.message }}
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}
.toast-enter-from {
  opacity: 0;
  transform: translate(-50%, -20px);
}
.toast-leave-to {
  opacity: 0;
  transform: translate(-50%, -20px);
}
</style>
