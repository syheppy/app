import puppeteer from 'puppeteer'
import fs from 'fs'
import path from 'path'

// 配置
const CONFIG = {
  baseUrl: 'http://localhost:5173',
  viewport: { width: 402, height: 874 },
  credentials: {
    email: '3182253682@qq.com',
    password: '123456'
  },
  outputDir: path.join(process.cwd(), 'src', 'screenshots'),
  timeout: 30000,
  waitAfterLoad: 2000, // 页面加载后等待时间
}

// 页面列表
const PAGES = [
  // 不需要登录的页面
  { path: '/', name: '01-home', needAuth: false },
  { path: '/splash', name: '02-splash', needAuth: false },
  { path: '/category', name: '03-category', needAuth: false },
  { path: '/search', name: '04-search', needAuth: false },
  { path: '/login', name: '05-login', needAuth: false },
  { path: '/register', name: '06-register', needAuth: false },
  { path: '/help', name: '07-help', needAuth: false },
  { path: '/settings/agreement', name: '08-agreement', needAuth: false },
  { path: '/settings/privacy-policy', name: '09-privacy-policy', needAuth: false },
  { path: '/settings/about', name: '10-about', needAuth: false },

  // 需要登录的页面
  { path: '/cart', name: '11-cart', needAuth: true },
  { path: '/profile', name: '12-profile', needAuth: true },
  { path: '/orders', name: '13-orders', needAuth: true },
  { path: '/favorites', name: '14-favorites', needAuth: true },
  { path: '/coupons', name: '15-coupons', needAuth: true },
  { path: '/address', name: '16-address', needAuth: true },
  { path: '/checkout', name: '17-checkout', needAuth: true },
  { path: '/payment/test123', name: '18-payment', needAuth: true },
  { path: '/payment-success', name: '19-payment-success', needAuth: true },
  { path: '/settings', name: '20-settings', needAuth: true },
  { path: '/settings/security', name: '21-security', needAuth: true },
  { path: '/settings/notifications', name: '22-notifications', needAuth: true },
  { path: '/settings/privacy', name: '23-privacy', needAuth: true },
  { path: '/settings/cache', name: '24-cache', needAuth: true },
  { path: '/profile/edit', name: '25-profile-edit', needAuth: true },
]

// 确保输出目录存在
if (!fs.existsSync(CONFIG.outputDir)) {
  fs.mkdirSync(CONFIG.outputDir, { recursive: true })
}

console.log(`📱 苹果17尺寸：${CONFIG.viewport.width} × ${CONFIG.viewport.height}`)
console.log(`📁 输出目录：${CONFIG.outputDir}`)
console.log(`📄 截图页面：${PAGES.length} 个\n`)

async function main() {
  // 启动浏览器
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  })

  const page = await browser.newPage()

  // 设置视口尺寸
  await page.setViewport(CONFIG.viewport)

  // 设置超时时间
  page.setDefaultTimeout(CONFIG.timeout)

  // 先登录
  console.log('🔐 登录中...\n')
  await login(page)

  // 逐个截图
  for (const p of PAGES) {
    await screenshotPage(page, p)
  }

  await browser.close()

  // 统计结果
  const files = fs.readdirSync(CONFIG.outputDir).filter(f => f.endsWith('.png'))
  console.log(`\n✨ 截图完成！成功 ${files.length}/${PAGES.length} 个`)
  console.log(`📁 位置：${CONFIG.outputDir}`)
}

async function login(page) {
  try {
    // 先访问首页，设置 sessionStorage 跳过启动页
    await page.goto(`${CONFIG.baseUrl}/`, { waitUntil: 'networkidle0' })
    await page.evaluate(() => {
      sessionStorage.setItem('hasSeenSplash', 'true')
    })
    await new Promise(r => setTimeout(r, 1000))

    // 访问登录页面
    await page.goto(`${CONFIG.baseUrl}/login`, { waitUntil: 'networkidle0' })
    await new Promise(r => setTimeout(r, 1000))

    // 输入邮箱
    await page.type('input[type="email"]', CONFIG.credentials.email, { delay: 50 })

    // 输入密码
    await page.type('input[type="password"]', CONFIG.credentials.password, { delay: 50 })

    // 点击登录按钮
    await page.click('button[type="submit"]')

    // 等待登录成功（跳转到首页）
    await page.waitForNavigation({ waitUntil: 'networkidle0' })
    await new Promise(r => setTimeout(r, 2000))

    console.log('✅ 登录成功！\n')
  } catch (err) {
    console.error('❌ 登录失败：', err.message)
    throw err
  }
}

async function screenshotPage(page, pageInfo) {
  try {
    console.log(`📸 ${pageInfo.name}...`)

    // 访问页面
    await page.goto(`${CONFIG.baseUrl}${pageInfo.path}`, {
      waitUntil: 'networkidle0',
      timeout: CONFIG.timeout
    })

    // 等待页面加载完成
    await new Promise(r => setTimeout(r, CONFIG.waitAfterLoad))

    // 等待可能的动画完成
    await new Promise(r => setTimeout(r, 1000))

    // 全页截图
    const screenshotPath = path.join(CONFIG.outputDir, `${pageInfo.name}.png`)
    await page.screenshot({
      path: screenshotPath,
      fullPage: true
    })

    console.log(`   ✅ 已保存：${pageInfo.name}.png`)
  } catch (err) {
    console.error(`   ❌ 失败：${err.message}`)
  }
}

// 运行
main().catch(console.error)
