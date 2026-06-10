import fs from 'fs'
import path from 'path'
import sharp from 'sharp'

// SVG 所在目录
const svgDir = path.join(process.cwd(), 'src', 'assets', 'icons')
// PNG 输出目录
const pngDir = path.join(process.cwd(), 'src', 'assets', 'icons-png')

// 图标尺寸（像素）
const SIZE = 512

// 主题颜色
const COLORS = {
  primary: '#c2652a',        // 主色（橙色）
  onSurface: '#3a302a',      // 文字色（深棕）
  onSurfaceVariant: '#605850', // 次要文字（灰色）
  outline: '#9a9088',        // 轮廓灰
  tertiary: '#8c3c3c',       // 第三色（红棕）
  error: '#c0392b',          // 错误红
  wechatGreen: '#09B83E',    // 微信绿
  alipayBlue: '#1677FF',     // 支付宝蓝
  successGreen: '#16a34a'    // 成功绿
}

// 图标颜色映射
const iconColors = {
  // 主色 #c2652a
  'confirmation_number': COLORS.primary,
  'favorite': COLORS.primary,
  'favorite_border': COLORS.primary,
  'location_on': COLORS.primary,
  'location_off': COLORS.primary,
  'help': COLORS.primary,
  'person': COLORS.primary,
  'star': COLORS.primary,
  'schedule': COLORS.primary,
  'account_balance_wallet': COLORS.primary,
  'receipt_long': COLORS.primary,
  'recommend': COLORS.primary,
  'token': COLORS.primary,
  'support_agent': COLORS.primary,
  'local_shipping': COLORS.primary,
  'shield_person': COLORS.primary,

  // 文字色 #3a302a
  'arrow_back': COLORS.onSurface,
  'arrow_forward': COLORS.onSurface,
  'chevron_right': COLORS.onSurface,
  'close': COLORS.onSurface,
  'storefront': COLORS.onSurface,
  'expand_more': COLORS.onSurface,

  // 灰色 #9a9088
  'search': COLORS.outline,
  'search_off': COLORS.outline,
  'filter_list': COLORS.outline,
  'edit': COLORS.outline,
  'delete': COLORS.outline,
  'image': COLORS.outline,
  'error_outline': COLORS.outline,
  'category': COLORS.outline,
  'notifications': COLORS.outline,
  'progress_activity': COLORS.outline,

  // 红棕色 #8c3c3c
  'credit_card': COLORS.tertiary,

  // 红色 #c0392b
  'local_fire_department': COLORS.error,
  'remove': COLORS.error,

  // 绿色 #09B83E
  'chat': COLORS.wechatGreen,

  // 蓝色 #1677ff（支付宝）
  // account_balance_wallet 已经在主色中

  // 成功绿 #16a34a
  'check_circle': COLORS.successGreen,

  // 其他
  'add': COLORS.primary,
  'add_shopping_cart': COLORS.primary,
  'shopping_cart': COLORS.primary,
  'shopping_bag': COLORS.primary,
  'shopping_basket': COLORS.primary,
  'check': COLORS.primary,
  'mail': COLORS.onSurfaceVariant,
  'lock': COLORS.onSurfaceVariant,
  'settings': COLORS.onSurfaceVariant,
  'restaurant': COLORS.outline,
  'location_on': COLORS.primary,
}

// 默认颜色（如果图标没在映射中）
const DEFAULT_COLOR = COLORS.outline

// 确保输出目录存在
if (!fs.existsSync(pngDir)) {
  fs.mkdirSync(pngDir, { recursive: true })
}

// 获取所有 SVG 文件
const svgFiles = fs.readdirSync(svgDir).filter(f => f.endsWith('.svg'))

console.log(`📦 找到 ${svgFiles.length} 个 SVG 文件\n`)
console.log(`🎨 使用 app 主题颜色\n`)
console.log(`📁 输出到: ${pngDir}\n`)

// 给 SVG 添加颜色
function addColorToSvg(svgContent, color) {
  // 移除现有的 fill 和 stroke 属性，然后添加新颜色
  let modified = svgContent
    .replace(/fill="[^"]*"/g, `fill="${color}"`)
    .replace(/stroke="[^"]*"/g, `stroke="${color}"`)
    .replace(/fill='[^']*'/g, `fill='${color}'`)
    .replace(/stroke='[^']*'/g, `stroke='${color}'`)

  // 如果 SVG 没有 fill 或 stroke，添加一个
  if (!modified.includes('fill=') && !modified.includes('stroke=')) {
    modified = modified.replace(/<svg/, `<svg fill="${color}"`)
  }

  return modified
}

// 批量转换
async function convertAll() {
  for (const file of svgFiles) {
    const svgPath = path.join(svgDir, file)
    const pngPath = path.join(pngDir, file.replace('.svg', '.png'))

    try {
      // 读取 SVG 内容
      let svgContent = fs.readFileSync(svgPath, 'utf8')

      // 获取图标名称（去掉 .svg 后缀）
      const iconName = file.replace('.svg', '')

      // 获取颜色
      const color = iconColors[iconName] || DEFAULT_COLOR

      // 添加颜色
      svgContent = addColorToSvg(svgContent, color)

      // 转换为 PNG
      await sharp(Buffer.from(svgContent))
        .resize(SIZE, SIZE)
        .png()
        .toFile(pngPath)

      console.log(`✅ ${iconName}.png [${color}]`)
    } catch (err) {
      console.log(`❌ ${file} - ${err.message}`)
    }
  }

  const pngFiles = fs.readdirSync(pngDir).filter(f => f.endsWith('.png'))
  console.log(`\n✨ 转换完成！成功 ${pngFiles.length}/${svgFiles.length} 个`)
}

convertAll()
