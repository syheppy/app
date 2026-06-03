# 薯鲜生 - 字体规范

## 字体选择

| 用途 | 字体 | 类型 | 说明 |
|------|------|------|------|
| **Display/Headline** | EB Garamond | 衬线体 | 优雅、高端感 |
| **Body/Label** | Manrope | 无衬线体 | 现代、易读 |
| **Icons** | Material Symbols | 图标字体 | 统一图标风格 |

---

## 字体层级

### Display - 大标题

| 类名 | 字号 | 行高 | 字重 | 用途 |
|------|------|------|------|------|
| `.text-display-lg` | 32px | 1.2 | Bold | 首页大标题 |
| `.text-display-md` | 28px | 1.2 | Bold | Banner 标题 |
| `.text-display-sm` | 24px | 1.2 | Semibold | 次级大标题 |

### Headline - 页面标题

| 类名 | 字号 | 行高 | 字重 | 用途 |
|------|------|------|------|------|
| `.text-headline-lg` | 24px | 1.3 | Bold | 页面主标题 |
| `.text-headline-md` | 20px | 1.3 | Semibold | 卡片大标题 |
| `.text-headline-sm` | 18px | 1.3 | Semibold | 模块标题 |

### Title - 卡片标题

| 类名 | 字号 | 行高 | 字重 | 用途 |
|------|------|------|------|------|
| `.text-title-lg` | 18px | 1.4 | Semibold | 商品名称 |
| `.text-title-md` | 16px | 1.4 | Semibold | 列表标题 |
| `.text-title-sm` | 14px | 1.4 | Medium | 小标题 |

### Body - 正文

| 类名 | 字号 | 行高 | 字重 | 用途 |
|------|------|------|------|------|
| `.text-body-lg` | 16px | 1.5 | Regular | 正文内容 |
| `.text-body-md` | 14px | 1.5 | Regular | 普通文字 |
| `.text-body-sm` | 12px | 1.5 | Regular | 辅助文字 |

### Label - 标签

| 类名 | 字号 | 行高 | 字重 | 用途 |
|------|------|------|------|------|
| `.text-label-lg` | 14px | 1.4 | Medium | 按钮文字 |
| `.text-label-md` | 12px | 1.4 | Medium | 标签文字 |
| `.text-label-sm` | 11px | 1.4 | Medium | 小标签 |

### Caption - 备注

| 类名 | 字号 | 行高 | 字重 | 用途 |
|------|------|------|------|------|
| `.text-caption-lg` | 12px | 1.3 | Regular | 备注文字 |
| `.text-caption-md` | 11px | 1.3 | Regular | 小字备注 |
| `.text-caption-sm` | 10px | 1.3 | Regular | 极小文字 |

### Price - 价格

| 类名 | 字号 | 行高 | 字重 | 用途 |
|------|------|------|------|------|
| `.text-price-lg` | 24px | 1.2 | Bold | 大价格 |
| `.text-price-md` | 18px | 1.2 | Bold | 中价格 |
| `.text-price-sm` | 14px | 1.2 | Semibold | 小价格 |

---

## 使用示例

```vue
<!-- 商品卡片 -->
<div class="product-card">
  <h3 class="text-title-lg text-on-surface">烟薯25号</h3>
  <p class="text-body-sm text-on-surface-variant">5KG/箱 · 产地直发</p>
  <span class="text-price-md">¥39.90</span>
</div>

<!-- 页面标题 -->
<h1 class="text-headline-lg text-on-surface">我的订单</h1>

<!-- 按钮文字 -->
<button class="text-label-lg">立即购买</button>
```

---

## 注意事项

1. **一致性**：同一页面使用相同层级的字体
2. **对比度**：标题和正文要有明显区分
3. **可读性**：正文行高保持 1.5 以上
4. **响应式**：移动端可适当减小字号
