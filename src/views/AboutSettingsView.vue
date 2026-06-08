<script setup>
import { useRouter } from 'vue-router'
import SettingsPageShell from '../components/settings/SettingsPageShell.vue'
import SettingsSection from '../components/settings/SettingsSection.vue'
import SettingsRow from '../components/settings/SettingsRow.vue'

const router = useRouter()
</script>

<template>
  <SettingsPageShell title="关于薯鲜生">
    <div class="settings-card theme-card rounded-2xl border theme-border p-6 mb-6 text-center">
      <img src="/logo.png" alt="薯鲜生" class="w-20 h-20 mx-auto rounded-2xl object-contain mb-4" />
      <h2 class="font-headline text-2xl font-bold theme-text">薯鲜生</h2>
      <p class="text-xs theme-text-secondary mt-1">v1.2.0</p>
      <p class="text-sm leading-7 theme-text-secondary mt-4">
        专注新鲜薯类与产地好物，把来自黄金产区的安心食材送到家。
      </p>
    </div>

    <SettingsSection title="服务承诺">
      <SettingsRow icon="eco" label="产地直供" description="优选核心产区，减少中间流转" />
      <div class="h-px mx-4" style="background: var(--theme-card-border);"></div>
      <SettingsRow icon="local_shipping" label="及时配送" description="订单进度清晰可见，配送信息及时更新" />
      <div class="h-px mx-4" style="background: var(--theme-card-border);"></div>
      <SettingsRow icon="verified" label="品质售后" description="发现质量问题可联系售后处理" />
    </SettingsSection>

    <SettingsSection title="支持">
      <SettingsRow icon="support_agent" label="帮助中心" description="常见问题、配送与售后说明" clickable show-chevron @click="router.push('/help')" />
    </SettingsSection>
  </SettingsPageShell>
</template>
