import { reactive, computed } from 'vue'
import { supabase } from '../utils/supabase'

const state = reactive({
  items: []
})

let currentUserId = null

// 设置当前用户（登录/登出时调用）
export function setCartUser(userId) {
  currentUserId = userId
}

// 从 Supabase 加载购物车
export async function loadCartFromServer() {
  if (!currentUserId) return
  const { data, error } = await supabase
    .from('cart_items')
    .select('id, product_id, quantity, products(name, price, image_url)')
    .eq('user_id', currentUserId)
  if (error || !data) return

  state.items.splice(0, state.items.length)
  data.forEach(row => {
    state.items.push({
      id: row.product_id,
      cartItemId: row.id,
      name: row.products?.name || '',
      price: Number(row.products?.price || 0),
      image: row.products?.image_url || '',
      quantity: row.quantity
    })
  })
}

// 清空内存购物车
export function clearCartMemory() {
  state.items.splice(0, state.items.length)
}

export function useCart() {
  const addItem = async (product) => {
    const existing = state.items.find(i => i.id === product.id)
    if (existing) {
      existing.quantity++
      // 同步到服务器
      if (currentUserId) {
        await supabase
          .from('cart_items')
          .update({ quantity: existing.quantity })
          .eq('user_id', currentUserId)
          .eq('product_id', product.id)
      }
    } else {
      const newItem = {
        id: product.id,
        name: product.name,
        price: Number(product.price),
        image: product.image_url || product.image,
        quantity: 1
      }
      state.items.push(newItem)
      // 同步到服务器
      if (currentUserId) {
        const { data } = await supabase
          .from('cart_items')
          .insert({
            user_id: currentUserId,
            product_id: product.id,
            quantity: 1
          })
          .select('id')
          .single()
        if (data) newItem.cartItemId = data.id
      }
    }
  }

  const removeItem = async (id) => {
    const idx = state.items.findIndex(i => i.id === id)
    if (idx === -1) return
    const item = state.items[idx]
    state.items.splice(idx, 1)
    // 同步到服务器
    if (currentUserId) {
      await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', currentUserId)
        .eq('product_id', id)
    }
  }

  const updateQuantity = async (id, delta) => {
    const item = state.items.find(i => i.id === id)
    if (!item) return
    item.quantity += delta
    if (item.quantity <= 0) {
      await removeItem(id)
      return
    }
    // 同步到服务器
    if (currentUserId) {
      await supabase
        .from('cart_items')
        .update({ quantity: item.quantity })
        .eq('user_id', currentUserId)
        .eq('product_id', id)
    }
  }

  const clearCart = async () => {
    state.items.splice(0, state.items.length)
    // 同步到服务器
    if (currentUserId) {
      await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', currentUserId)
    }
  }

  const totalCount = computed(() =>
    state.items.reduce((sum, i) => sum + i.quantity, 0)
  )

  const totalPrice = computed(() =>
    state.items.reduce((sum, i) => sum + i.price * i.quantity, 0)
  )

  return {
    items: state.items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    totalCount,
    totalPrice
  }
}
