# Settings Secondary Pages Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build consistent, lightweight secondary pages for every settings entry except the existing inline background/theme action.

**Architecture:** Add a small settings component set for shared shell, sections, rows, switch rows, and document typography. Each settings page remains an independent Vue SFC so backend integration can replace local state without untangling a large dynamic renderer.

**Tech Stack:** Vue 3 SFCs, Vue Router, Vite, Tailwind utility classes, existing CSS/theme variables, Material Symbols, existing `useAuth`, `useToast`, `useTheme`, and Supabase profile update behavior.

---

## File Structure

Create:

- `src/components/settings/SettingsPageShell.vue` - shared secondary settings page wrapper with sticky header and optional right action slot.
- `src/components/settings/SettingsSection.vue` - titled rounded settings card.
- `src/components/settings/SettingsRow.vue` - reusable static/clickable settings row.
- `src/components/settings/SettingsSwitchRow.vue` - reusable switch row with label and description.
- `src/components/settings/SettingsDocument.vue` - reusable document layout for agreement/privacy text.
- `src/views/SecuritySettingsView.vue` - account/security secondary page.
- `src/views/NotificationSettingsView.vue` - notification settings page with local switches.
- `src/views/PrivacySettingsView.vue` - privacy settings page with local switches.
- `src/views/CacheSettingsView.vue` - cache management page with local clear action.
- `src/views/AboutSettingsView.vue` - about page.
- `src/views/UserAgreementView.vue` - user agreement document page.
- `src/views/PrivacyPolicyView.vue` - privacy policy document page.

Modify:

- `src/router/index.js` - add the new settings routes.
- `src/views/SettingsView.vue` - route each row to the new pages while leaving background/theme as an inline action.
- `src/views/ProfileEditView.vue` - keep Supabase nickname save behavior and restyle with shared settings components.

Verification:

- Use `npm run build` after every task that changes Vue code.
- Use browser/manual navigation after implementation: `/settings` -> every secondary page -> back.

---

### Task 1: Add Shared Settings Components

**Files:**
- Create: `src/components/settings/SettingsPageShell.vue`
- Create: `src/components/settings/SettingsSection.vue`
- Create: `src/components/settings/SettingsRow.vue`
- Create: `src/components/settings/SettingsSwitchRow.vue`
- Create: `src/components/settings/SettingsDocument.vue`

- [ ] **Step 1: Create `src/components/settings/SettingsPageShell.vue`**

```vue
<script setup>
import { useRouter } from 'vue-router'

defineProps({
  title: { type: String, required: true },
  subtitle: { type: String, default: '' }
})

const router = useRouter()
</script>

<template>
  <div class="min-h-screen font-body" style="background-color: var(--color-background); color: var(--color-on-background);">
    <div class="sticky top-0 z-40 backdrop-blur-md border-b theme-border" style="background: color-mix(in srgb, var(--theme-bg) 90%, transparent);">
      <div class="flex items-center justify-between px-4 h-14 max-w-lg mx-auto">
        <button class="w-10 h-10 flex items-center justify-center rounded-full bg-transparent border-none cursor-pointer active:scale-95 transition-transform" @click="router.back()">
          <span class="material-symbols-outlined theme-text text-[22px]">arrow_back</span>
        </button>
        <h1 class="font-headline text-lg font-bold theme-text">{{ title }}</h1>
        <div class="min-w-10 flex justify-end">
          <slot name="action">
            <div class="w-10"></div>
          </slot>
        </div>
      </div>
    </div>

    <main class="max-w-lg mx-auto px-4 py-5 pb-12">
      <p v-if="subtitle" class="text-xs leading-relaxed theme-text-secondary mb-4 px-1">{{ subtitle }}</p>
      <slot />
    </main>
  </div>
</template>
```

- [ ] **Step 2: Create `src/components/settings/SettingsSection.vue`**

```vue
<script setup>
defineProps({
  title: { type: String, default: '' },
  description: { type: String, default: '' }
})
</script>

<template>
  <section class="mb-6">
    <div v-if="title || description" class="mb-3 px-1">
      <h2 v-if="title" class="text-primary font-bold text-xs tracking-wider uppercase">{{ title }}</h2>
      <p v-if="description" class="text-xs leading-relaxed theme-text-secondary mt-1">{{ description }}</p>
    </div>
    <div class="theme-card rounded-2xl border theme-border shadow-sm overflow-hidden">
      <slot />
    </div>
  </section>
</template>
```

- [ ] **Step 3: Create `src/components/settings/SettingsRow.vue`**

```vue
<script setup>
defineProps({
  icon: { type: String, default: '' },
  label: { type: String, required: true },
  description: { type: String, default: '' },
  value: { type: String, default: '' },
  clickable: { type: Boolean, default: false },
  danger: { type: Boolean, default: false },
  showChevron: { type: Boolean, default: false }
})

const emit = defineEmits(['click'])
</script>

<template>
  <button
    type="button"
    class="w-full min-h-[56px] flex items-center gap-3 px-4 py-3 bg-transparent border-none text-left transition-colors"
    :class="clickable ? 'cursor-pointer active:bg-black/5' : 'cursor-default'"
    :disabled="!clickable"
    @click="clickable && emit('click')"
  >
    <span
      v-if="icon"
      class="material-symbols-outlined shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-[20px]"
      :class="danger ? 'text-error bg-error-container' : 'text-primary bg-primary/10'"
      style="font-variation-settings: 'FILL' 1;"
    >
      {{ icon }}
    </span>
    <span class="min-w-0 flex-1">
      <span class="block text-sm font-semibold" :class="danger ? 'text-error' : 'theme-text'">{{ label }}</span>
      <span v-if="description" class="block text-xs leading-relaxed theme-text-secondary mt-0.5">{{ description }}</span>
    </span>
    <span v-if="value" class="text-xs font-medium theme-text-secondary shrink-0">{{ value }}</span>
    <span v-if="showChevron" class="material-symbols-outlined text-[18px] theme-text-secondary shrink-0">chevron_right</span>
  </button>
</template>
```

- [ ] **Step 4: Create `src/components/settings/SettingsSwitchRow.vue`**

```vue
<script setup>
defineProps({
  modelValue: { type: Boolean, required: true },
  icon: { type: String, default: '' },
  label: { type: String, required: true },
  description: { type: String, default: '' }
})

const emit = defineEmits(['update:modelValue'])
</script>

<template>
  <div class="min-h-[64px] flex items-center gap-3 px-4 py-3">
    <span
      v-if="icon"
      class="material-symbols-outlined shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-primary bg-primary/10 text-[20px]"
      style="font-variation-settings: 'FILL' 1;"
    >
      {{ icon }}
    </span>
    <div class="min-w-0 flex-1">
      <span class="block text-sm font-semibold theme-text">{{ label }}</span>
      <span v-if="description" class="block text-xs leading-relaxed theme-text-secondary mt-0.5">{{ description }}</span>
    </div>
    <button
      type="button"
      class="relative w-12 h-7 rounded-full border-none cursor-pointer transition-colors shrink-0"
      :class="modelValue ? 'bg-primary' : 'bg-outline-variant'"
      :aria-pressed="modelValue"
      @click="emit('update:modelValue', !modelValue)"
    >
      <span
        class="absolute top-1 w-5 h-5 rounded-full bg-white shadow-sm transition-transform"
        :class="modelValue ? 'translate-x-[22px] left-0' : 'translate-x-1 left-0'"
      ></span>
    </button>
  </div>
</template>
```

- [ ] **Step 5: Create `src/components/settings/SettingsDocument.vue`**

```vue
<script setup>
defineProps({
  updatedAt: { type: String, required: true },
  intro: { type: String, default: '' },
  sections: { type: Array, required: true }
})
</script>

<template>
  <article class="space-y-4">
    <div class="theme-card rounded-2xl border theme-border p-4">
      <p v-if="intro" class="text-sm leading-7 theme-text">{{ intro }}</p>
      <p class="text-[11px] theme-text-secondary mt-3">更新日期：{{ updatedAt }}</p>
    </div>

    <section
      v-for="section in sections"
      :key="section.title"
      class="theme-card rounded-2xl border theme-border p-4"
    >
      <h2 class="font-headline text-lg font-bold theme-text mb-2">{{ section.title }}</h2>
      <p class="text-sm leading-7 theme-text-secondary whitespace-pre-line">{{ section.body }}</p>
    </section>
  </article>
</template>
```

- [ ] **Step 6: Run build**

Run: `npm run build`

Expected: PASS. The new shared components compile and do not require new dependencies.

- [ ] **Step 7: Commit shared components**

```bash
git add src/components/settings
git commit -m "feat: add settings shared components"
```

---

### Task 2: Add Settings Routes and Wire Existing Settings Rows

**Files:**
- Modify: `src/router/index.js`
- Modify: `src/views/SettingsView.vue`

- [ ] **Step 1: Add route entries to `src/router/index.js`**

Insert these route objects after the existing `/settings` route:

```js
  {
    path: '/settings/security',
    name: 'SecuritySettings',
    component: () => import('../views/SecuritySettingsView.vue'),
    meta: { hideNav: true, hideHeader: true }
  },
  {
    path: '/settings/notifications',
    name: 'NotificationSettings',
    component: () => import('../views/NotificationSettingsView.vue'),
    meta: { hideNav: true, hideHeader: true }
  },
  {
    path: '/settings/privacy',
    name: 'PrivacySettings',
    component: () => import('../views/PrivacySettingsView.vue'),
    meta: { hideNav: true, hideHeader: true }
  },
  {
    path: '/settings/cache',
    name: 'CacheSettings',
    component: () => import('../views/CacheSettingsView.vue'),
    meta: { hideNav: true, hideHeader: true }
  },
  {
    path: '/settings/about',
    name: 'AboutSettings',
    component: () => import('../views/AboutSettingsView.vue'),
    meta: { hideNav: true, hideHeader: true }
  },
  {
    path: '/settings/agreement',
    name: 'UserAgreement',
    component: () => import('../views/UserAgreementView.vue'),
    meta: { hideNav: true, hideHeader: true }
  },
  {
    path: '/settings/privacy-policy',
    name: 'PrivacyPolicy',
    component: () => import('../views/PrivacyPolicyView.vue'),
    meta: { hideNav: true, hideHeader: true }
  },
```

- [ ] **Step 2: Update `sections` in `src/views/SettingsView.vue`**

Keep the current structure but make the rows route to pages, except the theme row:

```js
const sections = computed(() => [
  {
    title: '账号管理',
    items: [
      { icon: 'person', label: '个人资料', route: '/profile/edit' },
      { icon: 'shield', label: '账号与安全', route: '/settings/security' }
    ]
  },
  {
    title: '偏好设置',
    items: [
      { icon: 'notifications', label: '消息通知', route: '/settings/notifications' },
      { icon: 'lock', label: '隐私设置', route: '/settings/privacy' },
      { icon: 'palette', label: '切换背景', value: themeName(), action: 'theme' }
    ]
  },
  {
    title: '帮助与关于',
    items: [
      { icon: 'cleaning_services', label: '清除缓存', value: '128MB', route: '/settings/cache' },
      { icon: 'info', label: '关于薯鲜生', value: 'v1.2.0', route: '/settings/about' },
      { icon: 'description', label: '用户协议', route: '/settings/agreement' },
      { icon: 'verified_user', label: '隐私政策', route: '/settings/privacy-policy' }
    ]
  }
])
```

- [ ] **Step 3: Run build and observe expected route import failure**

Run: `npm run build`

Expected: FAIL because the seven newly referenced view files do not exist yet. The failure should mention one of these paths:

- `../views/SecuritySettingsView.vue`
- `../views/NotificationSettingsView.vue`
- `../views/PrivacySettingsView.vue`
- `../views/CacheSettingsView.vue`
- `../views/AboutSettingsView.vue`
- `../views/UserAgreementView.vue`
- `../views/PrivacyPolicyView.vue`

This confirms the router is wired before pages are created.

---

### Task 3: Refactor Personal Profile Page to Shared Style

**Files:**
- Modify: `src/views/ProfileEditView.vue`

- [ ] **Step 1: Replace `src/views/ProfileEditView.vue` imports and script**

Use the shared shell/section/row components while keeping the Supabase save behavior:

```vue
<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'
import { useToast } from '../composables/useToast'
import { supabase } from '../utils/supabase'
import SettingsPageShell from '../components/settings/SettingsPageShell.vue'
import SettingsSection from '../components/settings/SettingsSection.vue'
import SettingsRow from '../components/settings/SettingsRow.vue'

const router = useRouter()
const { user } = useAuth()
const { show: showToast } = useToast()

const nickname = ref('')
const email = ref('')
const saving = ref(false)

onMounted(() => {
  if (user.value) {
    nickname.value = user.value.user_metadata?.nickname || user.value.email?.split('@')[0] || ''
    email.value = user.value.email || ''
  }
})

const handleSave = async () => {
  if (!nickname.value.trim()) {
    showToast('昵称不能为空')
    return
  }
  saving.value = true
  try {
    const { error } = await supabase.auth.updateUser({
      data: { nickname: nickname.value.trim() }
    })
    if (error) throw error
    showToast('保存成功')
    router.back()
  } catch (err) {
    showToast('保存失败')
    console.error('Failed to update profile:', err)
  } finally {
    saving.value = false
  }
}
</script>
```

- [ ] **Step 2: Replace `src/views/ProfileEditView.vue` template**

```vue
<template>
  <SettingsPageShell title="个人资料">
    <template #action>
      <button
        class="px-2 py-1 text-primary font-label text-sm font-bold bg-transparent border-none disabled:opacity-50"
        :disabled="saving"
        @click="handleSave"
      >
        {{ saving ? '保存中' : '保存' }}
      </button>
    </template>

    <div class="flex flex-col items-center mb-6">
      <div class="w-22 h-22 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mb-3">
        <span class="material-symbols-outlined text-primary/70" style="font-size: 44px;">person</span>
      </div>
      <p class="text-xs theme-text-secondary">头像暂不支持修改</p>
    </div>

    <SettingsSection title="账号信息">
      <div class="px-4 py-4 border-b theme-border">
        <label class="block text-xs font-bold text-primary mb-2">昵称</label>
        <input
          v-model="nickname"
          class="w-full bg-transparent border-none outline-none font-body text-sm theme-text placeholder:text-outline"
          placeholder="请输入昵称"
          maxlength="20"
        />
      </div>
      <SettingsRow icon="mail" label="邮箱" :value="email" />
      <div class="h-px mx-4" style="background: var(--theme-card-border);"></div>
      <SettingsRow icon="verified" label="会员标识" value="黄金产区直供" />
    </SettingsSection>

    <p class="text-[11px] leading-relaxed theme-text-secondary text-center px-4">
      邮箱为账号登录信息，暂不支持在此页面修改。
    </p>
  </SettingsPageShell>
</template>
```

- [ ] **Step 3: Run build**

Run: `npm run build`

Expected: still FAIL because the seven new route view files are not created yet. No new failure should come from `ProfileEditView.vue`.

---

### Task 4: Create Security, Notification, Privacy, and Cache Pages

**Files:**
- Create: `src/views/SecuritySettingsView.vue`
- Create: `src/views/NotificationSettingsView.vue`
- Create: `src/views/PrivacySettingsView.vue`
- Create: `src/views/CacheSettingsView.vue`

- [ ] **Step 1: Create `src/views/SecuritySettingsView.vue`**

```vue
<script setup>
import { computed } from 'vue'
import { useAuth } from '../composables/useAuth'
import { useToast } from '../composables/useToast'
import SettingsPageShell from '../components/settings/SettingsPageShell.vue'
import SettingsSection from '../components/settings/SettingsSection.vue'
import SettingsRow from '../components/settings/SettingsRow.vue'

const { user } = useAuth()
const { show: showToast } = useToast()

const email = computed(() => user.value?.email || '未登录')
const accountName = computed(() => user.value?.user_metadata?.nickname || user.value?.email?.split('@')[0] || '薯鲜生用户')

const showComingSoon = () => {
  showToast('功能建设中')
}
</script>

<template>
  <SettingsPageShell title="账号与安全" subtitle="管理账号登录信息，并查看基础安全建议。">
    <div class="theme-card rounded-2xl border theme-border p-4 mb-6">
      <div class="flex items-center gap-3">
        <div class="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
          <span class="material-symbols-outlined text-primary" style="font-size: 28px; font-variation-settings: 'FILL' 1;">shield_person</span>
        </div>
        <div class="min-w-0 flex-1">
          <h2 class="font-headline text-xl font-bold theme-text truncate">{{ accountName }}</h2>
          <p class="text-xs theme-text-secondary truncate">{{ email }}</p>
        </div>
        <span class="text-[10px] px-2 py-1 rounded-full bg-primary/10 text-primary font-bold">已保护</span>
      </div>
    </div>

    <SettingsSection title="账号安全">
      <SettingsRow icon="mail" label="邮箱账号" :value="email" />
      <div class="h-px mx-4" style="background: var(--theme-card-border);"></div>
      <SettingsRow icon="password" label="登录密码" description="建议定期更新密码，保护账号安全" value="建议更新" clickable show-chevron @click="showComingSoon" />
      <div class="h-px mx-4" style="background: var(--theme-card-border);"></div>
      <SettingsRow icon="phone_iphone" label="手机号绑定" description="用于订单配送和安全验证" value="未绑定" clickable show-chevron @click="showComingSoon" />
    </SettingsSection>

    <SettingsSection title="设备与建议">
      <SettingsRow icon="devices" label="当前设备" description="当前浏览器会话已登录" value="正常" />
      <div class="h-px mx-4" style="background: var(--theme-card-border);"></div>
      <SettingsRow icon="health_and_safety" label="安全建议" description="不要向他人透露验证码和登录信息" />
    </SettingsSection>
  </SettingsPageShell>
</template>
```

- [ ] **Step 2: Create `src/views/NotificationSettingsView.vue`**

```vue
<script setup>
import { ref } from 'vue'
import SettingsPageShell from '../components/settings/SettingsPageShell.vue'
import SettingsSection from '../components/settings/SettingsSection.vue'
import SettingsSwitchRow from '../components/settings/SettingsSwitchRow.vue'

const orderNotice = ref(true)
const deliveryNotice = ref(true)
const promoNotice = ref(false)
const restockNotice = ref(true)
const systemNotice = ref(true)

const loadNotificationSettings = () => ({
  orderNotice,
  deliveryNotice,
  promoNotice,
  restockNotice,
  systemNotice
})

const saveNotificationSettings = () => loadNotificationSettings()
</script>

<template>
  <SettingsPageShell title="消息通知" subtitle="先在本地调整通知偏好，后续可同步到账号。">
    <SettingsSection title="订单消息">
      <SettingsSwitchRow v-model="orderNotice" icon="receipt_long" label="订单通知" description="下单、支付、退款等订单状态变化" />
      <div class="h-px mx-4" style="background: var(--theme-card-border);"></div>
      <SettingsSwitchRow v-model="deliveryNotice" icon="local_shipping" label="配送提醒" description="发货、配送中、即将送达等提醒" />
    </SettingsSection>

    <SettingsSection title="活动与系统">
      <SettingsSwitchRow v-model="promoNotice" icon="sell" label="优惠活动" description="优惠券、满减、限时活动提醒" />
      <div class="h-px mx-4" style="background: var(--theme-card-border);"></div>
      <SettingsSwitchRow v-model="restockNotice" icon="inventory_2" label="补货提醒" description="收藏商品重新到货时通知我" />
      <div class="h-px mx-4" style="background: var(--theme-card-border);"></div>
      <SettingsSwitchRow v-model="systemNotice" icon="campaign" label="系统消息" description="服务变更和重要公告" />
    </SettingsSection>

    <p class="text-[11px] leading-relaxed theme-text-secondary px-1">
      当前设置保存在本地页面状态中，接入后端后会同步到账号。
    </p>
  </SettingsPageShell>
</template>
```

- [ ] **Step 3: Create `src/views/PrivacySettingsView.vue`**

```vue
<script setup>
import { ref } from 'vue'
import { useToast } from '../composables/useToast'
import SettingsPageShell from '../components/settings/SettingsPageShell.vue'
import SettingsSection from '../components/settings/SettingsSection.vue'
import SettingsRow from '../components/settings/SettingsRow.vue'
import SettingsSwitchRow from '../components/settings/SettingsSwitchRow.vue'

const { show: showToast } = useToast()

const personalized = ref(true)
const locationUsage = ref(true)
const browsingHistory = ref(true)

const loadPrivacySettings = () => ({ personalized, locationUsage, browsingHistory })
const savePrivacySettings = () => loadPrivacySettings()
const showDataNotice = () => showToast('数据管理功能建设中')
</script>

<template>
  <SettingsPageShell title="隐私设置" subtitle="控制个性化、位置和浏览记录等数据使用方式。">
    <SettingsSection title="数据使用">
      <SettingsSwitchRow v-model="personalized" icon="recommend" label="个性化推荐" description="根据浏览和购买偏好推荐商品" />
      <div class="h-px mx-4" style="background: var(--theme-card-border);"></div>
      <SettingsSwitchRow v-model="locationUsage" icon="location_on" label="位置服务" description="用于估算配送范围和到达时间" />
      <div class="h-px mx-4" style="background: var(--theme-card-border);"></div>
      <SettingsSwitchRow v-model="browsingHistory" icon="history" label="浏览记录" description="保留最近看过的商品，方便再次购买" />
    </SettingsSection>

    <SettingsSection title="数据管理">
      <SettingsRow icon="database" label="个人数据管理" description="查看、导出或删除账号相关数据" clickable show-chevron @click="showDataNotice" />
    </SettingsSection>

    <div class="theme-card rounded-2xl border theme-border p-4">
      <h2 class="font-headline text-lg font-bold theme-text mb-2">隐私说明</h2>
      <p class="text-sm leading-7 theme-text-secondary">
        薯鲜生只会在提供订单、配送和售后服务所需的范围内使用信息。完整说明可在隐私政策页面查看。
      </p>
    </div>
  </SettingsPageShell>
</template>
```

- [ ] **Step 4: Create `src/views/CacheSettingsView.vue`**

```vue
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
    <div class="theme-card rounded-2xl border theme-border p-5 mb-6 text-center">
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
```

- [ ] **Step 5: Run build**

Run: `npm run build`

Expected: still FAIL only because `AboutSettingsView.vue`, `UserAgreementView.vue`, and `PrivacyPolicyView.vue` are not created yet.

---

### Task 5: Create About, Agreement, and Privacy Policy Pages

**Files:**
- Create: `src/views/AboutSettingsView.vue`
- Create: `src/views/UserAgreementView.vue`
- Create: `src/views/PrivacyPolicyView.vue`

- [ ] **Step 1: Create `src/views/AboutSettingsView.vue`**

```vue
<script setup>
import { useRouter } from 'vue-router'
import SettingsPageShell from '../components/settings/SettingsPageShell.vue'
import SettingsSection from '../components/settings/SettingsSection.vue'
import SettingsRow from '../components/settings/SettingsRow.vue'

const router = useRouter()
</script>

<template>
  <SettingsPageShell title="关于薯鲜生">
    <div class="theme-card rounded-2xl border theme-border p-6 mb-6 text-center">
      <img src="/logo.png" alt="薯鲜生" class="w-20 h-20 mx-auto rounded-2xl object-contain mb-4" />
      <h2 class="font-headline text-2xl font-bold theme-text">薯鲜生</h2>
      <p class="text-xs theme-text-secondary mt-1">v1.2.0</p>
      <p class="text-sm leading-7 theme-text-secondary mt-4">
        专注新鲜薯类与产地好物，把来自黄金产区的安心食材送到家。
      </p>
    </div>

    <SettingsSection title="服务承诺">
      <SettingsRow icon="eco" label="产地直供" description="优选核心产区，减少中间流转" />
      <div class="h-px mx-4" style="background: var(--theme-card-border);"></div>
      <SettingsRow icon="local_shipping" label="及时配送" description="订单进度清晰可见，配送信息及时更新" />
      <div class="h-px mx-4" style="background: var(--theme-card-border);"></div>
      <SettingsRow icon="verified" label="品质售后" description="发现质量问题可联系售后处理" />
    </SettingsSection>

    <SettingsSection title="支持">
      <SettingsRow icon="support_agent" label="帮助中心" description="常见问题、配送与售后说明" clickable show-chevron @click="router.push('/help')" />
    </SettingsSection>
  </SettingsPageShell>
</template>
```

- [ ] **Step 2: Create `src/views/UserAgreementView.vue`**

```vue
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
```

- [ ] **Step 3: Create `src/views/PrivacyPolicyView.vue`**

```vue
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
```

- [ ] **Step 4: Run build**

Run: `npm run build`

Expected: PASS. All route components now exist.

- [ ] **Step 5: Commit pages and routes**

```bash
git add src/router/index.js src/views/SettingsView.vue src/views/ProfileEditView.vue src/views/SecuritySettingsView.vue src/views/NotificationSettingsView.vue src/views/PrivacySettingsView.vue src/views/CacheSettingsView.vue src/views/AboutSettingsView.vue src/views/UserAgreementView.vue src/views/PrivacyPolicyView.vue
git commit -m "feat: add settings secondary pages"
```

---

### Task 6: Browser Smoke Test and Polish Pass

**Files:**
- Modify only files from previous tasks if verification reveals a concrete issue.

- [ ] **Step 1: Start or confirm local server**

Run: `npm run dev -- --host 0.0.0.0`

Expected: Vite reports a local URL, usually `http://localhost:5173/`.

- [ ] **Step 2: Navigate every settings route**

Open `/settings`, then test:

- `/profile/edit`
- `/settings/security`
- `/settings/notifications`
- `/settings/privacy`
- `/settings/cache`
- `/settings/about`
- `/settings/agreement`
- `/settings/privacy-policy`

Expected:

- Every page loads.
- Header title is centered.
- Back button is visible and returns.
- Cards use current theme variables.
- No page introduces a different visual system.

- [ ] **Step 3: Verify inline background/theme behavior**

On `/settings`, tap `切换背景`.

Expected:

- Theme name changes in the row.
- App colors update.
- No navigation occurs.

- [ ] **Step 4: Verify local interactions**

On `/settings/notifications`, toggle each switch.

Expected: switches move without layout shift.

On `/settings/privacy`, toggle each switch and tap data management.

Expected: switches move without layout shift; data management shows `功能建设中`.

On `/settings/cache`, tap clear cache.

Expected: cache values become `0MB`, button changes to `已清理完成`, toast says `缓存已清理`.

- [ ] **Step 5: Verify profile save path**

On `/profile/edit`, clear nickname and tap save.

Expected: toast says `昵称不能为空`.

Enter a nickname and tap save.

Expected: Supabase update behavior remains the same as the existing page; on success, toast says `保存成功` and the app navigates back.

- [ ] **Step 6: Final build**

Run: `npm run build`

Expected: PASS.

- [ ] **Step 7: Commit polish fixes if any**

If Step 2-6 required fixes, commit only those files:

```bash
git add <fixed-files>
git commit -m "fix: polish settings secondary page flows"
```

If no fixes were needed, do not create an empty commit.

---

## Self-Review

Spec coverage:

- Secondary pages: covered by Tasks 3-5.
- Background/theme stays inline: covered by Task 2 and Task 6.
- Technology stack consistency: covered by Task 1 component choices and no dependency changes.
- UI enhancement within current visual style: covered by shared components and Task 6 smoke checks.
- Backend-ready local state: covered by notification, privacy, security, and cache page functions.
- Verification: covered by build and browser smoke tests.

Placeholder scan:

- The plan uses concrete file paths, component APIs, route names, and verification commands.
- There are no unresolved implementation holes.

Type consistency:

- `SettingsSwitchRow` uses `modelValue` and `update:modelValue`, matching `v-model` usage.
- `SettingsRow` emits `click`, matching `@click` usage.
- `SettingsDocument` uses `updatedAt`, exposed in template as `updated-at`.
