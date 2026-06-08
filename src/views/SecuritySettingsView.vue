<script setup>
import { computed } from 'vue'
import { useAuth } from '../composables/useAuth'
import { useToast } from '../composables/useToast'
import SettingsPageShell from '../components/settings/SettingsPageShell.vue'
import SettingsSection from '../components/settings/SettingsSection.vue'
import SettingsRow from '../components/settings/SettingsRow.vue'

const { user } = useAuth()
const { show: showToast } = useToast()

const email = computed(() => user.value?.email || '未登录')
const accountName = computed(() => user.value?.user_metadata?.nickname || user.value?.email?.split('@')[0] || '薯鲜生用户')

const showComingSoon = () => {
  showToast('功能建设中')
}
</script>

<template>
  <SettingsPageShell title="账号与安全" subtitle="管理账号登录信息，并查看基础安全建议。">
    <div class="settings-card theme-card rounded-2xl border theme-border p-4 mb-6">
      <div class="flex items-center gap-3">
        <div class="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
          <span class="material-symbols-outlined text-primary" style="font-size: 28px; font-variation-settings: 'FILL' 1;" aria-hidden="true">shield_person</span>
        </div>
        <div class="min-w-0 flex-1">
          <h2 class="font-headline text-xl font-bold theme-text truncate">{{ accountName }}</h2>
          <p class="text-xs theme-text-secondary truncate">{{ email }}</p>
        </div>
        <span class="text-[10px] px-2 py-1 rounded-full bg-primary/10 text-primary font-bold">已保护</span>
      </div>
    </div>

    <SettingsSection title="账号安全">
      <SettingsRow icon="mail" label="邮箱账号" :value="email" />
      <div class="h-px mx-4" style="background: var(--theme-card-border);"></div>
      <SettingsRow icon="password" label="登录密码" description="建议定期更新密码，保护账号安全" value="建议更新" clickable show-chevron @click="showComingSoon" />
      <div class="h-px mx-4" style="background: var(--theme-card-border);"></div>
      <SettingsRow icon="phone_iphone" label="手机号绑定" description="用于订单配送和安全验证" value="未绑定" clickable show-chevron @click="showComingSoon" />
    </SettingsSection>

    <SettingsSection title="设备与建议">
      <SettingsRow icon="devices" label="当前设备" description="当前浏览器会话已登录" value="正常" />
      <div class="h-px mx-4" style="background: var(--theme-card-border);"></div>
      <SettingsRow icon="health_and_safety" label="安全建议" description="不要向他人透露验证码和登录信息" />
    </SettingsSection>
  </SettingsPageShell>
</template>
