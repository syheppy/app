import { reactive } from 'vue'

const state = reactive({
  message: '',
  visible: false
})

let timer = null

export function useToast() {
  const show = (message, duration = 2000) => {
    if (timer) clearTimeout(timer)
    state.message = message
    state.visible = true
    timer = setTimeout(() => {
      state.visible = false
    }, duration)
  }

  return {
    state,
    show
  }
}
