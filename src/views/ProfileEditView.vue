<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'
import { useToast } from '../composables/useToast'
import { supabase } from '../utils/supabase'

const router = useRouter()
const { user } = useAuth()
const { show: showToast } = useToast()

const nickname = ref('')
const email = ref('')
const saving = ref(false)

onMounted(() => {
  if (user.value) {
    nickname.value = user.value.user_metadata?.nickname || user.value.email?.split('@')[0] || ''
    email.value = user.value.email || ''
  }
})

const handleSave = async () => {
  if (!nickname.value.trim()) {
    showToast('昵称不能为空')
    return
  }
  saving.value = true
  try {
    const { error } = await supabase.auth.updateUser({
      data: { nickname: nickname.value.trim() }
    })
    if (error) throw error
    showToast('保存成功')
    router.back()
  } catch (err) {
    showToast('保存失败')
    console.error('Failed to update profile:', err)
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-background text-on-surface">
    <!-- Header -->
    <div class="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-outline-variant/30">
      <div class="flex items-center justify-between px-4 h-14 max-w-lg mx-auto">
        <button class="p-2" @click="router.back()"><span class="material-symbols-outlined">arrow_back</span></button>
        <h1 class="font-headline text-base font-bold">个人资料</h1>
        <button class="p-2 text-primary font-label text-sm font-medium bg-transparent border-none" @click="handleSave" :disabled="saving">
          {{ saving ? '保存中...' : '保存' }}
        </button>
      </div>
    </div>

    <main class="max-w-lg mx-auto px-4 py-6">
      <!-- Avatar -->
      <div class="flex flex-col items-center mb-8">
        <div class="w-20 h-20 rounded-full bg-primary-container flex items-center justify-center text-on-primary mb-3">
          <span class="material-symbols-outlined" style="font-size: 40px;">person</span>
        </div>
        <span class="font-label text-xs text-on-surface-variant">头像暂不支持修改</span>
      </div>

      <!-- Form -->
      <div class="bg-surface-container-lowest rounded-xl border border-outline-variant/30 overflow-hidden">
        <div class="flex items-center px-4 py-4 border-b border-outline-variant/20">
          <span class="font-body text-sm text-on-surface-variant w-16">昵称</span>
          <input v-model="nickname" class="flex-1 bg-transparent border-none outline-none font-body text-sm text-on-surface placeholder:text-outline" placeholder="请输入昵称" maxlength="20" />
        </div>
        <div class="flex items-center px-4 py-4">
          <span class="font-body text-sm text-on-surface-variant w-16">邮箱</span>
          <span class="flex-1 font-body text-sm text-on-surface-variant">{{ email }}</span>
        </div>
      </div>

      <p class="font-body text-[11px] text-outline mt-4 text-center">邮箱为账号信息，暂不支持修改</p>
    </main>
  </div>
</template>
