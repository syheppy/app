<script setup>
import { computed, ref } from 'vue'
import { useToast } from '../composables/useToast'
import SettingsPageShell from '../components/settings/SettingsPageShell.vue'
import SettingsSection from '../components/settings/SettingsSection.vue'
import SettingsRow from '../components/settings/SettingsRow.vue'

const { show: showToast } = useToast()

const clearing = ref(false)
const imageCache = ref(76)
const browsingCache = ref(38)
const tempCache = ref(14)

const totalCache = computed(() => imageCache.value + browsingCache.value + tempCache.value)
const formatSize = (size) => `${size}MB`

const clearLocalCache = async () => {
  clearing.value = true
  await new Promise(resolve => setTimeout(resolve, 450))
  imageCache.value = 0
  browsingCache.value = 0
  tempCache.value = 0
  clearing.value = false
  showToast('缓存已清理')
}
</script>

<template>
  <SettingsPageShell title="缓存管理" subtitle="清理图片、浏览记录和临时数据，不会影响账号和订单。">
    <div class="settings-card theme-card rounded-2xl border theme-border p-5 mb-6 text-center">
      <p class="text-xs font-bold text-primary tracking-wider uppercase">当前缓存</p>
      <p class="font-headline text-4xl font-bold theme-text mt-2">{{ formatSize(totalCache) }}</p>
      <p class="text-xs theme-text-secondary mt-1">清理后可以释放本地存储空间</p>
    </div>

    <SettingsSection title="缓存明细">
      <SettingsRow icon="image" label="图片缓存" description="商品图、活动图等资源" :value="formatSize(imageCache)" />
      <div class="h-px mx-4" style="background: var(--theme-card-border);"></div>
      <SettingsRow icon="travel_explore" label="浏览缓存" description="最近访问页面和筛选状态" :value="formatSize(browsingCache)" />
      <div class="h-px mx-4" style="background: var(--theme-card-border);"></div>
      <SettingsRow icon="folder" label="临时数据" description="页面运行产生的临时内容" :value="formatSize(tempCache)" />
    </SettingsSection>

    <button
      class="w-full py-3.5 rounded-xl bg-primary text-on-primary font-bold border-none cursor-pointer active:scale-[0.98] transition-transform disabled:opacity-60"
      :disabled="clearing || totalCache === 0"
      @click="clearLocalCache"
    >
      {{ clearing ? '清理中' : totalCache === 0 ? '已清理完成' : '清理缓存' }}
    </button>
  </SettingsPageShell>
</template>
