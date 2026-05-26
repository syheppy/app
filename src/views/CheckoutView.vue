<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '../utils/supabase'
import { useCart } from '../composables/useCart'
import { useAuth } from '../composables/useAuth'

const router = useRouter()
const { items, totalPrice, clearCart } = useCart()
const { user } = useAuth()

const selectedAddress = ref(null)
const paymentMethod = ref('wechat')
const submitting = ref(false)
const isEmpty = computed(() => items.length === 0)

// 从 sessionStorage 读取用户选择的地址
const loadSelectedAddress = () => {
  const saved = sessionStorage.getItem('selectedAddress')
  if (saved) {
    selectedAddress.value = JSON.parse(saved)
    sessionStorage.removeItem('selectedAddress')
    return true
  }
  return false
}

onMounted(async () => {
  // 优先读取用户选择的地址
  if (loadSelectedAddress()) return
  // 否则加载默认地址
  if (user.value) {
    const { data } = await supabase
      .from('addresses')
      .select('*')
      .eq('user_id', user.value.id)
      .eq('is_default', true)
      .maybeSingle()
    if (data) selectedAddress.value = data
  }
})

const generateOrderNo = () => 'SXS-' + Date.now().toString(36).toUpperCase()

const handleSubmit = async () => {
  if (!selectedAddress.value) {
    alert('请先添加收货地址')
    return
  }
  submitting.value = true
  try {
    const orderNo = generateOrderNo()
    const orderData = {
      order_number: orderNo,
      total_amount: totalPrice.value,
      consignee_name: selectedAddress.value.name,
      consignee_phone: selectedAddress.value.phone,
      consignee_address: selectedAddress.value.address,
      payment_method: paymentMethod.value,
      status: 'pending_payment'
    }
    if (user.value) orderData.user_id = user.value.id

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert(orderData)
      .select('id')
      .single()
    if (orderError) throw orderError

    const orderItems = items.map(item => ({
      order_id: order.id,
      product_id: item.id,
      product_name: item.name,
      product_image: item.image,
      price: item.price,
      quantity: item.quantity
    }))
    const { error: itemsError } = await supabase.from('order_items').insert(orderItems)
    if (itemsError) throw itemsError

    const paidAmount = totalPrice.value.toFixed(2)
    await clearCart()
    router.replace({ path: `/payment/${orderNo}`, query: { amount: paidAmount } })
  } catch (err) {
    console.error('Failed to submit order:', err)
    alert('下单失败，请重试')
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-background text-on-surface pb-24">
    <!-- Header -->
    <div class="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-outline-variant/30">
      <div class="flex items-center justify-between px-4 h-14 max-w-lg mx-auto">
        <button class="p-2 active:scale-95 transition-transform" @click="router.back()">
          <span class="material-symbols-outlined text-on-surface">arrow_back</span>
        </button>
        <h1 class="font-headline text-base font-bold text-on-surface">结算界面</h1>
        <div class="w-10"></div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="isEmpty" class="flex flex-col items-center justify-center py-20">
      <span class="material-symbols-outlined text-outline mb-4" style="font-size: 48px;">receipt_long</span>
      <p class="text-on-surface-variant mb-4">没有待结算的商品</p>
      <button class="px-8 py-3 rounded-xl bg-primary text-on-primary font-bold active:scale-95 transition-transform" @click="router.push('/')">去选购</button>
    </div>

    <template v-else>
      <div class="max-w-lg mx-auto px-4 py-4">
        <!-- Address -->
        <div class="bg-surface-container-lowest rounded-xl p-4 mb-4 border border-outline-variant/30 shadow-sm flex items-center gap-3 cursor-pointer" @click="router.push('/address')">
          <span class="material-symbols-outlined text-primary text-[24px]">location_on</span>
          <div v-if="selectedAddress" class="flex-1 min-w-0">
            <div class="flex items-center gap-2 mb-0.5">
              <span class="font-label text-sm font-bold text-on-surface">{{ selectedAddress.name }} 先生</span>
              <span class="font-body text-xs text-on-surface-variant">{{ selectedAddress.phone }}</span>
            </div>
            <p class="font-body text-xs text-on-surface-variant truncate">{{ selectedAddress.address }}</p>
          </div>
          <div v-else class="flex-1">
            <p class="font-body text-sm text-on-surface-variant">请添加收货地址</p>
          </div>
          <span class="material-symbols-outlined text-outline text-[20px]">chevron_right</span>
        </div>

        <!-- Products -->
        <div class="bg-surface-container-lowest rounded-xl p-4 mb-4 border border-outline-variant/30">
          <div v-for="item in items" :key="item.id" class="flex gap-3 py-3 first:pt-0 last:pb-0 border-b border-outline-variant/20 last:border-none">
            <img :src="item.image" :alt="item.name" class="w-16 h-16 rounded-xl object-cover" />
            <div class="flex-1">
              <h4 class="font-body text-sm font-medium text-on-surface">{{ item.name }}</h4>
              <div class="flex items-center justify-between mt-2">
                <span class="text-error font-bold">¥{{ item.price.toFixed(2) }}</span>
                <span class="text-xs text-outline">x{{ item.quantity }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Coupon -->
        <div class="bg-surface-container-lowest rounded-xl p-4 mb-4 border border-outline-variant/30 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-tertiary text-[20px]">confirmation_number</span>
            <span class="font-body text-sm text-on-surface">优惠券</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="font-label text-xs text-tertiary">-¥5.00</span>
            <span class="material-symbols-outlined text-outline text-[20px]">chevron_right</span>
          </div>
        </div>

        <!-- Delivery -->
        <div class="bg-surface-container-lowest rounded-xl p-4 mb-4 border border-outline-variant/30 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-primary text-[20px]">local_shipping</span>
            <span class="font-body text-sm text-on-surface">配送方式</span>
          </div>
          <span class="font-label text-xs text-on-surface-variant">极速冷链</span>
        </div>

        <!-- Payment Method -->
        <div class="bg-surface-container-lowest rounded-xl p-4 mb-4 border border-outline-variant/30">
          <p class="font-label text-sm text-on-surface-variant mb-3">支付方式</p>
          <div class="flex flex-col gap-2">
            <label class="flex items-center gap-3 p-3 rounded-lg cursor-pointer" :class="paymentMethod === 'wechat' ? 'bg-primary/5 border border-primary/20' : 'border border-outline-variant/30'">
              <input type="radio" v-model="paymentMethod" value="wechat" class="accent-primary" />
              <span class="font-body text-sm text-on-surface">微信支付</span>
            </label>
            <label class="flex items-center gap-3 p-3 rounded-lg cursor-pointer" :class="paymentMethod === 'alipay' ? 'bg-primary/5 border border-primary/20' : 'border border-outline-variant/30'">
              <input type="radio" v-model="paymentMethod" value="alipay" class="accent-primary" />
              <span class="font-body text-sm text-on-surface">支付宝</span>
            </label>
          </div>
        </div>
      </div>

      <!-- Bottom Bar -->
      <div class="fixed bottom-0 left-0 w-full z-50 bg-surface-container-lowest/95 backdrop-blur-md border-t border-outline-variant/30 px-4 py-4 pb-safe">
        <div class="max-w-lg mx-auto flex items-center justify-between">
          <div>
            <span class="font-label text-xs text-on-surface-variant">合计</span>
            <div class="flex items-baseline gap-0.5">
              <span class="text-error text-sm font-bold">¥</span>
              <span class="font-headline text-2xl font-bold text-error">{{ totalPrice.toFixed(2) }}</span>
            </div>
          </div>
          <button class="bg-primary text-on-primary px-10 py-3.5 rounded-xl font-bold shadow-[0_4px_20px_rgba(194,101,42,0.2)] flex items-center gap-2 active:scale-95 transition-transform disabled:opacity-50" :disabled="submitting" @click="handleSubmit">
            <span v-if="submitting">提交中...</span>
            <template v-else>
              立即支付
              <span class="material-symbols-outlined" style="font-size: 18px;">arrow_forward</span>
            </template>
          </button>
        </div>
      </div>
    </template>
  </div>
</template>
