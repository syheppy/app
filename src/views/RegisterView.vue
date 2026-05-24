<script setup>
import { ref } from 'vue'

defineProps({
  onBack: { type: Function, default: () => {} },
  onLogin: { type: Function, default: () => {} }
})

const phone = ref('')
const smsCode = ref('')
const password = ref('')
const agreed = ref(false)
const showPassword = ref(false)
const countdown = ref(0)
let timer = null

const sendCode = () => {
  if (countdown.value > 0) return
  countdown.value = 60
  timer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) clearInterval(timer)
  }, 1000)
}

const handleRegister = () => {
  // TODO: register logic
}
</script>

<template>
  <div class="min-h-screen bg-background flex flex-col">
    <!-- Back Button -->
    <div class="px-5 pt-4">
      <button
        class="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container transition-colors active:scale-95"
        @click="onBack"
      >
        <span class="material-symbols-outlined text-on-surface">arrow_back</span>
      </button>
    </div>

    <!-- Content -->
    <div class="flex-1 flex flex-col items-center px-8">
      <!-- Title -->
      <h1 class="font-display text-3xl font-bold text-on-background mt-12 mb-2">
        开启寻薯之旅
      </h1>
      <p class="text-on-surface-variant text-sm mb-10">
        注册即享新季丰收特权
      </p>

      <!-- Form -->
      <div class="w-full flex flex-col gap-4">
        <!-- Phone Input -->
        <div class="flex items-center bg-surface-container-low rounded-2xl px-4 py-3.5 border border-outline-variant focus-within:border-primary-container transition-colors">
          <span class="material-symbols-outlined text-outline mr-3" style="font-size: 22px;">smartphone</span>
          <input
            v-model="phone"
            type="tel"
            placeholder="请输入手机号"
            class="flex-1 bg-transparent text-on-surface text-base placeholder:text-outline outline-none"
          />
        </div>

        <!-- SMS Code Input -->
        <div class="flex items-center bg-surface-container-low rounded-2xl px-4 py-3.5 border border-outline-variant focus-within:border-primary-container transition-colors">
          <span class="material-symbols-outlined text-outline mr-3" style="font-size: 22px;">lock</span>
          <input
            v-model="smsCode"
            type="text"
            placeholder="请输入验证码"
            class="flex-1 bg-transparent text-on-surface text-base placeholder:text-outline outline-none"
          />
          <button
            class="text-primary-container text-sm font-medium whitespace-nowrap ml-2 active:opacity-70 transition-opacity"
            @click="sendCode"
          >
            {{ countdown > 0 ? `${countdown}s` : '获取验证码' }}
          </button>
        </div>

        <!-- Password Input -->
        <div class="flex items-center bg-surface-container-low rounded-2xl px-4 py-3.5 border border-outline-variant focus-within:border-primary-container transition-colors">
          <span class="material-symbols-outlined text-outline mr-3" style="font-size: 22px;">lock</span>
          <input
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            placeholder="请设置登录密码"
            class="flex-1 bg-transparent text-on-surface text-base placeholder:text-outline outline-none"
          />
          <button
            class="ml-2 active:opacity-70 transition-opacity"
            @click="showPassword = !showPassword"
          >
            <span class="material-symbols-outlined text-outline" style="font-size: 22px;">
              {{ showPassword ? 'visibility' : 'visibility_off' }}
            </span>
          </button>
        </div>
      </div>

      <!-- Agreement -->
      <div class="w-full flex items-start gap-2 mt-5">
        <button
          class="w-5 h-5 rounded border-2 flex-shrink-0 flex items-center justify-center mt-0.5 transition-colors"
          :class="agreed ? 'bg-primary-container border-primary-container' : 'border-outline-variant'"
          @click="agreed = !agreed"
        >
          <span v-if="agreed" class="material-symbols-outlined text-white" style="font-size: 14px;">check</span>
        </button>
        <p class="text-xs text-on-surface-variant leading-relaxed">
          我已阅读并同意
          <span class="text-primary-container">《用户协议》</span>
          及
          <span class="text-primary-container">《隐私政策》</span>
        </p>
      </div>

      <!-- Register Button -->
      <button
        class="w-full mt-8 bg-primary-container text-white text-lg font-semibold py-4 rounded-2xl shadow-md active:scale-[0.98] transition-transform hover:bg-primary"
        @click="handleRegister"
      >
        立即注册
      </button>

      <!-- Login Link -->
      <button
        class="mt-6 mb-8 text-sm text-on-surface-variant active:opacity-70 transition-opacity"
        @click="onLogin"
      >
        已有账号？
        <span class="text-primary-container font-medium">直接登录</span>
      </button>
    </div>
  </div>
</template>
