<script setup>
import { ref } from 'vue'
import SettingsPageShell from '../components/settings/SettingsPageShell.vue'
import SettingsSection from '../components/settings/SettingsSection.vue'
import SettingsSwitchRow from '../components/settings/SettingsSwitchRow.vue'

const orderNotice = ref(true)
const deliveryNotice = ref(true)
const promoNotice = ref(false)
const restockNotice = ref(true)
const systemNotice = ref(true)

const loadNotificationSettings = () => ({
  orderNotice,
  deliveryNotice,
  promoNotice,
  restockNotice,
  systemNotice
})

const saveNotificationSettings = () => loadNotificationSettings()
</script>

<template>
  <SettingsPageShell title="消息通知" subtitle="先在本地调整通知偏好，后续可同步到账号。">
    <SettingsSection title="订单消息">
      <SettingsSwitchRow v-model="orderNotice" icon="receipt_long" label="订单通知" description="下单、支付、退款等订单状态变化" />
      <div class="h-px mx-4" style="background: var(--theme-card-border);"></div>
      <SettingsSwitchRow v-model="deliveryNotice" icon="local_shipping" label="配送提醒" description="发货、配送中、即将送达等提醒" />
    </SettingsSection>

    <SettingsSection title="活动与系统">
      <SettingsSwitchRow v-model="promoNotice" icon="sell" label="优惠活动" description="优惠券、满减、限时活动提醒" />
      <div class="h-px mx-4" style="background: var(--theme-card-border);"></div>
      <SettingsSwitchRow v-model="restockNotice" icon="inventory_2" label="补货提醒" description="收藏商品重新到货时通知我" />
      <div class="h-px mx-4" style="background: var(--theme-card-border);"></div>
      <SettingsSwitchRow v-model="systemNotice" icon="campaign" label="系统消息" description="服务变更和重要公告" />
    </SettingsSection>

    <p class="text-[11px] leading-relaxed theme-text-secondary px-1">
      当前设置保存在本地页面状态中，接入后端后会同步到账号。
    </p>
  </SettingsPageShell>
</template>
