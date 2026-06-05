<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'
import { supabase } from '../utils/supabase'

const router = useRouter()
const { signUp } = useAuth()
const goBack = () => {
  if (window.history.length > 1) router.back()
  else router.push('/')
}

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const loading = ref(false)
const errorMsg = ref('')
const agreed = ref(false)

const handleRegister = async () => {
  if (!email.value || !password.value || !agreed.value) return
  loading.value = true
  errorMsg.value = ''
  const { data, error } = await signUp(email.value, password.value)
  loading.value = false
  if (error) {
    console.error('Register error:', error)
    errorMsg.value = error.message === 'User already registered' ? '该邮箱已注册，请直接登录' : error.message
  } else if (data.session) {
    // 注册成功且自动登录，发放 3 张新人包邮券
    await grantWelcomeCoupons(data.session.user.id)
    router.push('/')
  } else {
    // 注册成功但需要邮箱确认
    errorMsg.value = '注册成功！请检查邮箱确认后再登录'
  }
}

const grantWelcomeCoupons = async (userId) => {
  const expiryDate = new Date()
  expiryDate.setMonth(expiryDate.getMonth() + 1) // 1个月过期

  const coupons = Array.from({ length: 3 }, () => ({
    user_id: userId,
    type: 'shipping',
    value: 0,
    condition: '无门槛',
    title: '新人包邮券',
    tag: '新人专享',
    description: '新用户注册即可享受免运费优惠',
    status: 'unused',
    expiry: expiryDate.toISOString().split('T')[0]
  }))

  await supabase.from('coupons').insert(coupons)
}
</script>

<template>
  <div class="min-h-screen flex flex-col items-center justify-center font-body antialiased" style="background-color: var(--color-background); color: var(--color-on-background);">
    <main class="w-full max-w-md mx-auto px-6 py-12 md:py-24 flex flex-col relative h-full min-h-screen">
      <header class="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-10">
        <button @click="goBack" class="p-2 -ml-2 text-on-surface-variant hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary rounded-full group bg-transparent border-none cursor-pointer">
          <span class="material-symbols-outlined text-2xl group-hover:-translate-x-1 transition-transform">arrow_back</span>
        </button>
      </header>

      <div class="flex-grow flex flex-col justify-center mt-12 mb-8">
        <div class="mb-12 text-center md:text-left">
          <h1 class="font-headline text-4xl md:text-5xl font-semibold text-on-surface mb-3 tracking-tight leading-tight">开启寻薯之旅</h1>
          <p class="text-on-surface-variant text-base md:text-lg font-medium opacity-90">注册即享新季丰收特权</p>
        </div>

        <form class="space-y-6" @submit.prevent="handleRegister">
          <div class="relative">
            <label class="sr-only" for="reg-email">邮箱</label>
            <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <span class="material-symbols-outlined text-on-surface-variant text-lg">mail</span>
            </div>
            <input v-model="email" id="reg-email" type="email" placeholder="请输入邮箱" class="block w-full pl-12 pr-4 py-4 theme-card border rounded-lg theme-text placeholder:text-on-surface-variant/70 focus:ring-1 focus:ring-primary focus:border-primary transition-colors duration-200 text-base outline-none" style="border-color: var(--theme-card-border);" required />
          </div>

          <div class="relative">
            <label class="sr-only" for="reg-password">设置密码</label>
            <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <span class="material-symbols-outlined text-on-surface-variant text-lg">lock</span>
            </div>
            <input v-model="password" id="reg-password" :type="showPassword ? 'text' : 'password'" placeholder="请设置登录密码（至少6位）" class="block w-full pl-12 pr-12 py-4 theme-card border rounded-lg theme-text placeholder:text-on-surface-variant/70 focus:ring-1 focus:ring-primary focus:border-primary transition-colors duration-200 text-base outline-none" style="border-color: var(--theme-card-border);" required minlength="6" autoComplete="new-password" />
            <button type="button" @click="showPassword = !showPassword" class="absolute inset-y-0 right-0 pr-4 flex items-center text-on-surface-variant hover:text-on-surface outline-none cursor-pointer bg-transparent border-none">
              <span class="material-symbols-outlined text-lg">{{ showPassword ? 'visibility' : 'visibility_off' }}</span>
            </button>
          </div>

          <div class="flex items-start mt-6">
            <div class="flex items-center h-5">
              <input v-model="agreed" type="checkbox" id="terms" class="h-4 w-4 text-primary theme-card border-outline-variant/60 rounded focus:ring-primary focus:ring-2 accent-[#c2652a] cursor-pointer mt-0.5" required />
            </div>
            <div class="ml-3 text-sm">
              <label for="terms" class="font-medium text-on-surface-variant cursor-pointer">
                我已阅读并同意 <a href="#user-agreement" class="text-primary hover:underline hover:text-primary-container transition-colors">《用户协议》</a> 及 <a href="#privacy-policy" class="text-primary hover:underline hover:text-primary-container transition-colors">《隐私政策》</a>
              </label>
            </div>
          </div>

          <p v-if="errorMsg" class="text-error text-sm text-center">{{ errorMsg }}</p>

          <div class="pt-4">
            <button :disabled="loading" type="submit" class="w-full flex justify-center py-4 px-4 border border-transparent rounded-lg shadow-sm text-base font-semibold text-on-primary bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary focus:ring-offset-background transition-all duration-200 active:scale-[0.98] cursor-pointer disabled:opacity-50">
              {{ loading ? '注册中...' : '立即注册' }}
            </button>
          </div>
        </form>

        <div class="mt-8 text-center">
          <p class="text-sm text-on-surface-variant">
            已有账号？
            <router-link to="/login" class="font-medium text-primary hover:text-primary-container hover:underline transition-colors">直接登录</router-link>
          </p>
        </div>
      </div>
    </main>
  </div>
</template>
