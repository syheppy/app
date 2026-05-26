<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuth } from '../composables/useAuth'
import { useToast } from '../composables/useToast'
import { supabase } from '../utils/supabase'

const router = useRouter()
const route = useRoute()
const { user } = useAuth()
const { show: showToast } = useToast()

const tabs = ['全部', '待付款', '待发货', '待收货', '待评价']
const activeTab = ref('全部')
const orders = ref([])
const loading = ref(true)

const statusMap = {
  '待付款': 'pending_payment',
  '待发货': 'pending_shipment',
  '待收货': 'shipped',
  '待评价': 'completed'
}

const statusLabel = {
  pending_payment: '待付款',
  pending_shipment: '待发货',
  shipped: '物流配送中',
  completed: '已完成',
  cancelled: '已取消'
}

// 倒计时相关
const now = ref(Date.now())
let tickTimer = null

const getRemaining = (createdAt) => {
  const expireAt = new Date(createdAt).getTime() + 30 * 60 * 1000
  return Math.max(0, Math.floor((expireAt - now.value) / 1000))
}

const formatRemaining = (seconds) => {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

const fetchOrders = async () => {
  if (!user.value) { loading.value = false; return }
  console.log('fetchOrders called, user:', user.value.id)
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .eq('user_id', user.value.id)
      .order('created_at', { ascending: false })
    if (error) throw error
    console.log('orders fetched:', data?.map(o => ({ no: o.order_number, status: o.status })))
    orders.value = data || []
  } catch (err) {
    console.error('Failed to fetch orders:', err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  // 每秒更新时间，驱动倒计时
  tickTimer = setInterval(() => { now.value = Date.now() }, 1000)
  fetchOrders()
})

// 每次进入页面都重新获取数据
watch(() => route.path, (newPath) => {
  if (newPath === '/orders') fetchOrders()
})

onUnmounted(() => {
  if (tickTimer) clearInterval(tickTimer)
})

const filteredOrders = computed(() => {
  if (activeTab.value === '全部') return orders.value
  const status = statusMap[activeTab.value]
  return orders.value.filter(o => o.status === status)
})

const handleConfirmReceipt = async (orderId) => {
  await supabase.from('orders').update({ status: 'completed' }).eq('id', orderId)
  const order = orders.value.find(o => o.id === orderId)
  if (order) order.status = 'completed'
}

// 去支付
const handleGoPay = (order) => {
  router.push({ path: `/payment/${order.order_number}`, query: { amount: Number(order.total_amount).toFixed(2) } })
}

// 取消订单
const handleCancelOrder = async (orderId) => {
  const { error } = await supabase.from('orders').update({ status: 'cancelled' }).eq('id', orderId)
  if (error) {
    showToast('取消失败，请重试')
    return
  }
  const order = orders.value.find(o => o.id === orderId)
  if (order) order.status = 'cancelled'
  showToast('订单已取消')
}
</script>

<template>
  <div class="min-h-screen bg-background text-on-surface">
    <!-- Header -->
    <div class="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-outline-variant/30">
      <div class="flex items-center justify-between px-4 h-14 max-w-lg mx-auto">
        <button class="p-2 active:scale-95 transition-transform" @click="router.push('/profile')">
          <span class="material-symbols-outlined text-on-surface">arrow_back</span>
        </button>
        <h1 class="font-headline text-base font-bold text-on-surface">我的订单</h1>
        <button class="p-2 active:scale-95 transition-transform">
          <span class="material-symbols-outlined text-on-surface">search</span>
        </button>
      </div>

      <!-- Tabs -->
      <div class="flex overflow-x-auto hide-scrollbar px-4 gap-6 max-w-lg mx-auto">
        <button v-for="tab in tabs" :key="tab" class="pb-3 text-sm whitespace-nowrap transition-colors relative bg-transparent border-none" :class="activeTab === tab ? 'text-primary font-bold' : 'text-on-surface-variant'" @click="activeTab = tab">
          {{ tab }}
          <div v-if="activeTab === tab" class="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-primary rounded-full" />
        </button>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex items-center justify-center py-20">
      <div class="text-on-surface-variant">加载中...</div>
    </div>

    <!-- Empty State -->
    <div v-else-if="filteredOrders.length === 0" class="flex flex-col items-center justify-center pt-32 px-8">
      <div class="w-20 h-20 rounded-full bg-surface-container-high flex items-center justify-center mb-4">
        <span class="material-symbols-outlined text-outline" style="font-size: 40px;">receipt_long</span>
      </div>
      <p class="text-on-surface-variant text-sm">暂无订单</p>
    </div>

    <!-- Order List -->
    <div v-else class="max-w-lg mx-auto px-4 py-4 flex flex-col gap-4 pb-8">
      <div v-for="order in filteredOrders" :key="order.id" class="bg-surface-container-lowest rounded-xl border border-outline-variant/30 overflow-hidden">
        <!-- Order Header -->
        <div class="flex items-center justify-between px-4 py-3 border-b border-outline-variant/20">
          <span class="font-label text-xs text-on-surface-variant">{{ order.order_number }}</span>
          <span class="font-label text-xs text-primary font-medium">{{ statusLabel[order.status] || order.status }}</span>
        </div>

        <!-- Order Items -->
        <div v-for="item in order.order_items" :key="item.id" class="flex gap-3 px-4 py-3">
          <img :src="item.product_image" :alt="item.product_name" class="w-16 h-16 rounded-xl object-cover" />
          <div class="flex-1">
            <h4 class="font-body text-sm text-on-surface">{{ item.product_name }}</h4>
            <div class="flex items-center justify-between mt-2">
              <span class="text-error font-bold">¥{{ Number(item.price).toFixed(2) }}</span>
              <span class="text-xs text-outline">x{{ item.quantity }}</span>
            </div>
          </div>
        </div>

        <!-- 待付款倒计时 -->
        <div v-if="order.status === 'pending_payment'" class="px-4 py-2 bg-primary/5 border-t border-primary/10">
          <p class="font-body text-xs" :class="getRemaining(order.created_at) < 300 ? 'text-error' : 'text-primary'">
            请在 <span class="font-bold">{{ formatRemaining(getRemaining(order.created_at)) }}</span> 前完成支付
          </p>
        </div>

        <!-- Order Footer -->
        <div class="flex items-center justify-between px-4 py-3 border-t border-outline-variant/20">
          <span class="font-body text-sm text-on-surface-variant">合计：<span class="text-error font-bold">¥{{ Number(order.total_amount).toFixed(2) }}</span></span>
          <div class="flex gap-2">
            <!-- 待付款：取消 + 去支付 -->
            <template v-if="order.status === 'pending_payment'">
              <button class="px-4 py-1.5 rounded-lg border border-outline-variant text-on-surface-variant font-label text-xs active:scale-95 transition-transform bg-transparent" @click="handleCancelOrder(order.id)">
                取消订单
              </button>
              <button class="px-4 py-1.5 rounded-lg bg-primary text-on-primary font-label text-xs active:scale-95 transition-transform border-none" @click="handleGoPay(order)">
                去支付
              </button>
            </template>
            <!-- 已发货：确认收货 -->
            <button v-if="order.status === 'shipped'" class="px-4 py-1.5 rounded-lg border border-primary text-primary font-label text-xs active:scale-95 transition-transform bg-transparent" @click="handleConfirmReceipt(order.id)">
              确认收货
            </button>
            <!-- 通用：查看详情 -->
            <button v-if="order.status !== 'pending_payment'" class="px-4 py-1.5 rounded-lg bg-primary text-on-primary font-label text-xs active:scale-95 transition-transform border-none">
              {{ order.status === 'shipped' ? '查看物流' : '查看详情' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
