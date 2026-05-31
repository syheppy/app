<script setup>
import { ref, onMounted, watch } from 'vue'
import { supabase } from '../utils/supabase.js'

const props = defineProps({
  visible: { type: Boolean, default: false },
  popup: { type: Object, default: null },
})

const emit = defineEmits(['close', 'link'])
const dontShowToday = ref(false)

function handleClose() {
  if (dontShowToday.value) {
    // 设置今天不再显示
    const today = new Date().toISOString().split('T')[0]
    localStorage.setItem('popup_hide_date', today)
  }
  emit('close')
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
      <div v-if="visible && popup" class="fixed inset-0 z-50 flex items-center justify-center px-6">
        <!-- 遮罩 -->
        <div class="absolute inset-0 bg-black/50" @click="handleClose"></div>

        <!-- 弹窗内容 -->
        <div class="relative w-full max-w-sm bg-white rounded-2xl overflow-hidden shadow-2xl">
          <!-- 图片 -->
          <div v-if="popup.image_url" class="w-full aspect-[4/3] overflow-hidden">
            <img :src="popup.image_url" :alt="popup.title" class="w-full h-full object-cover" />
          </div>

          <!-- 文字内容 -->
          <div class="px-6 pt-5 pb-2">
            <h3 class="font-headline text-xl font-bold text-on-surface text-center mb-2">
              {{ popup.title }}
            </h3>
            <p v-if="popup.content" class="text-sm text-on-surface-variant text-center leading-relaxed mb-4">
              {{ popup.content }}
            </p>

            <!-- 跳转按钮 -->
            <button
              v-if="popup.link_url"
              @click="handleLink"
              class="w-full py-3 rounded-xl bg-primary text-on-primary font-bold text-center shadow-[0_4px_20px_rgba(194,101,42,0.2)] active:scale-[0.98] transition-transform mb-3"
            >
              {{ popup.link_text || '立即查看' }}
            </button>

            <!-- 今天不再提示 -->
            <label class="flex items-center justify-center gap-2 mb-2 cursor-pointer">
              <input
                v-model="dontShowToday"
                type="checkbox"
                class="w-4 h-4 accent-primary"
              />
              <span class="text-xs text-on-surface-variant">今天不再提示</span>
            </label>
          </div>

          <!-- 关闭按钮 -->
          <div class="px-6 pb-5">
            <button
              @click="handleClose"
              class="w-full py-3 rounded-xl border-2 border-outline-variant text-on-surface-variant font-medium text-center active:scale-[0.98] transition-transform"
            >
              关闭
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
  transition: all 0.3s ease;
}

.popup-enter-from,
.popup-leave-to {
  opacity: 0;
}

.popup-enter-from > div:last-child,
.popup-leave-to > div:last-child {
  transform: scale(0.9);
}
</style>
