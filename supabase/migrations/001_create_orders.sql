-- ============================================================
-- 薯鲜生 - 订单系统数据库建表脚本
-- 执行方式：在 Supabase Dashboard > SQL Editor 中粘贴执行
-- ============================================================

-- 清理旧表
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;

-- 1. 创建订单主表
CREATE TABLE orders (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
    user_id       UUID REFERENCES auth.users(id),
    order_number  TEXT NOT NULL UNIQUE,
    total_amount  NUMERIC(12,2) NOT NULL,
    status        TEXT NOT NULL DEFAULT 'pending_payment',
    payment_method TEXT DEFAULT 'wechat',
    consignee_name    TEXT NOT NULL,
    consignee_phone   TEXT NOT NULL,
    consignee_address TEXT NOT NULL,
    tracking_number   TEXT
);

-- 添加 status 字段的检查约束，限制合法值
ALTER TABLE orders
    ADD CONSTRAINT orders_status_check
    CHECK (status IN ('pending_payment', 'pending_shipment', 'shipped', 'completed', 'cancelled'));

COMMENT ON TABLE orders IS '订单主表';
COMMENT ON COLUMN orders.order_number IS '订单号，格式：SXS+年月日+6位随机数';
COMMENT ON COLUMN orders.status IS '订单状态：pending_payment(待付款), pending_shipment(待发货), shipped(已发货), completed(已完成), cancelled(已取消)';
COMMENT ON COLUMN orders.user_id IS '下单用户';
COMMENT ON COLUMN orders.payment_method IS '支付方式：wechat/alipay';

CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);

-- 2. 创建订单明细表
CREATE TABLE order_items (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id      UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id    UUID NOT NULL REFERENCES products(id),
    product_name  TEXT NOT NULL,
    product_image TEXT,
    price         NUMERIC(12,2) NOT NULL,
    quantity      INTEGER NOT NULL CHECK (quantity > 0)
);

CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);

COMMENT ON TABLE order_items IS '订单明细表';
COMMENT ON COLUMN order_items.product_name IS '商品名称快照，防止商品改名后历史订单数据不一致';
COMMENT ON COLUMN order_items.product_image IS '商品主图快照';

-- 3. 开启 RLS（行级安全）
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- 4. RLS 策略：用户只能查看自己的订单

-- orders 表策略
CREATE POLICY "user_insert_orders"
    ON orders FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "user_select_orders"
    ON orders FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

-- 允许匿名用户插入订单（兼容未登录下单场景）
CREATE POLICY "anon_insert_orders"
    ON orders FOR INSERT
    TO anon
    WITH CHECK (true);

CREATE POLICY "anon_select_orders"
    ON orders FOR SELECT
    TO anon
    USING (true);

-- order_items 表策略
CREATE POLICY "user_insert_order_items"
    ON order_items FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "user_select_order_items"
    ON order_items FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "anon_insert_order_items"
    ON order_items FOR INSERT
    TO anon
    WITH CHECK (true);

CREATE POLICY "anon_select_order_items"
    ON order_items FOR SELECT
    TO anon
    USING (true);
