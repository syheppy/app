<script setup>
import SettingsPageShell from '../components/settings/SettingsPageShell.vue'
import SettingsDocument from '../components/settings/SettingsDocument.vue'

const sections = [
  {
    title: '服务范围',
    body: '薯鲜生为用户提供商品浏览、购物车、订单提交、支付模拟、配送信息展示和售后协助等服务。具体服务内容会根据业务发展持续优化。'
  },
  {
    title: '账号使用',
    body: '用户应妥善保管登录信息，不得将账号转让、出租或用于违反法律法规的行为。因用户主动泄露账号信息造成的损失，由用户自行承担。'
  },
  {
    title: '下单与支付',
    body: '用户提交订单前应确认商品、数量、价格、收货地址和联系方式。订单支付完成后，系统会根据库存和配送条件安排履约。'
  },
  {
    title: '配送与售后',
    body: '生鲜类商品受产地、天气和配送条件影响，如出现质量问题，请在合理时间内联系客服并提供订单信息和商品照片。'
  },
  {
    title: '用户责任',
    body: '用户不得提交虚假订单、恶意评价、干扰平台运行，或以任何方式损害其他用户、商家和平台权益。'
  },
  {
    title: '协议更新',
    body: '平台可能根据服务变化更新本协议。更新后的协议会在应用内展示，用户继续使用服务即表示接受更新后的内容。'
  }
]
</script>

<template>
  <SettingsPageShell title="用户协议">
    <SettingsDocument
      updated-at="2026-06-08"
      intro="欢迎使用薯鲜生。本协议用于说明用户与薯鲜生之间关于应用服务使用的基本约定。"
      :sections="sections"
    />
  </SettingsPageShell>
</template>
