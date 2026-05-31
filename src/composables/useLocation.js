import { ref } from 'vue'
import { Geolocation } from '@capacitor/geolocation'

const city = ref(localStorage.getItem('user_city') || '定位中...')
const loading = ref(false)

const CACHE_KEY = 'user_city'
const CACHE_TIME_KEY = 'user_city_time'
const CACHE_DURATION = 24 * 60 * 60 * 1000 // 24小时

function isCacheValid() {
  const t = localStorage.getItem(CACHE_TIME_KEY)
  return t && Date.now() - Number(t) < CACHE_DURATION
}

// 反向地理编码 - 使用多个备用服务
async function reverseGeocode(lat, lng) {
  // 方案1: 使用 Nominatim (OpenStreetMap)
  try {
    const resp = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&accept-language=zh-CN`,
      { timeout: 8000 }
    )
    if (resp.ok) {
      const data = await resp.json()
      const addr = data.address || {}
      const name = addr.city || addr.town || addr.county || addr.state || '未知位置'
      if (name !== '未知位置') return name
    }
  } catch (e) {
    console.warn('Nominatim 失败:', e)
  }

  // 方案2: 使用 BigDataCloud (免费 API)
  try {
    const resp = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=zh`,
      { timeout: 8000 }
    )
    if (resp.ok) {
      const data = await resp.json()
      const name = data.city || data.locality || data.principalSubdivision || '未知位置'
      if (name !== '未知位置') return name
    }
  } catch (e) {
    console.warn('BigDataCloud 失败:', e)
  }

  // 方案3: 使用 ipapi.co 基于 IP 的定位（作为最后备用）
  try {
    const resp = await fetch('https://ipapi.co/json/', { timeout: 5000 })
    if (resp.ok) {
      const data = await resp.json()
      return data.city || '未知位置'
    }
  } catch (e) {
    console.warn('IP 定位失败:', e)
  }

  return '定位失败'
}

async function locate() {
  if (isCacheValid()) {
    city.value = localStorage.getItem(CACHE_KEY)
    return
  }

  loading.value = true

  try {
    // 检查权限状态
    const permStatus = await Geolocation.checkPermissions()
    let granted = permStatus.location === 'granted'

    if (!granted) {
      const perm = await Geolocation.requestPermissions()
      granted = perm.location === 'granted'
    }

    if (!granted) {
      console.warn('定位权限被拒绝')
      city.value = '北京市'
      loading.value = false
      return
    }

    // 使用高精度定位，增加超时时间到 30 秒
    const pos = await Geolocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 30000,
      maximumAge: 60000 // 允许使用 1 分钟内的缓存位置
    })

    console.log('定位成功:', pos.coords.latitude, pos.coords.longitude)
    const name = await reverseGeocode(pos.coords.latitude, pos.coords.longitude)

    city.value = name
    localStorage.setItem(CACHE_KEY, name)
    localStorage.setItem(CACHE_TIME_KEY, String(Date.now()))
  } catch (err) {
    console.error('定位失败:', err)
    // 如果有缓存就用缓存，否则用默认值
    if (!localStorage.getItem(CACHE_KEY)) {
      city.value = '北京市'
    }
  }

  loading.value = false
}

export function useLocation() {
  return { city, loading, locate }
}
