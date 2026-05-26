import { ref, computed } from 'vue'
import { supabase } from '../utils/supabase'

const user = ref(null)
const session = ref(null)
const loading = ref(true)

// 初始化：恢复 session
supabase.auth.getSession().then(({ data }) => {
  session.value = data.session
  user.value = data.session?.user ?? null
  loading.value = false
})

// 监听 auth 状态变化
supabase.auth.onAuthStateChange((_event, _session) => {
  session.value = _session
  user.value = _session?.user ?? null
})

const isLoggedIn = computed(() => !!user.value)

async function signUp(email, password) {
  const { data, error } = await supabase.auth.signUp({ email, password })
  return { data, error }
}

async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  return { data, error }
}

async function signOut() {
  const { error } = await supabase.auth.signOut()
  return { error }
}

export function useAuth() {
  return {
    user,
    session,
    loading,
    isLoggedIn,
    signUp,
    signIn,
    signOut
  }
}
