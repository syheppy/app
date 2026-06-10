import fs from 'fs'
import path from 'path'
import https from 'https'

// 图标映射：Material Symbols 名称 -> MDI (Material Design Icons) 名称
const iconMapping = {
  'account_balance_wallet': 'wallet',
  'add': 'plus',
  'add_shopping_cart': 'cart-plus',
  'arrow_back': 'arrow-left',
  'arrow_forward': 'arrow-right',
  'category': 'view-grid',
  'chat': 'chat',
  'check': 'check',
  'check_circle': 'check-circle',
  'chevron_right': 'chevron-right',
  'close': 'close',
  'confirmation_number': 'ticket',
  'credit_card': 'credit-card',
  'delete': 'delete',
  'edit': 'pencil',
  'error_outline': 'alert-circle',
  'expand_more': 'chevron-down',
  'favorite': 'heart',
  'favorite_border': 'heart-outline',
  'filter_list': 'filter-variant',
  'home': 'home',
  'image': 'image',
  'local_fire_department': 'fire',
  'local_shipping': 'truck-delivery',
  'location_off': 'map-marker-off',
  'location_on': 'map-marker',
  'lock': 'lock',
  'mail': 'email',
  'notifications': 'bell',
  'person': 'account',
  'progress_activity': 'progress-clock',
  'receipt_long': 'receipt',
  'recommend': 'thumb-up',
  'remove': 'minus',
  'restaurant': 'food-fork-drink',
  'schedule': 'clock-outline',
  'search': 'magnify',
  'search_off': 'magnify-close',
  'settings': 'cog',
  'shield_person': 'shield-account',
  'shopping_bag': 'shopping',
  'shopping_basket': 'basket',
  'shopping_cart': 'cart',
  'star': 'star',
  'storefront': 'store',
  'support_agent': 'headset',
  'token': 'token'
}

// 输出目录
const outputDir = path.join(process.cwd(), 'src', 'assets', 'icons')

// 确保目录存在
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true })
}

// 下载单个图标
function downloadIcon(originalName, mdiName) {
  return new Promise((resolve, reject) => {
    const url = `https://api.iconify.design/mdi:${mdiName}.svg?color=%23333`

    https.get(url, (res) => {
      if (res.statusCode === 200) {
        let data = ''
        res.on('data', (chunk) => data += chunk)
        res.on('end', () => {
          const filePath = path.join(outputDir, `${originalName}.svg`)
          fs.writeFileSync(filePath, data)
          console.log(`✅ ${originalName}.svg`)
          resolve()
        })
      } else {
        console.log(`❌ ${originalName} (${mdiName}) - HTTP ${res.statusCode}`)
        resolve()
      }
    }).on('error', (err) => {
      console.log(`❌ ${originalName} - ${err.message}`)
      resolve()
    })
  })
}

// 批量下载
async function downloadAll() {
  const entries = Object.entries(iconMapping)
  console.log(`📦 开始下载 ${entries.length} 个图标...\n`)
  console.log(`📁 保存到: ${outputDir}\n`)

  // 每次下载5个
  const batchSize = 5
  for (let i = 0; i < entries.length; i += batchSize) {
    const batch = entries.slice(i, i + batchSize)
    await Promise.all(batch.map(([name, mdi]) => downloadIcon(name, mdi)))
    await new Promise(r => setTimeout(r, 100))
  }

  // 统计结果
  const downloaded = fs.readdirSync(outputDir).filter(f => f.endsWith('.svg'))
  console.log(`\n✨ 下载完成！成功 ${downloaded.length}/${entries.length} 个图标`)
  console.log(`📁 位置: ${outputDir}`)
}

downloadAll()
