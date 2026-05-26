-- ============================================================
-- 薯鲜生 - 购物车表
-- ============================================================

DROP TABLE IF EXISTS cart_items CASCADE;

CREATE TABLE cart_items (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    quantity   INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(user_id, product_id)
);

CREATE INDEX IF NOT EXISTS idx_cart_items_user_id ON cart_items(user_id);

COMMENT ON TABLE cart_items IS '用户购物车';

-- RLS: 用户只能操作自己的购物车
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "user_select_own_cart" ON cart_items
    FOR SELECT TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "user_insert_own_cart" ON cart_items
    FOR INSERT TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "user_update_own_cart" ON cart_items
    FOR UPDATE TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "user_delete_own_cart" ON cart_items
    FOR DELETE TO authenticated
    USING (auth.uid() = user_id);
