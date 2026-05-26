-- ============================================================
-- 薯鲜生 - 收货地址表
-- ============================================================

DROP TABLE IF EXISTS addresses CASCADE;

CREATE TABLE addresses (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name       TEXT NOT NULL,
    phone      TEXT NOT NULL,
    address    TEXT NOT NULL,
    tag        TEXT,
    is_default BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_addresses_user_id ON addresses(user_id);

COMMENT ON TABLE addresses IS '收货地址';
COMMENT ON COLUMN addresses.tag IS '标签，如：家、公司';
COMMENT ON COLUMN addresses.is_default IS '是否默认地址';

-- RLS: 用户只能操作自己的地址
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "user_select_own_addresses" ON addresses
    FOR SELECT TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "user_insert_own_addresses" ON addresses
    FOR INSERT TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "user_update_own_addresses" ON addresses
    FOR UPDATE TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "user_delete_own_addresses" ON addresses
    FOR DELETE TO authenticated
    USING (auth.uid() = user_id);
