<script setup>
import { ref, computed, onMounted, watch } from 'vue'
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

const filteredOrders = computed(() => {
  const status = statusMap[activeTab.value]
  if (!status) return orders.value
  return orders.value.filter(o => o.status === status)
})

onMounted(async () => {
  if (!user.value) {
    loading.value = false
    return
  }

  try {
    // 查询订单并关联 order_items
    const { data, error } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .eq('user_id', user.value.id)
      .order('created_at', { ascending: false })

    if (error) throw error

    // 处理订单数据，提取第一个商品信息
    orders.value = (data || []).map(order => {
      const items = order.order_items || []
      const firstItem = items[0] || {}
      return {
        ...order,
        product_name: firstItem.product_name || '商品',
        product_image: firstItem.product_image,
        product_price: firstItem.price,
      }
    })
  } catch (err) {
    console.error('Failed to fetch orders:', err)
    showToast('加载订单失败')
  } finally {
    loading.value = false
  }
})

const handleTabChange = (tab) => {
  activeTab.value = tab
}

const viewOrderDetail = (orderId) => {
  router.push(`/order/${orderId}`)
}
</script>

<template>
  <div class="min-h-screen bg-background text-on-surface font-body pb-20">
    <!-- Header with Gradient -->
    <div class="fixed top-0 left-0 w-full z-40 px-4 pt-3 pb-4 md:hidden" style="background: linear-gradient(to bottom, var(--theme-bg), color-mix(in srgb, var(--theme-bg) 80%, transparent));">
      <!-- Top Row: Back + Title + Search -->
      <div class="flex items-center justify-between mb-3">
        <div class="flex items-center gap-3">
          <button class="p-2 rounded-full hover:bg-surface-container/50 transition-colors active:scale-95" @click="router.back()">
            <span class="material-symbols-outlined text-primary" style="font-size: 22px;">arrow_back</span>
          </button>
          <h1 class="font-headline text-lg font-bold text-on-surface">我的订单</h1>
        </div>
        <button class="p-2 rounded-full hover:bg-surface-container/50 transition-colors">
          <span class="material-symbols-outlined text-primary" style="font-size: 22px;">search</span>
        </button>
      </div>

      <!-- Status Tabs -->
      <nav class="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        <button
          v-for="tab in tabs"
          :key="tab"
          @click="handleTabChange(tab)"
          :class="[
            'flex-shrink-0 px-4 py-2 text-sm whitespace-nowrap transition-all rounded-full',
            activeTab === tab
              ? 'bg-primary text-on-primary font-bold shadow-sm shadow-primary/20'
              : 'text-on-surface-variant font-medium hover:bg-surface-container'
          ]"
        >
          {{ tab }}
        </button>
      </nav>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex items-center justify-center py-20">
      <div class="text-on-surface-variant">加载中...</div>
    </div>

    <!-- Empty State -->
    <div v-else-if="filteredOrders.length === 0" class="flex flex-col items-center justify-center py-20">
      <span class="material-symbols-outlined text-outline mb-4" style="font-size: 48px;">receipt_long</span>
      <p class="text-on-surface-variant mb-4">暂无订单</p>
      <button class="px-6 py-2 rounded-xl bg-primary text-on-primary font-medium active:scale-95 transition-transform" @click="router.push('/')">去选购</button>
    </div>

    <!-- Order Cards -->
    <main v-else class="pt-[110px] px-4 pb-6">
      <div class="space-y-4">
        <div
          v-for="order in filteredOrders"
          :key="order.id"
          class="bg-surface-container-low rounded-xl p-5 shadow-[0_2px_16px_rgba(58,48,42,0.04)] border border-outline-variant/30 cursor-pointer"
          @click="viewOrderDetail(order.id)"
        >
          <!-- Order Header -->
          <div class="flex justify-between items-center mb-4 border-b border-outline-variant/40 pb-3">
            <div class="space-y-0.5">
              <p class="text-[10px] text-on-surface-variant font-medium tracking-wider uppercase">订单编号</p>
              <p class="text-xs font-bold text-on-surface">{{ order.order_number }}</p>
            </div>
            <span class="text-xs font-semibold px-2 py-1 rounded-md"
              :class="{
                'text-primary bg-primary-fixed/50': order.status === 'pending_payment',
                'text-tertiary bg-tertiary-fixed': order.status === 'pending_shipment' || order.status === 'shipped',
                'text-green-600 bg-green-50': order.status === 'completed',
                'text-on-surface-variant bg-surface-container': order.status === 'cancelled'
              }"
            >
              {{ statusLabel[order.status] || order.status }}
            </span>
          </div>

          <!-- Product Info (from order_items) -->
          <div class="flex gap-4 mb-4">
            <div class="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-surface-container border border-outline-variant/20">
              <img
                v-if="order.product_image"
                class="w-full h-full object-cover"
                :src="order.product_image"
                :alt="order.product_name"
              />
              <div v-else class="w-full h-full flex items-center justify-center">
                <span class="material-symbols-outlined text-outline">image</span>
              </div>
            </div>
            <div class="flex-grow flex flex-col justify-between py-1">
              <div>
                <h3 class="font-headline text-base leading-tight text-on-surface font-semibold">{{ order.product_name || '商品' }}</h3>
                <p v-if="order.consignee_address" class="text-xs text-on-surface-variant mt-1 truncate">{{ order.consignee_address }}</p>
              </div>
              <div class="flex justify-between items-end">
                <span class="font-headline text-lg text-primary font-bold">¥{{ order.product_price?.toFixed(2) || order.total_amount?.toFixed(2) || '0.00' }}</span>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex justify-end items-center gap-3">
            <button
              class="px-5 py-2 border border-outline-variant text-on-surface text-xs font-medium rounded-lg hover:bg-surface-container-high transition-colors"
              @click.stop
            >
              查看物流
            </button>
            <button
              v-if="order.status === 'shipped'"
              class="px-5 py-2 bg-primary text-white text-xs font-bold rounded-lg active:scale-95 duration-150 shadow-sm"
              @click.stop
            >
              确认收货
            </button>
            <button
              v-if="order.status === 'pending_payment'"
              class="px-5 py-2 bg-primary text-white text-xs font-bold rounded-lg active:scale-95 duration-150 shadow-sm"
              @click.stop="router.push(`/payment/${order.order_number}`)"
            >
              去支付
            </button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
