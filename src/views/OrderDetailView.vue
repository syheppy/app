<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { supabase } from '../utils/supabase'
import { useToast } from '../composables/useToast'

const route = useRoute()
const router = useRouter()
const { show: showToast } = useToast()

const order = ref(null)
const loading = ref(true)

const statusLabel = {
  pending_payment: '待付款',
  pending_shipment: '待发货',
  shipped: '物流配送中',
  completed: '已完成',
  cancelled: '已取消'
}

const statusIcon = {
  pending_payment: 'schedule',
  pending_shipment: 'inventory_2',
  shipped: 'local_shipping',
  completed: 'check_circle',
  cancelled: 'cancel'
}

// 倒计时
const now = ref(Date.now())
let tickTimer = null

const getRemaining = () => {
  if (!order.value) return 0
  const expireAt = new Date(order.value.created_at).getTime() + 30 * 60 * 1000
  return Math.max(0, Math.floor((expireAt - now.value) / 1000))
}

const formatRemaining = (seconds) => {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

const payMethod = computed(() => {
  if (!order.value) return ''
  return order.value.payment_method === 'alipay' ? '支付宝' : '微信支付'
})

const fetchOrder = async () => {
  try {
    const orderId = route.params.id
    const { data, error } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .eq('id', orderId)
      .single()

    if (error) throw error
    order.value = data
  } catch (err) {
    console.error('Failed to fetch order:', err)
    showToast('订单加载失败')
  } finally {
    loading.value = false
  }
}

const handleCancelOrder = async () => {
  const { error } = await supabase.from('orders').update({ status: 'cancelled' }).eq('id', order.value.id)
  if (error) {
    showToast('取消失败')
    return
  }
  order.value.status = 'cancelled'
  showToast('订单已取消')
}

const handleConfirmReceipt = async () => {
  const { error } = await supabase.from('orders').update({ status: 'completed' }).eq('id', order.value.id)
  if (error) {
    showToast('操作失败')
    return
  }
  order.value.status = 'completed'
  showToast('已确认收货')
}

const handleGoPay = () => {
  router.push({ path: `/payment/${order.value.order_number}`, query: { amount: Number(order.value.total_amount).toFixed(2) } })
}

onMounted(() => {
  tickTimer = setInterval(() => { now.value = Date.now() }, 1000)
  fetchOrder()
})

onUnmounted(() => {
  if (tickTimer) clearInterval(tickTimer)
})
</script>

<template>
  <div class="min-h-screen theme-bg theme-text">
    <!-- Header -->
    <div class="sticky top-0 z-40 backdrop-blur-md border-b" style="background: color-mix(in srgb, var(--theme-bg) 90%, transparent); border-color: var(--theme-card-border);">
      <div class="flex items-center justify-between px-4 h-14 max-w-lg mx-auto">
        <button class="p-2 active:scale-95 transition-transform" @click="router.back()">
          <span class="material-symbols-outlined text-on-surface">arrow_back</span>
        </button>
        <h1 class="font-headline text-base font-bold text-on-surface">订单详情</h1>
        <div class="w-10"></div>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex items-center justify-center py-20">
      <div class="text-on-surface-variant">加载中...</div>
    </div>

    <div v-else-if="order" class="max-w-lg mx-auto pb-8">
      <!-- Status Banner -->
      <div class="bg-primary text-on-primary px-6 py-6">
        <div class="flex items-center gap-3">
          <span class="material-symbols-outlined text-[32px]" style="font-variation-settings: 'FILL' 1">{{ statusIcon[order.status] || 'help' }}</span>
          <div>
            <h2 class="font-headline text-lg font-bold">{{ statusLabel[order.status] || order.status }}</h2>
            <p v-if="order.status === 'pending_payment'" class="font-body text-sm opacity-80 mt-1">
              请在 {{ formatRemaining(getRemaining()) }} 内完成支付
            </p>
            <p v-else-if="order.status === 'shipped' && order.tracking_number" class="font-body text-sm opacity-80 mt-1">
              快递单号：{{ order.tracking_number }}
            </p>
          </div>
        </div>
      </div>

      <!-- Consignee Info -->
      <div class="theme-card mx-4 mt-4 rounded-xl p-4" style="border: 1px solid var(--theme-card-border);">
        <div class="flex items-start gap-3">
          <span class="material-symbols-outlined text-primary mt-0.5">location_on</span>
          <div class="flex-1">
            <div class="flex items-center gap-2 mb-1">
              <span class="font-headline text-sm font-bold text-on-surface">{{ order.consignee_name }}</span>
              <span class="font-body text-sm text-on-surface-variant">{{ order.consignee_phone }}</span>
            </div>
            <p class="font-body text-sm text-on-surface-variant leading-relaxed">{{ order.consignee_address }}</p>
          </div>
        </div>
      </div>

      <!-- Order Items -->
      <div class="theme-card mx-4 mt-4 rounded-xl overflow-hidden" style="border: 1px solid var(--theme-card-border);">
        <div class="px-4 py-3 border-b border-outline-variant/20">
          <h3 class="font-label text-sm font-medium text-on-surface">商品信息</h3>
        </div>
        <div v-for="item in order.order_items" :key="item.id" class="flex gap-3 px-4 py-3 border-b border-outline-variant/10 last:border-b-0">
          <img :src="item.product_image" :alt="item.product_name" class="w-20 h-20 rounded-xl object-cover" />
          <div class="flex-1 flex flex-col justify-between">
            <h4 class="font-body text-sm text-on-surface line-clamp-2">{{ item.product_name }}</h4>
            <div class="flex items-center justify-between">
              <span class="text-error font-bold">¥{{ Number(item.price).toFixed(2) }}</span>
              <span class="text-xs text-outline">x{{ item.quantity }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Order Info -->
      <div class="theme-card mx-4 mt-4 rounded-xl p-4" style="border: 1px solid var(--theme-card-border);">
        <div class="flex flex-col gap-3">
          <div class="flex items-center justify-between">
            <span class="font-body text-sm text-on-surface-variant">订单编号</span>
            <span class="font-body text-sm text-on-surface">{{ order.order_number }}</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="font-body text-sm text-on-surface-variant">下单时间</span>
            <span class="font-body text-sm text-on-surface">{{ new Date(order.created_at).toLocaleString('zh-CN') }}</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="font-body text-sm text-on-surface-variant">支付方式</span>
            <span class="font-body text-sm text-on-surface">{{ payMethod }}</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="font-body text-sm text-on-surface-variant">商品总额</span>
            <span class="font-body text-sm text-on-surface">¥{{ Number(order.total_amount).toFixed(2) }}</span>
          </div>
          <div class="flex items-center justify-between pt-2 border-t border-outline-variant/20">
            <span class="font-label text-sm font-bold text-on-surface">实付金额</span>
            <span class="text-error font-headline text-lg font-bold">¥{{ Number(order.total_amount).toFixed(2) }}</span>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="mx-4 mt-6 flex gap-3">
        <template v-if="order.status === 'pending_payment'">
          <button class="flex-1 py-3 rounded-xl border border-outline-variant text-on-surface-variant font-label text-sm active:scale-95 transition-transform bg-transparent" @click="handleCancelOrder">
            取消订单
          </button>
          <button class="flex-1 py-3 rounded-xl bg-primary text-on-primary font-label text-sm active:scale-95 transition-transform border-none" @click="handleGoPay">
            立即支付
          </button>
        </template>
        <button v-if="order.status === 'shipped'" class="flex-1 py-3 rounded-xl bg-primary text-on-primary font-label text-sm active:scale-95 transition-transform border-none" @click="handleConfirmReceipt">
          确认收货
        </button>
      </div>
    </div>

    <!-- Not Found -->
    <div v-else class="flex flex-col items-center justify-center pt-32">
      <span class="material-symbols-outlined text-outline text-[48px] mb-4">error_outline</span>
      <p class="text-on-surface-variant text-sm">订单不存在</p>
    </div>
  </div>
</template>
