<script setup>
import { ref } from 'vue'
import { useToast } from '../composables/useToast'
import SettingsPageShell from '../components/settings/SettingsPageShell.vue'
import SettingsSection from '../components/settings/SettingsSection.vue'
import SettingsRow from '../components/settings/SettingsRow.vue'
import SettingsSwitchRow from '../components/settings/SettingsSwitchRow.vue'

const { show: showToast } = useToast()

const personalized = ref(true)
const locationUsage = ref(true)
const browsingHistory = ref(true)

const loadPrivacySettings = () => ({ personalized, locationUsage, browsingHistory })
const savePrivacySettings = () => loadPrivacySettings()
const showDataNotice = () => showToast('数据管理功能建设中')
</script>

<template>
  <SettingsPageShell title="隐私设置" subtitle="控制个性化、位置和浏览记录等数据使用方式。">
    <SettingsSection title="数据使用">
      <SettingsSwitchRow v-model="personalized" icon="recommend" label="个性化推荐" description="根据浏览和购买偏好推荐商品" />
      <div class="h-px mx-4" style="background: var(--theme-card-border);"></div>
      <SettingsSwitchRow v-model="locationUsage" icon="location_on" label="位置服务" description="用于估算配送范围和到达时间" />
      <div class="h-px mx-4" style="background: var(--theme-card-border);"></div>
      <SettingsSwitchRow v-model="browsingHistory" icon="history" label="浏览记录" description="保留最近看过的商品，方便再次购买" />
    </SettingsSection>

    <SettingsSection title="数据管理">
      <SettingsRow icon="database" label="个人数据管理" description="查看、导出或删除账号相关数据" clickable show-chevron @click="showDataNotice" />
    </SettingsSection>

    <div class="settings-card theme-card rounded-2xl border theme-border p-4">
      <h2 class="font-headline text-lg font-bold theme-text mb-2">隐私说明</h2>
      <p class="text-sm leading-7 theme-text-secondary">
        薯鲜生只会在提供订单、配送和售后服务所需的范围内使用信息。完整说明可在隐私政策页面查看。
      </p>
    </div>
  </SettingsPageShell>
</template>
