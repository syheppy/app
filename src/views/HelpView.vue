<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const faqs = ref([
  { q: '如何下单？', a: '选择商品加入购物车，确认收货地址后提交订单并完成支付即可。', open: false },
  { q: '支持哪些支付方式？', a: '目前支持微信支付和支付宝支付。', open: false },
  { q: '如何查看物流？', a: '在"我的订单"中找到对应订单，点击"查看物流"即可追踪配送状态。', open: false },
  { q: '可以退换货吗？', a: '生鲜商品签收后如有质量问题，请在24小时内联系客服处理。', open: false },
  { q: '如何使用优惠券？', a: '在结算页面系统会自动匹配可用优惠券，也可在"我的优惠券"中手动选择。', open: false },
  { q: '免邮政策是什么？', a: '订单满99元即可享受免邮服务，不满99元需支付相应运费。', open: false }
])

const toggle = (faq) => { faq.open = !faq.open }
</script>

<template>
  <div class="min-h-screen theme-bg theme-text">
    <div class="sticky top-0 z-40 backdrop-blur-md border-b" style="background: color-mix(in srgb, var(--theme-bg) 90%, transparent); border-color: var(--theme-card-border);">
      <div class="flex items-center justify-between px-4 h-14 max-w-lg mx-auto">
        <button class="p-2" @click="router.back()"><span class="material-symbols-outlined">arrow_back</span></button>
        <h1 class="font-headline text-base font-bold">帮助中心</h1>
        <div class="w-10"></div>
      </div>
    </div>

    <main class="max-w-lg mx-auto px-4 py-4 pb-8">
      <!-- Contact -->
      <div class="bg-primary/10 rounded-xl p-4 mb-6 flex items-center gap-3">
        <span class="material-symbols-outlined text-primary text-[24px]" style="font-variation-settings: 'FILL' 1">support_agent</span>
        <div>
          <h3 class="font-label text-sm font-bold text-on-surface">在线客服</h3>
          <p class="font-body text-xs text-on-surface-variant">工作时间 9:00-21:00</p>
        </div>
      </div>

      <!-- FAQ -->
      <h3 class="font-headline text-lg font-bold text-on-surface mb-3">常见问题</h3>
      <div class="flex flex-col gap-2">
        <div v-for="faq in faqs" :key="faq.q" class="theme-card rounded-xl overflow-hidden" style="border: 1px solid var(--theme-card-border);">
          <button @click="toggle(faq)" class="w-full flex items-center justify-between px-4 py-3 bg-transparent border-none cursor-pointer text-left">
            <span class="font-body text-sm text-on-surface">{{ faq.q }}</span>
            <span class="material-symbols-outlined text-outline text-[20px] transition-transform" :class="faq.open ? 'rotate-180' : ''">expand_more</span>
          </button>
          <div v-if="faq.open" class="px-4 pb-3 font-body text-sm text-on-surface-variant leading-relaxed border-t border-outline-variant/20 pt-3">
            {{ faq.a }}
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
