-- ============================================================
-- 薯鲜生 - 弹窗配置表
-- ============================================================

CREATE TABLE IF NOT EXISTS popups (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title       TEXT NOT NULL,           -- 标题
    content     TEXT,                    -- 内容描述
    image_url   TEXT,                    -- 弹窗图片
    link_url    TEXT,                    -- 跳转链接
    link_text   TEXT DEFAULT '立即查看', -- 按钮文字
    frequency   TEXT DEFAULT 'daily',    -- every=每次, daily=每天
    is_active   BOOLEAN DEFAULT true,    -- 是否启用
    sort_order  INTEGER DEFAULT 0,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE popups IS '弹窗配置表';
COMMENT ON COLUMN popups.frequency IS '显示频率: every=每次进入, daily=每天一次';

-- RLS
ALTER TABLE popups ENABLE ROW LEVEL SECURITY;

-- 公开读，认证写
CREATE POLICY "anon_select_popups" ON popups FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "auth_insert_popups" ON popups FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "auth_update_popups" ON popups FOR UPDATE TO authenticated USING (true);
CREATE POLICY "auth_delete_popups" ON popups FOR DELETE TO authenticated USING (true);
