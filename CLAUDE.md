# 薯鲜生项目

## 项目简介
农业电商平台，支持 Web 和 Android（Capacitor）

## 技术栈
- 前端：Vue 3 + Vite + Tailwind CSS 4
- 后端：Supabase（PostgreSQL + Auth + Storage）
- 移动端：Capacitor Android
- 动画：GSAP
- 图标：Lucide Vue Next

## 目录结构
src/
├── assets/        # 静态资源
├── components/    # 通用组件
│   ├── common/    # 通用组件（按钮、弹窗、加载等）
│   ├── home/      # 首页专属组件
│   └── layout/    # 布局组件（导航栏、底部栏等）
├── composables/   # 组合式函数（use 前缀）
├── data/          # 数据文件
├── router/        # 路由配置
├── utils/         # 工具函数
└── views/         # 页面组件

## 组件命名规范
- 文件名：PascalCase（如 `ProductCard.vue`）
- 组件引用：PascalCase（如 `<ProductCard />`）
- Composables：`use` 前缀（如 `useCart.js`）

## Supabase 规范
- 认证：使用 `useAuth` composable
- 数据查询：使用 Supabase JS SDK
- 行级安全（RLS）：所有表必须启用
- 实时订阅：仅用于购物车、订单状态等必要场景
- 错误处理：统一使用 `useToast` 提示用户

## 性能要求
- 首屏加载：< 2 秒
- 图片：使用懒加载，Supabase Storage 图片压缩
- 列表：分页加载，每页 20 条
- 路由：懒加载组件
- 动画：GSAP 60fps，避免布局抖动

## 安全规则
- 认证：Supabase Auth，不自建
- 敏感操作：支付、修改地址需二次确认
- 数据校验：前后端都做
- 密码：不存储明文，使用 Supabase 内置
- 金额：整数存储（分），避免浮点精度问题
