<script setup>
import { ref } from 'vue'
import { X } from 'lucide-vue-next'

const props = defineProps({
  visible: { type: Boolean, default: false },
  popup: { type: Object, default: null },
})

const emit = defineEmits(['close', 'link'])
const isExiting = ref(false)
const dontShowToday = ref(false)

function handleClose() {
  isExiting.value = true
  setTimeout(() => {
    if (dontShowToday.value) {
      const today = new Date().toISOString().split('T')[0]
      localStorage.setItem('popup_hide_date', today)
    }
    emit('close')
    isExiting.value = false
  }, 400)
}

function handleLink() {
  if (props.popup?.link_url) {
    emit('link', props.popup.link_url)
  }
  handleClose()
}
</script>

<template>
  <Teleport to="body">
    <Transition name="popup">
      <div
        v-if="visible && popup"
        :class="['fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 transition-opacity duration-500', isExiting ? 'opacity-0' : '']"
      >
        <div
          :class="['bg-surface w-full max-w-md rounded-xl overflow-hidden shadow-2xl relative flex flex-col transition-all duration-500 ease-in-out', isExiting ? 'translate-y-[20px] scale-95 opacity-0' : '']"
        >
          <!-- 关闭按钮 -->
          <button
            class="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-black/20 text-white flex items-center justify-center hover:bg-black/40 hover:rotate-90 transition-all duration-300 active:scale-90 cursor-pointer"
            @click="handleClose"
          >
            <X :size="20" />
          </button>

          <!-- 图片 -->
          <div v-if="popup.image_url" class="relative h-64 overflow-hidden">
            <img :src="popup.image_url" :alt="popup.title" class="w-full h-full object-cover" />
            <div class="absolute inset-0 bg-gradient-to-t from-surface to-transparent"></div>
          </div>

          <!-- 内容 -->
          <div class="px-8 pb-10 pt-4 text-center">
            <span class="inline-block text-primary font-bold tracking-widest text-[12px] uppercase mb-2">SAHARA HARVEST</span>
            <h2 class="font-display text-3xl font-bold text-on-surface mb-4">{{ popup.title }}</h2>
            <p v-if="popup.content" class="font-body text-on-surface-variant leading-relaxed mb-8">
              {{ popup.content }}
            </p>

            <!-- 跳转按钮 -->
            <button
              v-if="popup.link_url"
              class="w-full cursor-pointer bg-primary text-white font-bold py-4 rounded-full shadow-lg shadow-primary/20 transition-all active:scale-95 mb-6"
              @click="handleLink"
            >
              {{ popup.link_text || '立即查看' }}
            </button>

            <!-- 今天不再提示 -->
            <label class="flex items-center justify-center gap-2 mb-4 cursor-pointer">
              <input v-model="dontShowToday" type="checkbox" class="w-4 h-4 accent-primary" />
              <span class="text-xs text-on-surface-variant">今天不再提示</span>
            </label>

            <!-- 稍后再说 -->
            <button
              class="text-outline hover:text-on-surface-variant transition-colors text-sm font-medium cursor-pointer"
              @click="handleClose"
            >
              稍后再说
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.popup-enter-active,
.popup-leave-active {
  transition: opacity 0.5s ease;
}

.popup-enter-from,
.popup-leave-to {
  opacity: 0;
}

.popup-enter-from > div:last-child,
.popup-leave-to > div:last-child {
  transform: translateY(20px) scale(0.95);
  opacity: 0;
}
</style>
