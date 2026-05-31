<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'

const router = useRouter()
const goBack = () => {
  if (window.history.length > 1) router.back()
  else router.push('/')
}
const { signIn } = useAuth()

const email = ref('')
const password = ref('')
const loading = ref(false)
const errorMsg = ref('')

const handleLogin = async () => {
  if (!email.value || !password.value) return
  loading.value = true
  errorMsg.value = ''
  const { data, error } = await signIn(email.value, password.value)
  loading.value = false
  if (error) {
    console.error('Login error:', error)
    if (error.message === 'Invalid login credentials') {
      errorMsg.value = '邮箱或密码错误，请先注册账号'
    } else if (error.message.includes('Email not confirmed')) {
      errorMsg.value = '请先确认邮箱后再登录'
    } else {
      errorMsg.value = error.message
    }
  } else {
    router.push('/')
  }
}
</script>

<template>
  <div class="theme-bg theme-text min-h-screen flex flex-col items-center justify-center antialiased relative overflow-hidden">
    <div class="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
      <div class="absolute -top-40 -right-40 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
      <div class="absolute bottom-20 -left-20 w-72 h-72 bg-tertiary/5 rounded-full blur-3xl"></div>
    </div>

    <header class="w-full absolute top-0 left-0 flex items-center justify-between px-6 py-4 max-w-md mx-auto right-0">
      <button @click="goBack" class="w-10 h-10 flex items-center justify-center rounded-full text-on-surface-variant hover:bg-surface-variant/50 transition-colors">
        <span class="material-symbols-outlined text-2xl">arrow_back</span>
      </button>
    </header>

    <main class="w-full max-w-md px-8 py-12 flex flex-col relative z-10">
      <div class="text-center mb-16 space-y-4">
        <div class="w-16 h-16 mx-auto mb-6 rounded-2xl shadow-[0_2px_16px_rgba(58,48,42,0.04)] flex items-center justify-center text-primary relative overflow-hidden" style="background: var(--theme-card-border);">
          <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCF4qHNfzJpcSdpOniUs0OQegl5xsf1GIBK3puvU9Wf4W565SSz7OwfoaS7Wi2tNMom1wQahOkDyeYVPZxnuoIVBb_ijhk0TE--MkraA_KxKz-Rfh4xw3ZmLVgwsCU1sCL-h0f7XjLfSpQFyviYw567XT13A5QQ2PTBSDPM84f1JwQuYNZtnF8mWu4sZh6pQ8U_bqq34P4PdC75U-gQWSdAhb6dY4kvzEsokx-aMG38x_YeYnvCIMVRIArRyl0EJOr3Vr-6XeTzq7GU" class="w-full h-full object-contain p-2" alt="薯鲜生 logo" />
        </div>
        <h1 class="font-headline text-4xl text-on-surface leading-tight tracking-tight font-bold">欢迎回到薯鲜生</h1>
        <p class="font-body text-on-surface-variant text-base tracking-wide font-light">寻味大地，遇见纯粹</p>
      </div>

      <form class="space-y-6 w-full flex flex-col" @submit.prevent="handleLogin">
        <div class="space-y-4">
          <div class="relative group">
            <div class="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none theme-text-secondary group-focus-within:text-primary transition-colors">
              <span class="material-symbols-outlined text-[20px]">mail</span>
            </div>
            <input v-model="email" class="w-full pl-12 pr-4 py-4 theme-card border rounded-xl theme-text font-body placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300 shadow-[0_2px_16px_rgba(58,48,42,0.02)]" style="border-color: var(--theme-card-border);" placeholder="请输入邮箱" required type="email" />
          </div>

          <div class="relative group">
            <div class="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none theme-text-secondary group-focus-within:text-primary transition-colors">
              <span class="material-symbols-outlined text-[20px]">lock</span>
            </div>
            <input v-model="password" class="w-full pl-12 pr-4 py-4 theme-card border rounded-xl theme-text font-body placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300 shadow-[0_2px_16px_rgba(58,48,42,0.02)]" style="border-color: var(--theme-card-border);" placeholder="请输入密码" required type="password" />
          </div>
        </div>

        <p v-if="errorMsg" class="text-error text-sm text-center">{{ errorMsg }}</p>

        <button :disabled="loading" class="w-full bg-primary text-on-primary font-label text-lg tracking-wide py-4 rounded-xl shadow-[0_4px_20px_rgba(194,101,42,0.2)] hover:bg-primary-container hover:shadow-[0_6px_24px_rgba(194,101,42,0.3)] hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-300 mt-4 cursor-pointer disabled:opacity-50" type="submit">
          {{ loading ? '登录中...' : '登录' }}
        </button>
      </form>

      <div class="flex items-center justify-between mt-8 text-sm font-label text-on-surface-variant px-2">
        <button class="hover:text-primary hover:underline underline-offset-4 decoration-primary/30 transition-all bg-transparent border-none cursor-pointer p-0">忘记密码</button>
        <router-link to="/register" class="hover:text-primary hover:underline underline-offset-4 decoration-primary/30 transition-all">新用户注册</router-link>
      </div>

      <div class="mt-16 flex flex-col items-center">
        <div class="relative w-full flex items-center justify-center mb-8">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-outline-variant/40"></div>
          </div>
          <div class="relative bg-background px-4 text-xs font-label text-outline tracking-wider uppercase">
            其他登录方式
          </div>
        </div>
        <button aria-label="Login with WeChat" class="w-14 h-14 rounded-full theme-card shadow-[0_2px_16px_rgba(58,48,42,0.04)] flex items-center justify-center text-[#07C160] hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer" style="border: 1px solid var(--theme-card-border);">
          <svg class="w-7 h-7" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M8.5 6C4.4 6 1 8.8 1 12.3c0 2 1.1 3.8 2.9 4.9L3.1 19.8l2.9-1.4c.8.2 1.6.3 2.5.3 4.1 0 7.5-2.8 7.5-6.3S12.6 6 8.5 6zm-1.8 4.3c.5 0 .9.4.9.9s-.4.9-.9.9-.9-.4-.9-.9.4-.9.9-.9zm3.5 0c.5 0 .9.4.9.9s-.4.9-.9.9-.9-.4-.9-.9.4-.9.9-.9z"></path>
            <path d="M17.5 11c-3.6 0-6.5 2.4-6.5 5.3 0 1.7 1 3.2 2.5 4.2l-.7 2.1 2.5-1.2c.7.2 1.4.3 2.2.3 3.6 0 6.5-2.4 6.5-5.3S21.1 11 17.5 11zm-2 3.8c-.4 0-.7-.3-.7-.7s.3-.7.7-.7.7.3.7.7-.3.7-.7.7zm4 0c-.4 0-.7-.3-.7-.7s.3-.7.7-.7.7.3.7.7-.3.7-.7.7z"></path>
          </svg>
        </button>
      </div>
    </main>
  </div>
</template>
