<script setup>
import SettingsPageShell from '../components/settings/SettingsPageShell.vue'
import SettingsDocument from '../components/settings/SettingsDocument.vue'

const sections = [
  {
    title: '我们收集的信息',
    body: '为了完成账号登录、商品购买、订单配送和售后服务，我们可能收集昵称、邮箱、收货地址、联系方式、订单记录和必要的设备运行信息。'
  },
  {
    title: '信息使用方式',
    body: '相关信息会用于身份识别、订单履约、配送通知、售后沟通、服务优化和安全风控。未经用户同意，我们不会将个人信息用于与服务无关的用途。'
  },
  {
    title: '存储与保护',
    body: '我们会采取合理的技术和管理措施保护用户信息，减少未经授权访问、泄露、篡改或丢失的风险。'
  },
  {
    title: '第三方服务',
    body: '在支付、地图、配送或客服能力接入时，可能需要与必要的第三方服务共享完成服务所需的信息。共享范围会控制在实现服务目的所需的最小范围内。'
  },
  {
    title: '用户权利',
    body: '用户可以查看和更正账号资料。后续接入数据管理能力后，用户可申请导出或删除相关个人数据。'
  },
  {
    title: '联系我们',
    body: '如对隐私政策或个人信息处理有疑问，可通过帮助中心或客服入口联系我们。'
  }
]
</script>

<template>
  <SettingsPageShell title="隐私政策">
    <SettingsDocument
      updated-at="2026-06-08"
      intro="薯鲜生重视用户隐私。本政策说明我们如何收集、使用、存储和保护与你相关的信息。"
      :sections="sections"
    />
  </SettingsPageShell>
</template>
