-- ============================================================
-- 薯鲜生 - 添加产品特色字段
-- ============================================================

ALTER TABLE products ADD COLUMN IF NOT EXISTS feature TEXT DEFAULT '甜度爆表';

COMMENT ON COLUMN products.feature IS '产品特色，如：甜度爆表、有机认证等';
