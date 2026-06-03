-- ============================================================
-- 薯鲜生 - 订单表添加详细金额字段
-- ============================================================

ALTER TABLE orders ADD COLUMN IF NOT EXISTS subtotal NUMERIC(12,2);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS shipping_fee NUMERIC(12,2) DEFAULT 0;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS discount NUMERIC(12,2) DEFAULT 0;

COMMENT ON COLUMN orders.subtotal IS '商品小计（不含运费）';
COMMENT ON COLUMN orders.shipping_fee IS '运费';
COMMENT ON COLUMN orders.discount IS '优惠金额';
