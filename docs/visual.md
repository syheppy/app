# 薯鲜生 - 视觉规范

## 阴影系统

| 层级 | CSS 变量 | 用途 |
|------|----------|------|
| xs | `--shadow-xs` | 微弱阴影，按钮 hover |
| sm | `--shadow-sm` | 轻微阴影，标签 |
| md | `--shadow-md` | 中等阴影，卡片 |
| lg | `--shadow-lg` | 较重阴影，弹窗 |
| xl | `--shadow-xl` | 重度阴影，模态框 |
| card | `--shadow-card` | 卡片默认阴影 |
| float | `--shadow-float` | 浮动元素阴影 |

### 使用示例

```vue
<!-- 卡片 -->
<div class="card">内容</div>

<!-- 浮动元素 -->
<div class="shadow-theme-float">浮动内容</div>

<!-- 自定义阴影 -->
<div class="shadow-theme-md">自定义阴影</div>
```

---

## 间距系统

| 间距 | CSS 变量 | 像素值 |
|------|----------|--------|
| 1 | `--space-1` | 4px |
| 2 | `--space-2` | 8px |
| 3 | `--space-3` | 12px |
| 4 | `--space-4` | 16px |
| 5 | `--space-5` | 20px |
| 6 | `--space-6` | 24px |
| 8 | `--space-8` | 32px |
| 10 | `--space-10` | 40px |
| 12 | `--space-12` | 48px |
| 16 | `--space-16` | 64px |

### 使用示例

```vue
<!-- 内边距 -->
<div class="p-theme-4">内容</div>

<!-- 外边距 -->
<div class="m-theme-6">内容</div>

<!-- 间隙 -->
<div class="gap-theme-3">子元素</div>
```

---

## 圆角系统

| 圆角 | CSS 变量 | 像素值 | 用途 |
|------|----------|--------|------|
| xs | `--radius-xs` | 4px | 小元素 |
| sm | `--radius-sm` | 8px | 按钮、标签 |
| md | `--radius-md` | 12px | 输入框、卡片 |
| lg | `--radius-lg` | 16px | 大卡片 |
| xl | `--radius-xl` | 24px | 弹窗 |
| 2xl | `--radius-2xl` | 32px | 大弹窗 |
| full | `--radius-full` | 9999px | 圆形 |

### 使用示例

```vue
<!-- 圆角卡片 -->
<div class="rounded-theme-lg">内容</div>

<!-- 圆形按钮 -->
<button class="rounded-theme-full">圆形</button>
```

---

## 组件类

### 卡片

```vue
<!-- 基础卡片 -->
<div class="card">内容</div>

<!-- 投影卡片 -->
<div class="card-elevated">内容</div>

<!-- 平面卡片 -->
<div class="card-flat">内容</div>
```

### 按钮

```vue
<!-- 主按钮 -->
<button class="btn btn-primary">确定</button>

<!-- 次按钮 -->
<button class="btn btn-secondary">取消</button>

<!-- 幽灵按钮 -->
<button class="btn btn-ghost">更多</button>
```

### 输入框

```vue
<input class="input" placeholder="请输入" />
```

### 标签

```vue
<span class="tag tag-primary">主要</span>
<span class="tag tag-secondary">次要</span>
<span class="tag tag-outline">边框</span>
```

---

## 使用规范

1. **优先使用组件类**：`card`, `btn`, `input` 等
2. **自定义时使用工具类**：`shadow-theme-*`, `p-theme-*`, `rounded-theme-*`
3. **保持一致性**：同一页面使用相同层级的阴影和间距
4. **响应式**：移动端使用较小间距，桌面端使用较大间距
