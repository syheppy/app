<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '../utils/supabase'
import { useCart } from '../composables/useCart'
import { useAuth } from '../composables/useAuth'
import { useToast } from '../composables/useToast'

const router = useRouter()
const { items, totalPrice, clearCart } = useCart()
const { user } = useAuth()
const { show: showToast } = useToast()

const selectedAddress = ref(null)
const paymentMethod = ref('wechat')
const submitting = ref(false)
const isEmpty = computed(() => items.length === 0)

// 优惠券相关
const showCouponDrawer = ref(false)
const selectedCoupon = ref(null)
const availableCoupons = ref([])

const couponList = [
  { id: 1, type: 'amount', value: 15, condition: '满99可用', title: '丰收节礼遇专享券', minAmount: 99 },
  { id: 2, type: 'amount', value: 30, condition: '全场通用', title: '新客专享尊享券', minAmount: 0 },
  { id: 3, type: 'discount', value: 9.2, condition: '限时优惠', title: '会员回馈折扣券', minAmount: 0 }
]

const filterAvailableCoupons = () => {
  availableCoupons.value = couponList.filter(c => totalPrice.value >= c.minAmount)
}

const discount = computed(() => {
  if (!selectedCoupon.value) return 0
  const c = selectedCoupon.value
  if (c.type === 'amount') return c.value
  const disc = totalPrice.value * (1 - c.value / 10)
  return Math.round(disc * 100) / 100
})

const shippingFee = computed(() => totalPrice.value >= 99 ? 0 : 10)

const finalPrice = computed(() => {
  const price = totalPrice.value - discount.value + shippingFee.value
  return Math.max(0, price)
})

const selectCoupon = (coupon) => {
  if (selectedCoupon.value?.id === coupon.id) {
    selectedCoupon.value = null
  } else {
    selectedCoupon.value = coupon
  }
}

const clearCoupon = () => {
  selectedCoupon.value = null
  showCouponDrawer.value = false
}

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
  if (loadSelectedAddress()) return
  if (user.value) {
    const { data } = await supabase
      .from('addresses')
      .select('*')
      .eq('user_id', user.value.id)
      .eq('is_default', true)
      .maybeSingle()
    if (data) selectedAddress.value = data
  }
  filterAvailableCoupons()
})

const generateOrderNo = () => 'SXS-' + Date.now().toString(36).toUpperCase()

const handleSubmit = async () => {
  if (!selectedAddress.value) {
    showToast('请先添加收货地址')
    return
  }
  submitting.value = true
  try {
    const orderNo = generateOrderNo()
    const orderData = {
      order_number: orderNo,
      total_amount: finalPrice.value,
      subtotal: totalPrice.value,
      shipping_fee: shippingFee.value,
      discount: discount.value,
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

    await clearCart()
    router.replace({ path: `/payment/${orderNo}`, query: { amount: finalPrice.value.toFixed(2) } })
  } catch (err) {
    console.error('Failed to submit order:', err)
    showToast('下单失败，请重试')
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="min-h-screen pb-24 bg-background text-on-surface selection:bg-primary-fixed selection:text-primary">
    <!-- Top Bar -->
    <header class="sticky top-0 z-50 bg-surface/90 backdrop-blur-md border-b border-outline-variant/60 shadow-sm">
      <div class="flex items-center justify-between px-6 py-4 max-w-3xl mx-auto h-16">
        <button aria-label="Go back" class="text-on-surface-variant hover:text-primary transition-colors" @click="router.back()">
          <span class="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 class="font-serif text-2xl italic tracking-tight text-primary font-medium">结算界面</h1>
        <div class="w-6"></div>
      </div>
    </header>

    <!-- Empty State -->
    <div v-if="isEmpty" class="flex flex-col items-center justify-center py-20">
      <span class="material-symbols-outlined text-outline mb-4" style="font-size: 48px;">receipt_long</span>
      <p class="text-on-surface-variant mb-4">没有待结算的商品</p>
      <button class="px-8 py-3 rounded-xl bg-primary text-on-primary font-bold active:scale-95 transition-transform" @click="router.push('/')">去选购</button>
    </div>

    <template v-else>
      <main class="max-w-3xl mx-auto px-4 py-6 space-y-6">
        <!-- Page Title -->
        <div class="mb-8">
          <h2 class="font-serif text-3xl font-medium text-on-surface">确认订单</h2>
          <p class="text-on-surface-variant mt-2 text-sm">请在下方核对您的订单详情。</p>
        </div>

        <!-- Address Card -->
        <section
          v-if="selectedAddress"
          class="bg-surface-container-low rounded-xl p-6 shadow-[0_2px_16px_rgba(58,48,42,0.04)] border border-outline-variant/30 hover:border-outline-variant/60 transition-colors relative overflow-hidden group cursor-pointer"
          @click="router.push('/address')"
        >
          <div class="absolute right-0 top-0 bottom-0 w-12 flex items-center justify-center text-on-surface-variant group-hover:text-primary transition-colors bg-gradient-to-l from-surface-container-low to-transparent">
            <span class="material-symbols-outlined">chevron_right</span>
          </div>
          <div class="flex items-start gap-4 pr-8">
            <div class="mt-1 text-primary bg-primary-fixed/50 p-2 rounded-full">
              <span class="material-symbols-outlined">location_on</span>
            </div>
            <div>
              <div class="flex items-center gap-3 mb-1">
                <span class="font-semibold text-lg text-on-surface">{{ selectedAddress.name }}</span>
                <span class="text-on-surface-variant text-sm">{{ selectedAddress.phone }}</span>
              </div>
              <p class="text-on-surface-variant text-sm leading-relaxed">{{ selectedAddress.address }}</p>
            </div>
          </div>
        </section>

        <!-- No Address -->
        <section
          v-else
          class="bg-surface-container-low rounded-xl p-6 shadow-[0_2px_16px_rgba(58,48,42,0.04)] border border-outline-variant/30 hover:border-outline-variant/60 transition-colors cursor-pointer"
          @click="router.push('/address')"
        >
          <div class="flex items-center justify-center gap-2 text-primary">
            <span class="material-symbols-outlined">add</span>
            <span class="font-medium">添加收货地址</span>
          </div>
        </section>

        <!-- Product List -->
        <section class="bg-surface-container-low rounded-xl p-6 shadow-[0_2px_16px_rgba(58,48,42,0.04)] border border-outline-variant/30">
          <h3 class="font-serif text-xl mb-4 border-b border-outline-variant/30 pb-3">商品清单</h3>
          <div class="space-y-4">
            <div v-for="item in items" :key="item.id" class="flex gap-4 items-center">
              <div class="w-20 h-20 rounded-lg overflow-hidden shrink-0 bg-surface-container border border-outline-variant/20">
                <img :alt="item.name" class="w-full h-full object-cover" :src="item.image" />
              </div>
              <div class="flex-1">
                <h4 class="font-medium text-on-surface">{{ item.name }}</h4>
                <p class="text-xs text-on-surface-variant mt-1">{{ item.specs?.[0]?.name || '' }}</p>
                <div class="flex items-center justify-between mt-2">
                  <span class="text-price-md text-on-surface">¥ {{ item.price.toFixed(2) }}</span>
                  <span class="text-sm text-on-surface-variant">x{{ item.quantity }}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Coupon -->
        <section class="bg-surface-container-low rounded-xl p-2 shadow-[0_2px_16px_rgba(58,48,42,0.04)] border border-outline-variant/30">
          <div class="flex justify-between items-center p-4 cursor-pointer hover:bg-surface-container/50 transition-colors rounded-lg" @click="filterAvailableCoupons(); showCouponDrawer = true">
            <div class="flex items-center gap-3">
              <span class="material-symbols-outlined text-tertiary text-xl">confirmation_number</span>
              <span class="text-sm text-on-surface">优惠券</span>
            </div>
            <div class="flex items-center gap-2 text-tertiary">
              <span v-if="selectedCoupon" class="text-sm">- ¥{{ discount.toFixed(2) }}</span>
              <span v-else class="text-sm text-on-surface-variant">{{ availableCoupons.length }} 张可用</span>
              <span class="material-symbols-outlined text-xl">chevron_right</span>
            </div>
          </div>
        </section>

        <!-- Order Details -->
        <section class="bg-surface-container-low rounded-xl p-2 shadow-[0_2px_16px_rgba(58,48,42,0.04)] border border-outline-variant/30">
          <div class="flex justify-between items-center p-4">
            <div class="flex items-center gap-3">
              <span class="material-symbols-outlined text-on-surface-variant text-xl">local_shipping</span>
              <span class="text-sm text-on-surface">配送方式</span>
            </div>
            <span class="text-sm text-on-surface-variant">{{ shippingFee === 0 ? '极速冷链（免运费）' : '极速冷链 ¥' + shippingFee }}</span>
          </div>
        </section>

        <!-- Payment Methods -->
        <section class="bg-surface-container-low rounded-xl p-6 shadow-[0_2px_16px_rgba(58,48,42,0.04)] border border-outline-variant/30">
          <h3 class="font-serif text-xl mb-4">支付方式</h3>
          <div class="space-y-3">
            <!-- Wechat Pay -->
            <div
              @click="paymentMethod = 'wechat'"
              :class="[
                'flex items-center justify-between p-4 rounded-lg cursor-pointer transition-colors border',
                paymentMethod === 'wechat' ? 'border-primary bg-primary-fixed/20' : 'border-outline-variant/40 hover:bg-surface-container/50'
              ]"
            >
              <div class="flex items-center gap-4">
                <div class="w-8 h-8 rounded-full flex items-center justify-center bg-[#09B83E]/10">
                  <span class="material-symbols-outlined text-[#09B83E]">chat</span>
                </div>
                <span :class="['text-sm', paymentMethod === 'wechat' ? 'font-medium text-on-surface' : 'text-on-surface-variant']">微信支付</span>
              </div>
              <div :class="['w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors', paymentMethod === 'wechat' ? 'border-primary' : 'border-outline-variant']">
                <div v-if="paymentMethod === 'wechat'" class="w-2.5 h-2.5 rounded-full bg-primary" />
              </div>
            </div>

            <!-- Alipay -->
            <div
              @click="paymentMethod = 'alipay'"
              :class="[
                'flex items-center justify-between p-4 rounded-lg cursor-pointer transition-colors border',
                paymentMethod === 'alipay' ? 'border-primary bg-primary-fixed/20' : 'border-outline-variant/40 hover:bg-surface-container/50'
              ]"
            >
              <div class="flex items-center gap-4">
                <div class="w-8 h-8 rounded-full flex items-center justify-center bg-[#1677FF]/10">
                  <span class="material-symbols-outlined text-[#1677FF]">account_balance_wallet</span>
                </div>
                <span :class="['text-sm', paymentMethod === 'alipay' ? 'font-medium text-on-surface' : 'text-on-surface-variant']">支付宝</span>
              </div>
              <div :class="['w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors', paymentMethod === 'alipay' ? 'border-primary' : 'border-outline-variant']">
                <div v-if="paymentMethod === 'alipay'" class="w-2.5 h-2.5 rounded-full bg-primary" />
              </div>
            </div>

            <!-- UnionPay -->
            <div
              @click="paymentMethod = 'unionpay'"
              :class="[
                'flex items-center justify-between p-4 rounded-lg cursor-pointer transition-colors border',
                paymentMethod === 'unionpay' ? 'border-primary bg-primary-fixed/20' : 'border-outline-variant/40 hover:bg-surface-container/50'
              ]"
            >
              <div class="flex items-center gap-4">
                <div class="w-8 h-8 rounded-full flex items-center justify-center bg-tertiary/10">
                  <span class="material-symbols-outlined text-tertiary">credit_card</span>
                </div>
                <span :class="['text-sm', paymentMethod === 'unionpay' ? 'font-medium text-on-surface' : 'text-on-surface-variant']">云闪付</span>
              </div>
              <div :class="['w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors', paymentMethod === 'unionpay' ? 'border-primary' : 'border-outline-variant']">
                <div v-if="paymentMethod === 'unionpay'" class="w-2.5 h-2.5 rounded-full bg-primary" />
              </div>
            </div>
          </div>
        </section>
      </main>

      <!-- Bottom Floating Action Bar -->
      <div class="fixed bottom-0 left-0 w-full bg-surface/95 backdrop-blur-md border-t border-outline-variant/40 shadow-[0_-8px_30px_rgba(58,48,42,0.06)] z-50 px-4 py-4 pb-safe">
        <div class="max-w-3xl mx-auto flex items-center justify-between gap-4">
          <div class="flex flex-col">
            <span class="text-caption-sm text-on-surface-variant tracking-widest">合计</span>
            <div class="flex items-baseline gap-1 text-primary">
              <span class="text-price-sm">¥</span>
              <span class="text-price-lg">{{ finalPrice.toFixed(2) }}</span>
            </div>
            <span v-if="discount > 0" class="text-caption-sm text-tertiary">已优惠 ¥{{ discount.toFixed(2) }}</span>
          </div>
          <button
            class="bg-primary text-on-primary font-medium px-8 py-3.5 rounded-lg shadow-sm hover:bg-primary/90 active:scale-95 transition-all w-full max-w-[200px] flex justify-center items-center gap-2 disabled:opacity-50"
            :disabled="submitting"
            @click="handleSubmit"
          >
            <span v-if="submitting">提交中...</span>
            <template v-else>
              立即支付
              <span class="material-symbols-outlined text-lg">arrow_forward</span>
            </template>
          </button>
        </div>
      </div>
    </template>

    <!-- Coupon Drawer -->
    <Teleport to="body">
      <Transition name="drawer">
        <div v-if="showCouponDrawer" class="fixed inset-0 z-50 flex items-end justify-center" @click.self="showCouponDrawer = false">
          <div class="absolute inset-0 bg-black/40"></div>
          <div class="relative bg-surface rounded-t-2xl w-full max-w-lg p-5 pb-safe z-10 max-h-[70vh] flex flex-col">
            <div class="flex items-center justify-between mb-4">
              <h3 class="font-serif text-xl font-medium text-on-surface">选择优惠券</h3>
              <button @click="showCouponDrawer = false" class="p-2 rounded-full hover:bg-surface-container transition-colors">
                <span class="material-symbols-outlined text-on-surface-variant">close</span>
              </button>
            </div>

            <div class="flex-1 overflow-y-auto space-y-3">
              <div v-if="selectedCoupon" class="flex justify-end">
                <button class="text-xs text-primary font-medium" @click="clearCoupon">不使用优惠券</button>
              </div>

              <div v-if="availableCoupons.length === 0" class="py-10 text-center text-on-surface-variant text-sm">
                暂无可用优惠券
              </div>

              <div v-for="coupon in availableCoupons" :key="coupon.id" class="bg-surface-container-low rounded-xl overflow-hidden flex cursor-pointer transition-all border" :class="selectedCoupon?.id === coupon.id ? 'border-primary ring-1 ring-primary' : 'border-outline-variant/30'" @click="selectCoupon(coupon)">
                <div class="w-24 p-4 flex flex-col items-center justify-center border-r border-dashed border-outline-variant/60 shrink-0">
                  <div class="flex items-baseline text-primary">
                    <template v-if="coupon.type === 'amount'">
                      <span class="text-xs font-bold">¥</span>
                      <span class="text-2xl font-extrabold">{{ coupon.value }}</span>
                    </template>
                    <template v-else>
                      <span class="text-2xl font-extrabold">{{ coupon.value }}</span>
                      <span class="text-xs font-bold ml-0.5">折</span>
                    </template>
                  </div>
                  <span class="text-[10px] text-on-surface-variant mt-1">{{ coupon.condition }}</span>
                </div>
                <div class="flex-1 p-4 flex flex-col justify-between">
                  <div>
                    <h4 class="font-bold text-sm text-on-surface">{{ coupon.title }}</h4>
                    <p class="text-[10px] text-on-surface-variant mt-0.5">适用于全场商品</p>
                  </div>
                  <div class="flex items-center justify-between mt-2">
                    <span class="text-[10px] text-outline">有效期至 2026.12.31</span>
                    <div class="w-5 h-5 rounded-full border-2 flex items-center justify-center" :class="selectedCoupon?.id === coupon.id ? 'border-primary bg-primary' : 'border-outline-variant'">
                      <span v-if="selectedCoupon?.id === coupon.id" class="material-symbols-outlined text-white text-[14px]" style="font-variation-settings: 'FILL' 1">check</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <button class="w-full mt-4 py-3 rounded-xl bg-primary text-on-primary font-bold active:scale-[0.98] transition-transform" @click="showCouponDrawer = false">
              确认使用
            </button>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.drawer-enter-active, .drawer-leave-active { transition: all 0.3s ease; }
.drawer-enter-active > div:last-child, .drawer-leave-active > div:last-child { transition: transform 0.3s ease; }
.drawer-enter-from > div:last-child, .drawer-leave-to > div:last-child { transform: translateY(100%); }
.drawer-enter-from > div:first-child, .drawer-leave-to > div:first-child { opacity: 0; }
</style>
