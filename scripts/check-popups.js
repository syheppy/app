// 检查弹窗数据的脚本
import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// 读取 .env 文件
const envPath = join(__dirname, '..', '.env')
const envContent = readFileSync(envPath, 'utf-8')
const envVars = {}
envContent.split('\n').forEach(line => {
  const [key, value] = line.split('=')
  if (key && value) {
    envVars[key.trim()] = value.trim()
  }
})

const supabaseUrl = envVars.VITE_SUPABASE_URL
const supabaseKey = envVars.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('请先配置 .env 文件中的 VITE_SUPABASE_URL 和 VITE_SUPABASE_ANON_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkPopups() {
  console.log('正在查询弹窗数据...\n')

  // 查询所有弹窗
  const { data, error } = await supabase
    .from('popups')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('查询失败:', error.message)
    return
  }

  if (!data || data.length === 0) {
    console.log('❌ 数据库中没有弹窗数据')
    console.log('\n请在 Supabase 控制台执行以下 SQL 添加弹窗：')
    console.log(`
INSERT INTO popups (title, content, image_url, link_url, frequency, is_active)
VALUES (
  '新季丰收礼遇',
  '您的 50 元 专享券已到账，下单立享顺丰包邮',
  'https://lh3.googleusercontent.com/aida/ADBb0uiSU54_g3nmA8rJT-tXJpsN0WgzHOkS5cHyxyj1qSH-2i7pDm2oRxLrhtnA9J8gD0p6K8axFH-dzIVy2Qyj6bBSdsYqlAtCH_hVccROJWcD5XVwMFDU5UG6-Bwck8dvQPSS1l2AEZNzStQBeZqphuQ-KBjXGyIPj3aQdPBtAFe7ny95_h2wV9cnOn9xSTQV5kNSafz3f1uGOjxtKRCFB0trQJnNOE8mqozujZTrCOZvQ3TKKfmenGn8sNAL',
  '/product/93965c2a-3a6c-4f85-b165-c837e19f2991',
  'every',
  true
);
    `)
    return
  }

  console.log(`✅ 找到 ${data.length} 条弹窗数据：\n`)

  data.forEach((popup, index) => {
    console.log(`--- 弹窗 ${index + 1} ---`)
    console.log(`ID: ${popup.id}`)
    console.log(`标题: ${popup.title}`)
    console.log(`内容: ${popup.content || '无'}`)
    console.log(`图片: ${popup.image_url ? '有' : '无'}`)
    console.log(`链接: ${popup.link_url || '无'}`)
    console.log(`频率: ${popup.frequency}`)
    console.log(`启用: ${popup.is_active ? '是' : '否'}`)
    console.log(`创建时间: ${popup.created_at}`)
    console.log('')
  })

  // 检查启用的弹窗
  const activePopups = data.filter(p => p.is_active)
  console.log(`启用的弹窗: ${activePopups.length} 个`)

  if (activePopups.length === 0) {
    console.log('⚠️ 没有启用的弹窗，弹窗不会显示')
  }
}

checkPopups().catch(console.error)
