import gsap from 'gsap'

/**
 * 弹性活泼风格动画工具库
 * 使用 ease: 'back.out(1.7)' 实现回弹效果
 */

// ============================================
// 页面切换动画
// ============================================

/**
 * 页面进入动画
 */
export function pageEnter(el, done) {
  gsap.fromTo(el,
    { opacity: 0, y: 30 },
    {
      opacity: 1,
      y: 0,
      duration: 0.5,
      ease: 'back.out(1.4)',
      onComplete: done
    }
  )
}

/**
 * 页面离开动画
 */
export function pageLeave(el, done) {
  gsap.to(el,
    {
      opacity: 0,
      y: -20,
      duration: 0.3,
      ease: 'power2.in',
      onComplete: done
    }
  )
}

// ============================================
// 列表入场动画
// ============================================

/**
 * 列表 stagger 动画（弹性）
 */
export function staggerItems(selector, options = {}) {
  const defaults = {
    opacity: 0,
    y: 40,
    scale: 0.95,
    duration: 0.6,
    ease: 'back.out(1.7)',
    stagger: 0.08
  }
  return gsap.from(selector, { ...defaults, ...options })
}

/**
 * 卡片入场动画
 */
export function cardEnter(el) {
  gsap.fromTo(el,
    { opacity: 0, y: 30, scale: 0.9 },
    {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.5,
      ease: 'back.out(1.7)'
    }
  )
}

// ============================================
// 弹窗动画
// ============================================

/**
 * 弹窗进入动画（弹性缩放）
 */
export function popupEnter(el, done) {
  gsap.fromTo(el,
    { scale: 0.7, opacity: 0 },
    {
      scale: 1,
      opacity: 1,
      duration: 0.4,
      ease: 'back.out(2)',
      onComplete: done
    }
  )
}

/**
 * 弹窗离开动画
 */
export function popupLeave(el, done) {
  gsap.to(el,
    {
      scale: 0.8,
      opacity: 0,
      duration: 0.25,
      ease: 'power2.in',
      onComplete: done
    }
  )
}

// ============================================
// 按钮反馈动画
// ============================================

/**
 * 按钮点击缩放
 */
export function buttonTap(el) {
  gsap.to(el,
    {
      scale: 0.92,
      duration: 0.1,
      ease: 'power2.out',
      yoyo: true,
      repeat: 1
    }
  )
}

/**
 * 购物车添加动画
 */
export function addToCartAnimation(el) {
  gsap.fromTo(el,
    { scale: 1 },
    {
      scale: 1.3,
      duration: 0.15,
      ease: 'power2.out',
      yoyo: true,
      repeat: 1
    }
  )
}

// ============================================
// 图片加载动画
// ============================================

/**
 * 图片渐入动画
 */
export function imageFadeIn(el) {
  gsap.fromTo(el,
    { opacity: 0, scale: 1.05 },
    {
      opacity: 1,
      scale: 1,
      duration: 0.5,
      ease: 'power2.out'
    }
  )
}

// ============================================
// 滚动触发动画
// ============================================

/**
 * 滚动渐入动画
 */
export function scrollReveal(selector) {
  const elements = document.querySelectorAll(selector)
  elements.forEach(el => {
    gsap.fromTo(el,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'back.out(1.4)',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      }
    )
  })
}

// ============================================
// 数字动画
// ============================================

/**
 * 数字递增动画
 */
export function countUp(el, target, duration = 1) {
  const obj = { value: 0 }
  gsap.to(obj, {
    value: target,
    duration,
    ease: 'power2.out',
    onUpdate: () => {
      el.textContent = Math.round(obj.value)
    }
  })
}

// ============================================
// 抽屉动画
// ============================================

/**
 * 底部抽屉进入
 */
export function drawerEnter(el, done) {
  gsap.fromTo(el,
    { y: '100%' },
    {
      y: '0%',
      duration: 0.4,
      ease: 'back.out(1.2)',
      onComplete: done
    }
  )
}

/**
 * 底部抽屉离开
 */
export function drawerLeave(el, done) {
  gsap.to(el,
    {
      y: '100%',
      duration: 0.3,
      ease: 'power2.in',
      onComplete: done
    }
  )
}

// ============================================
// 工具函数
// ============================================

/**
 * 延迟执行
 */
export function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * 执行动画序列
 */
export async function sequence(...fns) {
  for (const fn of fns) {
    await fn()
  }
}
