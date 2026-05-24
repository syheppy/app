<script setup>
import { ref } from 'vue'

defineProps({
  onBack: { type: Function, default: () => {} },
  onRegister: { type: Function, default: () => {} },
  onForgotPassword: { type: Function, default: () => {} }
})

const phone = ref('')
const password = ref('')
const smsCode = ref('')
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

const handleLogin = () => {
  // TODO: login logic
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
      <!-- Logo -->
      <div class="mt-8 mb-6 w-20 h-20 rounded-3xl bg-surface-container-high flex items-center justify-center">
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
          <path
            d="M24 42S6 30 6 18C6 10 12 6 18 6C21.6 6 24 8.4 24 8.4S26.4 6 30 6C36 6 42 10 42 18C42 30 24 42 24 42Z"
            stroke="#c2652a"
            stroke-width="2.5"
            fill="none"
          />
          <path
            d="M24 42V18"
            stroke="#7a9a6d"
            stroke-width="2"
          />
          <path
            d="M24 28C28 24 32 26 30 30"
            stroke="#7a9a6d"
            stroke-width="2"
            fill="none"
          />
          <path
            d="M24 22C20 18 16 20 18 24"
            stroke="#7a9a6d"
            stroke-width="2"
            fill="none"
          />
        </svg>
      </div>

      <!-- Title -->
      <h1 class="font-display text-3xl font-bold text-on-background mb-2">
        欢迎回到薯鲜生
      </h1>
      <p class="text-on-surface-variant text-sm mb-10">
        寻味大地，遇见纯粹
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

        <!-- Password / SMS Code Input -->
        <div class="flex items-center bg-surface-container-low rounded-2xl px-4 py-3.5 border border-outline-variant focus-within:border-primary-container transition-colors">
          <span class="material-symbols-outlined text-outline mr-3" style="font-size: 22px;">lock</span>
          <input
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            placeholder="请输入验证码/密码"
            class="flex-1 bg-transparent text-on-surface text-base placeholder:text-outline outline-none"
          />
          <button
            class="text-primary-container text-sm font-medium whitespace-nowrap ml-2 active:opacity-70 transition-opacity"
            @click="sendCode"
          >
            {{ countdown > 0 ? `${countdown}s` : '获取验证码' }}
          </button>
        </div>
      </div>

      <!-- Login Button -->
      <button
        class="w-full mt-8 bg-primary-container text-white text-lg font-semibold py-4 rounded-2xl shadow-md active:scale-[0.98] transition-transform hover:bg-primary"
        @click="handleLogin"
      >
        登录
      </button>

      <!-- Bottom Links -->
      <div class="w-full flex justify-between mt-5 px-1">
        <button
          class="text-on-surface-variant text-sm active:opacity-70 transition-opacity"
          @click="onForgotPassword"
        >
          忘记密码
        </button>
        <button
          class="text-on-surface-variant text-sm active:opacity-70 transition-opacity"
          @click="onRegister"
        >
          新用户注册
        </button>
      </div>

      <!-- Divider -->
      <div class="w-full flex items-center gap-4 mt-12">
        <div class="flex-1 h-px bg-outline-variant"></div>
        <span class="text-outline text-xs">其他登录方式</span>
        <div class="flex-1 h-px bg-outline-variant"></div>
      </div>

      <!-- Social Login -->
      <div class="flex gap-6 mt-6 mb-8">
        <button class="w-12 h-12 rounded-full bg-[#07C160] flex items-center justify-center shadow-sm active:scale-95 transition-transform">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
            <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.986a.96.96 0 0 1 0 1.92.96.96 0 0 1 0-1.92zm5.812 0a.96.96 0 0 1 0 1.92.96.96 0 0 1 0-1.92z"/>
            <path d="M23.926 14.393c0-3.2-3.095-5.793-6.907-5.793-3.812 0-6.907 2.593-6.907 5.793 0 3.2 3.095 5.793 6.907 5.793.77 0 1.51-.112 2.194-.316a.72.72 0 0 1 .595.082l1.578.924a.272.272 0 0 0 .14.046c.133 0 .241-.109.241-.244 0-.06-.024-.118-.04-.177l-.324-1.228a.49.49 0 0 1 .177-.552c1.52-1.122 2.346-2.758 2.346-4.327zm-9.53-1.2a.8.8 0 0 1 0-1.6.8.8 0 0 1 0 1.6zm5.246 0a.8.8 0 0 1 0-1.6.8.8 0 0 1 0 1.6z"/>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>
