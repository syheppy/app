<script setup>
import { ref, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'
import { useToast } from '../composables/useToast'
import { supabase } from '../utils/supabase'

const router = useRouter()
const { user, loading: authLoading } = useAuth()
const { show: showToast } = useToast()

const addresses = ref([])
const loading = ref(true)
const showForm = ref(false)
const editingId = ref(null)

const form = ref({ name: '', phone: '', address: '', tag: '', is_default: false })

const fetchAddresses = async (uid) => {
  const { data } = await supabase
    .from('addresses')
    .select('*')
    .eq('user_id', uid)
    .order('is_default', { ascending: false })
  if (data) addresses.value = data
  loading.value = false
}

onMounted(() => {
  // 等 auth 初始化完成
  if (!authLoading.value && user.value) {
    fetchAddresses(user.value.id)
  } else if (!authLoading.value && !user.value) {
    loading.value = false
  }
  // 如果 auth 还在加载，watch 会处理
})

// 监听 auth 状态变化（处理异步初始化）
watch([authLoading, user], ([isLoading, u]) => {
  if (!isLoading && u) {
    fetchAddresses(u.id)
  } else if (!isLoading && !u) {
    loading.value = false
  }
}, { immediate: true })

const resetForm = () => {
  form.value = { name: '', phone: '', address: '', tag: '', is_default: false }
  editingId.value = null
}

const openAdd = () => {
  resetForm()
  showForm.value = true
}

const openEdit = (addr) => {
  editingId.value = addr.id
  form.value = { name: addr.name, phone: addr.phone, address: addr.address, tag: addr.tag || '', is_default: addr.is_default }
  showForm.value = true
}

const handleSave = async () => {
  if (!form.value.name || !form.value.phone || !form.value.address) {
    showToast('请填写完整地址信息')
    return
  }
  if (!user.value) {
    showToast('请先登录')
    router.push('/login')
    return
  }

  if (editingId.value) {
    const { error } = await supabase.from('addresses').update(form.value).eq('id', editingId.value)
    if (error) { showToast('保存失败：' + error.message); return }
    const idx = addresses.value.findIndex(a => a.id === editingId.value)
    if (idx !== -1) addresses.value[idx] = { ...addresses.value[idx], ...form.value }
  } else {
    const { data, error } = await supabase
      .from('addresses')
      .insert({ ...form.value, user_id: user.value.id })
      .select()
      .single()
    if (error) { showToast('保存失败：' + error.message); return }
    if (data) addresses.value.push(data)
  }
  showForm.value = false
  showToast('地址保存成功')
  resetForm()
}

const handleDelete = async (id) => {
  await supabase.from('addresses').delete().eq('id', id)
  addresses.value = addresses.value.filter(a => a.id !== id)
}

const handleSelect = (addr) => {
  // 把选中的地址存入 sessionStorage，结算页面会读取
  sessionStorage.setItem('selectedAddress', JSON.stringify(addr))
  router.back()
}
</script>

<template>
  <div class="min-h-screen bg-background text-on-surface">
    <!-- Header -->
    <div class="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-outline-variant/30">
      <div class="flex items-center justify-between px-4 h-14 max-w-lg mx-auto">
        <button class="p-2 active:scale-95 transition-transform" @click="router.back()">
          <span class="material-symbols-outlined text-on-surface">arrow_back</span>
        </button>
        <h1 class="font-headline text-base font-bold text-on-surface">选择收货地址</h1>
        <div class="w-10"></div>
      </div>
    </div>

    <div class="max-w-lg mx-auto px-4 py-4">
      <!-- Address List -->
      <div v-if="loading" class="text-center py-12 text-on-surface-variant">加载中...</div>

      <div v-else-if="addresses.length > 0" class="flex flex-col gap-3 mb-6">
        <div v-for="addr in addresses" :key="addr.id" class="bg-surface-container-low rounded-xl p-4 border border-outline-variant/30 relative cursor-pointer" @click="handleSelect(addr)">
          <!-- Default Badge -->
          <div v-if="addr.is_default" class="absolute top-3 right-3 w-6 h-6 rounded bg-primary flex items-center justify-center">
            <span class="material-symbols-outlined text-white" style="font-size: 16px;">check</span>
          </div>

          <div class="flex items-center gap-2 mb-2">
            <span class="font-label text-base font-bold text-on-surface">{{ addr.name }}</span>
            <span class="font-body text-sm text-on-surface-variant">{{ addr.phone }}</span>
            <span v-if="addr.tag" class="font-label text-[10px] px-2 py-0.5 rounded-full bg-primary-container/10 text-primary">{{ addr.tag }}</span>
          </div>
          <p class="font-body text-sm text-on-surface-variant leading-relaxed mb-3">{{ addr.address }}</p>
          <div class="flex justify-end gap-2">
            <button class="p-1 active:scale-95 transition-transform" @click.stop="openEdit(addr)">
              <span class="material-symbols-outlined text-outline" style="font-size: 18px;">edit</span>
            </button>
            <button class="p-1 active:scale-95 transition-transform" @click.stop="handleDelete(addr.id)">
              <span class="material-symbols-outlined text-outline" style="font-size: 18px;">delete</span>
            </button>
          </div>
        </div>
      </div>

      <div v-else class="text-center py-12">
        <span class="material-symbols-outlined text-outline mb-4" style="font-size: 48px;">location_off</span>
        <p class="text-on-surface-variant text-sm mb-4">暂无收货地址</p>
      </div>

      <!-- Add Button -->
      <button class="w-full py-3.5 rounded-xl bg-primary text-on-primary font-bold flex items-center justify-center gap-2 active:scale-[0.98] transition-transform shadow-[0_4px_20px_rgba(194,101,42,0.2)]" @click="openAdd">
        <span class="material-symbols-outlined" style="font-size: 20px;">add</span>
        新增收货地址
      </button>
    </div>

    <!-- Add/Edit Form Modal -->
    <Teleport to="body">
      <Transition name="drawer">
        <div v-if="showForm" class="fixed inset-0 z-50 flex items-end justify-center" @click.self="showForm = false">
          <div class="absolute inset-0 bg-black/40"></div>
          <div class="relative bg-surface-container-lowest rounded-t-2xl w-full max-w-lg p-6 pb-safe z-10">
            <h3 class="font-headline text-lg font-bold text-on-surface mb-4">{{ editingId ? '编辑地址' : '新增地址' }}</h3>
            <div class="flex flex-col gap-3">
              <input v-model="form.name" type="text" placeholder="收货人姓名" class="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-outline-variant/30 text-sm text-on-surface placeholder:text-outline focus:outline-none focus:border-primary" />
              <input v-model="form.phone" type="tel" placeholder="联系电话" class="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-outline-variant/30 text-sm text-on-surface placeholder:text-outline focus:outline-none focus:border-primary" />
              <input v-model="form.address" type="text" placeholder="详细地址" class="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-outline-variant/30 text-sm text-on-surface placeholder:text-outline focus:outline-none focus:border-primary" />
              <div class="flex gap-2">
                <button v-for="t in ['家', '公司']" :key="t" @click="form.tag = form.tag === t ? '' : t" class="px-4 py-2 rounded-lg text-sm font-medium border transition-colors" :class="form.tag === t ? 'bg-primary text-on-primary border-primary' : 'bg-transparent text-on-surface-variant border-outline-variant'">
                  {{ t }}
                </button>
              </div>
              <label class="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" v-model="form.is_default" class="accent-primary" />
                <span class="font-body text-sm text-on-surface-variant">设为默认地址</span>
              </label>
            </div>
            <div class="flex gap-3 mt-6">
              <button class="flex-1 py-3 rounded-xl border border-outline-variant text-on-surface-variant font-bold bg-transparent" @click="showForm = false">取消</button>
              <button class="flex-1 py-3 rounded-xl bg-primary text-on-primary font-bold" @click="handleSave">保存</button>
            </div>
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
