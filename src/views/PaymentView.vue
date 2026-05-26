<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { supabase } from '../utils/supabase'
import { useToast } from '../composables/useToast'

const route = useRoute()
const router = useRouter()
const { show: showToast } = useToast()

const orderNo = route.params.orderNo
const amount = route.query.amount || '0.00'
const order = ref(null)
const paying = ref(false)
const remaining = ref(1800) // 30分钟 = 1800秒
let timer = null

const formatTime = (seconds) => {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

const isExpired = computed(() => remaining.value <= 0)

// 从数据库获取订单
onMounted(async () => {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('order_number', orderNo)
    .maybeSingle()
  if (error || !data) {
    showToast('订单不存在')
    router.replace('/orders')
    return
  }
  order.value = data

  // 如果已经不是待付款状态，直接跳订单列表
  if (data.status !== 'pending_payment') {
    router.replace('/orders')
    return
  }

  // 计算剩余时间：created_at + 30分钟 - 当前时间
  const createdAt = new Date(data.created_at).getTime()
  const expireAt = createdAt + 30 * 60 * 1000
  const now = Date.now()
  const remainingSec = Math.max(0, Math.floor((expireAt - now) / 1000))
  remaining.value = remainingSec

  if (remainingSec <= 0) {
    handleAutoCancel()
    return
  }

  // 启动倒计时
  timer = setInterval(() => {
    remaining.value--
    if (remaining.value <= 0) {
      clearInterval(timer)
      handleAutoCancel()
    }
  }, 1000)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})

// 超时自动取消
const handleAutoCancel = async () => {
  if (timer) clearInterval(timer)
  await supabase
    .from('orders')
    .update({ status: 'cancelled' })
    .eq('order_number', orderNo)
    .eq('status', 'pending_payment')
  showToast('订单已超时取消')
  router.replace('/orders')
}

// 模拟支付
const handlePay = async () => {
  paying.value = true
  // 模拟支付延迟 1.5秒
  await new Promise(resolve => setTimeout(resolve, 1500))

  const { data, error } = await supabase
    .from('orders')
    .update({ status: 'pending_shipment' })
    .eq('order_number', orderNo)
    .select()

  paying.value = false

  if (error) {
    console.error('支付更新失败:', error)
    showToast('支付失败，请重试')
    return
  }
  console.log('支付成功，订单状态已更新:', data)

  router.replace({ path: '/payment-success', query: { order_no: orderNo, amount } })
}

// 取消订单
const handleCancel = async () => {
  const { error } = await supabase
    .from('orders')
    .update({ status: 'cancelled' })
    .eq('order_number', orderNo)
  if (error) {
    showToast('取消失败，请重试')
    return
  }
  showToast('订单已取消')
  router.replace('/orders')
}
</script>

<template>
  <div class="min-h-screen bg-background text-on-surface">
    <!-- Header -->
    <div class="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-outline-variant/30">
      <div class="flex items-center justify-between px-4 h-14 max-w-lg mx-auto">
        <button class="p-2 active:scale-95 transition-transform" @click="router.replace('/orders')">
          <span class="material-symbols-outlined text-on-surface">arrow_back</span>
        </button>
        <h1 class="font-headline text-base font-bold text-on-surface">待付款</h1>
        <div class="w-10"></div>
      </div>
    </div>

    <div class="max-w-lg mx-auto px-4 py-6">
      <!-- 倒计时 -->
      <div class="bg-surface-container-lowest rounded-xl p-5 mb-6 border border-outline-variant/30 text-center">
        <span class="material-symbols-outlined text-primary mb-2" style="font-size: 40px;">schedule</span>
        <p class="font-body text-sm text-on-surface-variant mb-2">请在以下时间前完成支付</p>
        <p class="font-headline text-3xl font-bold" :class="remaining < 300 ? 'text-error' : 'text-primary'">
          {{ formatTime(remaining) }}
        </p>
        <p v-if="remaining < 300" class="font-body text-xs text-error mt-2">即将超时，请尽快支付</p>
      </div>

      <!-- 订单金额 -->
      <div class="bg-surface-container-lowest rounded-xl p-5 mb-6 border border-outline-variant/30">
        <div class="flex items-center justify-between py-2 border-b border-outline-variant/20">
          <span class="font-body text-sm text-on-surface-variant">订单编号</span>
          <span class="font-body text-sm text-on-surface">{{ orderNo }}</span>
        </div>
        <div class="flex items-center justify-between py-2">
          <span class="font-body text-sm text-on-surface-variant">支付金额</span>
          <span class="text-error font-bold text-xl">¥{{ amount }}</span>
        </div>
      </div>

      <!-- 支付方式 -->
      <div class="bg-surface-container-lowest rounded-xl p-5 mb-8 border border-outline-variant/30">
        <p class="font-label text-sm text-on-surface-variant mb-3">支付方式</p>
        <div class="flex items-center gap-3 p-3 rounded-lg bg-primary/5 border border-primary/20">
          <span class="material-symbols-outlined text-primary">account_balance_wallet</span>
          <span class="font-body text-sm text-on-surface">模拟支付（演示）</span>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="flex flex-col gap-3">
        <button
          class="w-full py-4 rounded-xl bg-primary text-on-primary font-bold text-base shadow-[0_4px_20px_rgba(194,101,42,0.2)] active:scale-[0.98] transition-transform disabled:opacity-50 flex items-center justify-center gap-2"
          :disabled="paying || isExpired"
          @click="handlePay"
        >
          <span v-if="paying" class="material-symbols-outlined animate-spin" style="font-size: 20px;">progress_activity</span>
          <span>{{ paying ? '支付中...' : '确认支付 ¥' + amount }}</span>
        </button>
        <button
          class="w-full py-4 rounded-xl border-2 border-outline-variant text-on-surface-variant font-bold bg-transparent active:scale-[0.98] transition-transform"
          :disabled="paying"
          @click="handleCancel"
        >
          取消订单
        </button>
      </div>
    </div>
  </div>
</template>
