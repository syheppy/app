<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'
import { useToast } from '../composables/useToast'
import { supabase } from '../utils/supabase'
import SettingsPageShell from '../components/settings/SettingsPageShell.vue'
import SettingsSection from '../components/settings/SettingsSection.vue'
import SettingsRow from '../components/settings/SettingsRow.vue'

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
  <SettingsPageShell title="个人资料">
    <template #action>
      <button
        class="px-2 py-1 text-primary font-label text-sm font-bold bg-transparent border-none disabled:opacity-50"
        :disabled="saving"
        @click="handleSave"
      >
        {{ saving ? '保存中' : '保存' }}
      </button>
    </template>

    <div class="flex flex-col items-center mb-6">
      <div class="w-[88px] h-[88px] rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mb-3">
        <span class="material-symbols-outlined text-primary/70" style="font-size: 44px;" aria-hidden="true">person</span>
      </div>
      <p class="text-xs theme-text-secondary">头像暂不支持修改</p>
    </div>

    <SettingsSection title="账号信息">
      <div class="px-4 py-4 border-b theme-border">
        <label class="block text-xs font-bold text-primary mb-2">昵称</label>
        <input
          v-model="nickname"
          class="w-full bg-transparent border-none outline-none font-body text-sm theme-text placeholder:text-outline"
          placeholder="请输入昵称"
          maxlength="20"
        />
      </div>
      <SettingsRow icon="mail" label="邮箱" :value="email" />
      <div class="h-px mx-4" style="background: var(--theme-card-border);"></div>
      <SettingsRow icon="verified" label="会员标识" value="黄金产区直供" />
    </SettingsSection>

    <p class="text-[11px] leading-relaxed theme-text-secondary text-center px-4">
      邮箱为账号登录信息，暂不支持在此页面修改。
    </p>
  </SettingsPageShell>
</template>
