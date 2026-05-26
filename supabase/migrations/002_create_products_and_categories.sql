-- ============================================================
-- 薯鲜生 - 商品与分类表
-- ============================================================

-- 清理旧表（如果存在）
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS cart_items CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS categories CASCADE;

-- 1. 分类表
CREATE TABLE categories (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name       TEXT NOT NULL UNIQUE,
    icon_url   TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE categories IS '商品分类表';

-- 2. 商品表
CREATE TABLE products (
    id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name           TEXT NOT NULL,
    description    TEXT,
    price          NUMERIC(12,2) NOT NULL,
    original_price NUMERIC(12,2),
    image_url      TEXT,
    category       TEXT,
    category_id    UUID REFERENCES categories(id),
    status         BOOLEAN DEFAULT true,
    is_hot         BOOLEAN DEFAULT false,
    is_recommended BOOLEAN DEFAULT false,
    stock          INTEGER DEFAULT 999,
    specs          JSONB,
    origin         TEXT,
    taste          TEXT,
    rating         NUMERIC(3,1) DEFAULT 5.0,
    review_count   INTEGER DEFAULT 0,
    created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);

COMMENT ON TABLE products IS '商品表';
COMMENT ON COLUMN products.specs IS '规格选项 JSON，如 [{"name":"3KG/箱","price":29.90}]';
COMMENT ON COLUMN products.is_hot IS '首页热销爆款';
COMMENT ON COLUMN products.is_recommended IS '首页为您推荐';

-- 3. RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- categories: 公开读，认证写
CREATE POLICY "anon_select_categories" ON categories FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "auth_insert_categories" ON categories FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "auth_update_categories" ON categories FOR UPDATE TO authenticated USING (true);

-- products: 公开读，认证写
CREATE POLICY "anon_select_products" ON products FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "auth_insert_products" ON products FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "auth_update_products" ON products FOR UPDATE TO authenticated USING (true);

-- 4. 种子数据：分类
INSERT INTO categories (name, icon_url, sort_order) VALUES
    ('蜜薯系列', 'https://lh3.googleusercontent.com/aida/ADBb0uidV00S2gRzU6AukRSqgNpR3k5jncJWxbJYObI4OyerYGmO8k2dHc2nBGRdynGS-syqkQiv0QinQeIDUgt9CqUsE09ml0uA6H6e7YaEu1JCKrUAcUHl59DmQSo0IGUvTOH9uuO7i4mb295zxMYnusGrEfXEQjx_vfojyIi8Numxc0Lmm9BlFBkNjJJhNoiihjNaYyP3K2fZQi4v9X-c9nw6NCTMhlyzn2xQSfyhf1MD8TRXDqqZyAorjZA7', 1),
    ('紫薯系列', 'https://lh3.googleusercontent.com/aida/ADBb0ugzrKDPyhElikRkF0aLjF0LEd7ZA6sv9vlavhKor-MbbhZpZ95Oq0VAGbUngi5hQLjzAHovFEKJW1U01Gb8jcPm8CMGa_Dq5AwTnQGwstkQky9Ldfso3Hupch1RS-H54aHrrrqQE77tTyxey2ADpGWk1pp2fpGc27VyE_5-HrecxlVu_UwnyNFUoSMSvoCQ0bPuTYxJuY3Fz39awW4bJ_uzGes6OGWTLWn8eXV9y3dDBMsZ6DoHNGIFARqC', 2),
    ('红薯系列', 'https://lh3.googleusercontent.com/aida/ADBb0uiuhqoTOx8FY1ahD_05aHMPZYJquVfwO_HCksckChf-Q-bpiTEVtmp78RMHLp83CvrAoVQqmcrV0QLBjkp4pRXsHCyobXX-130KYC1ioscoTuVd2K31h1kxhjpD_ie7BXRwTWD6OOzwpfTLQHxrwhIWPNrdzDntnpf8FP-ZNGtofRH1-AytSHxP6i6ASXZzOMRQewqe9qPEUI4gztN21qivfiYspOvQMzfjxC_TXAVi8OvcsmdPbrhnco3x', 3),
    ('薯类加工品', 'https://lh3.googleusercontent.com/aida/ADBb0uhx3fLrKLsHuy3y-OYs8cbQISvoF--dQx0XY13O_mQisFhGYjMDQr85nFKDvbioceTL0H1aIL5XR75zHnOJlfrgdnWxH0koC2Ee6ig03de9uLpY6FLqO9cEB5tLdOnlWDe-9xRdaRDG12VeqrPuH5EtAR3jRmh63eSwXUNeoOsyAmmLxCk4wy1EXRRm5HS26Sa6EkzznuKKMestf7AZKzO-AD868wb_h0r1TJ9Yd06S3pX_ZCpACjO13ywKpPPw2F7vXJXuZH9nipY', 4),
    ('礼盒专区', 'https://lh3.googleusercontent.com/aida/ADBb0ujAYf5v8vDqGRzDUtjUNXS_W2wRHrfCbjvthPcJ7mvqSFMwXESFtXIbS4IqztLsJKWisF3Sm8wraSQ6LfRXcS938sx4pbIM4yVAYSnvXui7N8DICqFyfHkqpPQDMrb48PdNFLFYlFeQ5WtXITI3NB8zYtooHODeNbGswgIPkkjSok-czPhiPm7hoX9KToZIZ0QRHNOAvJCrad3qjoqwjy2MFZsbwoIHl09tBUBVg0SzPpYYlYVbvhsHJLYy', 5);

-- 5. 种子数据：商品
-- 蜜薯系列
INSERT INTO products (name, description, price, original_price, image_url, category, category_id, is_hot, is_recommended, origin, taste, rating, review_count, specs) VALUES
    ('六鳌红蜜薯', '产地直采，个大饱满，香甜软糯', 39.90, NULL,
     'https://lh3.googleusercontent.com/aida/ADBb0uiqZh3pOveY6pgUctdXtDazbUR5gqXQ29SC8qM8ZrpnJG4NviUVUVSEr3GZ3a8ppEuVb8MRvM3i7kfERK7Tds4YqE6dF4F0c3lRo7U0I7Lk2XMetdOS8Vq7cgx_p-j4R4hYtVLxF6d8fehRDYAra4ruNqbb29jo1qdxhCOuoCl8xjPCpATT9uXMdwW7iQWZCqsvhEQeAUPVY2iu1Sq9O5Vi2I792cJFm7-oeJGGDhJlcvK4R0t0J3UV_C8',
     '蜜薯系列', (SELECT id FROM categories WHERE name='蜜薯系列'), true, true, '福建漳浦', '粉糯香甜', 4.9, 1280,
     '[{"name":"3KG/箱","price":39.90},{"name":"5KG/箱","price":59.90}]'),

    ('红蜜薯 (生品)', '红皮红心，适合蒸烤，口感细腻', 32.90, NULL,
     'https://lh3.googleusercontent.com/aida/ADBb0uhf33Sn-7hbtIupnjHHXZhY2NxpUKYniVdESAHjWOOeUJufaGr5pLnJMFoMtyRn779WqtmIksaQwnEyQ6XuoXaYy1kZ9Srd6eZre2EfmczJ8JHK8LgCko8Oy3wAKPTGzNgNG8sp25zO0NO3LJySULjrojxkKKhwA8otPodHWwSf9om1qbtofEf6mzbhrlUDH0OkUrr40OOAuiVP3TUjZYBwZpHzbXqXmwZby7nOO0NUZkwL-uyJq5Qx5PG-',
     '蜜薯系列', (SELECT id FROM categories WHERE name='蜜薯系列'), false, false, '山东烟台', '软糯可口', 4.7, 860,
     '[{"name":"3KG/箱","price":32.90},{"name":"5KG/箱","price":49.90}]'),

    ('迷你小香薯', '一口一个，粉糯清甜，产地直供', 35.00, NULL,
     'https://lh3.googleusercontent.com/aida/ADBb0ugjbrzhJSUEVozo-QOE1KmrThVt6M33OLGFnw9Yz4ikaivR4RRtasJ5dQIgw83b_4OKXcRY4XRn5kvWekoMo5PaFnxjZgTwpo4Uk6EQK7NtCmypn7VoG0XpCrA5HPRLQiulA_rQaQLgOUca5Co1RvXrntDKJ3_5bnXY4a0N2ZGPXiXeJO1Jo99j_xlZVMXtufDEeapqd-XauEQKVTDhrihT0g2EfiBUdWSZtql77cxMt4ltwx-TKhzYsr8A',
     '蜜薯系列', (SELECT id FROM categories WHERE name='蜜薯系列'), false, true, '浙江临安', '粉糯清甜', 4.8, 650,
     '[{"name":"2KG/箱","price":35.00},{"name":"4KG/箱","price":62.00}]');

-- 紫薯系列
INSERT INTO products (name, description, price, original_price, image_url, category, category_id, is_hot, is_recommended, origin, taste, rating, review_count, specs) VALUES
    ('高原有机紫薯', '粉糯细腻，富含花青素，有机认证', 45.00, NULL,
     'https://lh3.googleusercontent.com/aida/ADBb0uiKL0eTibhgIqYxlenFcq0UCBXKrAzJv8_zOwW9U7V3A02_fXyyy4FbEd1jCJervnnah00u9JIpr5udLWpqgicA7xZ4tzzr2NSs1DoSWWXQwiOVjPvbAAGtRUy7KZSSPkOD5LWzXczZu5hKn2rFOfwKw-fJWFcEihMXJoPP_1-kSACc7GDSQkgKk1tKM4qSNOXsiMf3psAdafjCgPH4pfcAZECjX_AQTbA2rNA-gvc8CHV0Y2sj8khypLyy',
     '紫薯系列', (SELECT id FROM categories WHERE name='紫薯系列'), false, true, '云南高原', '粉糯细腻', 4.9, 920,
     '[{"name":"3KG/箱","price":45.00},{"name":"5KG/箱","price":68.00}]'),

    ('高纯高心紫薯', '口感绵软回甘，适合甜品制作', 38.00, NULL,
     'https://lh3.googleusercontent.com/aida/ADBb0ujZc1p6KsScmPpMVx64jPsPhoI-SSWGYngjelBkcclgee-y6WNNYOMxntkJdETJriaw3V2yNnI0pCQAflZW5sEDC3XBQXPHflbu1sXhg7bNKqyR73LJdgvVlZUUV3u1BUZ_GKpOkGai2qPPCQHltGKRDFcui_UnuxslEtiosGsQTVr-73l0Tc3XPmRrD3TSk0eGGi5X_CmaSciGBdLwIe0chP7w8rBA6fgmMbUFmV5Rv7BDqLoknBm1xEZ7',
     '紫薯系列', (SELECT id FROM categories WHERE name='紫薯系列'), false, false, '山东烟台', '绵软回甘', 4.6, 540,
     '[{"name":"3KG/箱","price":38.00},{"name":"5KG/箱","price":58.00}]'),

    ('农家迷你小紫薯', '一口一个，软糯香甜，产地直供', 32.00, NULL,
     'https://lh3.googleusercontent.com/aida/ADBb0uipZOhzkY5IlvbvpkLtN1evWJMBxpj7n20nt1fi1zVV7EAbSpdx3fxZSK0TX2UfEcA03m6jxZnD7uU-EtcJcqLzbMQus3EhnhzSm1cl7Ragr4tDgAwJ6sVV0nV5BMBNnuRjkfX3I0REpze6RE_WhroXdqZ2QjNU3nT60ajr4bitwpz1NdZ8wUWWebAzV5zMFW1a6lj7Ws3rkyxV2IycXr7XvymzaoSW9N-7bItJavTKv-EQ1zmEzyDew-rQ',
     '紫薯系列', (SELECT id FROM categories WHERE name='紫薯系列'), false, false, '广东湛江', '软糯香甜', 4.7, 380,
     '[{"name":"2KG/箱","price":32.00},{"name":"4KG/箱","price":56.00}]');

-- 红薯系列
INSERT INTO products (name, description, price, original_price, image_url, category, category_id, is_hot, is_recommended, origin, taste, rating, review_count, specs) VALUES
    ('六鳌红薯 (生品)', '沙地种植，皮薄肉厚，自然美味', 39.90, NULL,
     'https://lh3.googleusercontent.com/aida/ADBb0uiqZh3pOveY6pgUctdXtDazbUR5gqXQ29SC8qM8ZrpnJG4NviUVUVSEr3GZ3a8ppEuVb8MRvM3i7kfERK7Tds4YqE6dF4F0c3lRo7U0I7Lk2XMetdOS8Vq7cgx_p-j4R4hYtVLxF6d8fehRDYAra4ruNqbb29jo1qdxhCOuoCl8xjPCpATT9uXMdwW7iQWZCqsvhEQeAUPVY2iu1Sq9O5Vi2I792cJFm7-oeJGGDhJlcvK4R0t0J3UV_C8',
     '红薯系列', (SELECT id FROM categories WHERE name='红薯系列'), false, false, '福建漳浦', '皮薄肉厚', 4.8, 720,
     '[{"name":"3KG/箱","price":39.90},{"name":"5KG/箱","price":59.90}]'),

    ('西瓜红薯 (生品)', '软糯可口，口感如瓜，甜度适中', 32.90, NULL,
     'https://lh3.googleusercontent.com/aida/ADBb0uhf33Sn-7hbtIupnjHHXZhY2NxpUKYniVdESAHjWOOeUJufaGr5pLnJMFoMtyRn779WqtmIksaQwnEyQ6XuoXaYy1kZ9Srd6eZre2EfmczJ8JHK8LgCko8Oy3wAKPTGzNgNG8sp25zO0NO3LJySULjrojxkKKhwA8otPodHWwSf9om1qbtofEf6mzbhrlUDH0OkUrr40OOAuiVP3TUjZYBwZpHzbXqXmwZby7nOO0NUZkwL-uyJq5Qx5PG-',
     '红薯系列', (SELECT id FROM categories WHERE name='红薯系列'), false, false, '广东湛江', '软糯可口', 4.6, 430,
     '[{"name":"3KG/箱","price":32.90},{"name":"5KG/箱","price":49.90}]'),

    ('精品红薯 (生品)', '新鲜采挖，自然美味，精选大薯', 25.00, NULL,
     'https://lh3.googleusercontent.com/aida/ADBb0ugjbrzhJSUEVozo-QOE1KmrThVt6M33OLGFnw9Yz4ikaivR4RRtasJ5dQIgw83b_4OKXcRY4XRn5kvWekoMo5PaFnxjZgTwpo4Uk6EQK7NtCmypn7VoG0XpCrA5HPRLQiulA_rQaQLgOUca5Co1RvXrntDKJ3_5bnXY4a0N2ZGPXiXeJO1Jo99j_xlZVMXtufDEeapqd-XauEQKVTDhrihT0g2EfiBUdWSZtql77cxMt4ltwx-TKhzYsr8A',
     '红薯系列', (SELECT id FROM categories WHERE name='红薯系列'), false, false, '河南开封', '自然美味', 4.5, 290,
     '[{"name":"3KG/箱","price":25.00},{"name":"5KG/箱","price":38.00}]');

-- 薯类加工品
INSERT INTO products (name, description, price, original_price, image_url, category, category_id, is_hot, is_recommended, origin, taste, rating, review_count, specs) VALUES
    ('手工纯薯粉条', '爽滑Q弹，纯度高，传统手作', 32.00, NULL,
     'https://lh3.googleusercontent.com/aida/ADBb0uhZda9hZc_KbvpzKLKo3ouThSeCvm8N6SkqWlxlPkxlOJIQM1dshO6_4Aty1jShIq0rAL4_lcErsvoHrK7KE1htrjp37z5rxgLqSAtC0W4UChEx2kFlBhcyhiSw2EOcUNpbkZE7TxkVuBk2eSkXexajfryofRmXeFGEWe9cFJj5ZFIgkVxVklKaReS1bSz2XCEDvfBXfV2QQS0ssBJSwygEKB7JyMH0X6qJ6OJJIGRKFXdZd7CbWpHWHrx_',
     '薯类加工品', (SELECT id FROM categories WHERE name='薯类加工品'), false, false, '山东烟台', '爽滑Q弹', 4.7, 680,
     '[{"name":"500g/袋","price":32.00},{"name":"1KG/袋","price":55.00}]'),

    ('农家自制地瓜干', '香甜软糯，无添加，自然风干', 28.00, NULL,
     'https://lh3.googleusercontent.com/aida/ADBb0ujdpJEryCwkwbAypi-07K_ldKZ2fINfS4c5MaIDaOYFPI7SJXl46uJVs8AXCaTrI93kJPddnNaRiEhukxbEeOxwnFDpfSL8riI_uW2Mi0ZTL7S6djOo0SEovHK4P8TpCQ--tdPlvdXr_7xoeQhziqPyzD_k2hqqJgdJuAd45ncR9zM9bhbmLyZWhHURGs9iaIAVutCKIUKfzh-CWR7GvpMYYeQAxQpXT2p2boqPkJb70HtNaOXb2cv8-_LK',
     '薯类加工品', (SELECT id FROM categories WHERE name='薯类加工品'), false, true, '河南开封', '香甜软糯', 4.8, 950,
     '[{"name":"250g/袋","price":28.00},{"name":"500g/袋","price":48.00}]'),

    ('香脆紫薯片', '嘎嘣脆，薯香浓郁，休闲零食', 19.90, 25.00,
     'https://lh3.googleusercontent.com/aida/ADBb0uhfRq8IwX2_zf_IvDCjBpwgWERsT0tJrP6DPNRW3yNIL7Nyg70Kburlj9P4lXaDvHBwxtiaXbCHlNHn8XLclMAHZtA86jKpb12eHb8iiw5EDiIVFGaIcV5NfkYV5b2xBoOfW3HA8S5VxKrSa05d5T7350hHl4L1-P6ombsrd-g1Q2KGUO34GW3hUW5LPsiQAb_6BEXYAbwRGtb4tkHX09xXuRE6ilHi9sJhLJoCvjg5ZtEuhAdcJHqZpnk',
     '薯类加工品', (SELECT id FROM categories WHERE name='薯类加工品'), true, false, '山东烟台', '嘎嘣脆', 4.5, 1120,
     '[{"name":"100g/罐","price":19.90},{"name":"200g/罐","price":35.00}]');

-- 礼盒专区
INSERT INTO products (name, description, price, original_price, image_url, category, category_id, is_hot, is_recommended, origin, taste, rating, review_count, specs) VALUES
    ('丰收庆典礼盒', '红薯紫薯组合装，限量版', 168.00, 198.00,
     'https://lh3.googleusercontent.com/aida/ADBb0uieoMCH1tk7FmxtrrL6nKToQXY3zdxgyXomZqSq411TRqMlkHi_JI-a4emPew53xNQzhKA96-JLmmcDH0GrwS8PI-G_hr5DsItRAmKRZmHjzytumYYOcClljRSOx8XX46QpgXRFp2xh771I3r1PjrrYk1hokKb09P1zh8Z7Bn5a2QitIyJKT_k9wAI_6QVJdgSxZQ2XR1gXHQds2YzwCj7dvSKmcLCUnVDoYdd0MeAgScc8Q5gz-Z0seujX',
     '礼盒专区', (SELECT id FROM categories WHERE name='礼盒专区'), false, false, '精选原产地', '多种口味', 4.9, 320,
     '[{"name":"标准礼盒","price":168.00}]'),

    ('经典甜蜜组合', '老少皆宜，伴手礼首选', 89.00, NULL,
     'https://lh3.googleusercontent.com/aida/ADBb0ui9vOxCtTSlqgzkpnsoivoCw5c1ehaA983StDOUrpSEtkRvVtzUPkRAVVaLiWggcrNl2rGZsyMnB2TkA-dAhJaIXm7WlBF6bj_Mu3Q_oAGKfsnFrdiB0hMHa4QO5PmjbE76Eq35txl6jo2ZbXl1_tZwXQhynTfYDr-AylvcIl3LFOjTLyhumbELEH0ZzcxnDPfhYUJbNrJWAw0LlNFpbRxjyT1K2cfmZtpuqaDzOevo5nWpBKFcxTJAreQs',
     '礼盒专区', (SELECT id FROM categories WHERE name='礼盒专区'), true, true, '精选原产地', '甜蜜香糯', 4.8, 560,
     '[{"name":"标准组合","price":89.00}]'),

    ('尊贵农场直供套装', '全系产品尊享体验，尊享首选', 228.00, 288.00,
     'https://lh3.googleusercontent.com/aida/ADBb0uhAaByKNc8vhe3fnmuHw6VMP-Off-yt-Y/ui9B-W50tXCJ_dxUqCt8lqDOv-p8KZ-rQ2Ld7eZH6yHgXLL_o_H9gLNe2i5_S-y8QD-qSC6OYl9LxEIu5FVr8j6zU-mCaR96AhzUqnB4kRauJfyZ7sNAG-D_NOoHXdo99x7hhEI4pDIaJUN3M94af1mfbgFHE8chTw-NByamEjvIKk1zgvaefLMfk73RJ1ZW5xYcPe5RfZNjqVwEoaes9Ljr3',
     '礼盒专区', (SELECT id FROM categories WHERE name='礼盒专区'), false, false, '精选原产地', '全系体验', 5.0, 120,
     '[{"name":"尊享套装","price":228.00}]');

-- 热销爆款补充（来自 Home.tsx）
INSERT INTO products (name, description, price, original_price, image_url, category, category_id, is_hot, is_recommended, origin, taste, rating, review_count, specs) VALUES
    ('烟薯25号 冰糖蜜薯', '出蜜多，肉质细腻，入口即化，蜜薯届的扛把子', 29.90, 39.90,
     'https://lh3.googleusercontent.com/aida/ADBb0uiSU54_g3nmA8rJT-tXJpsN0WgzHOkS5cHyxyj1qSH-2i7pDm2oRxLrhtnA9J8gD0p6K8axFH-dzIVy2Qyj6bBSdsYqlAtCH_hVccROJWcD5XVwMFDU5UG6-Bwck8dvQPSS1l2AEZNzStQBeZqphuQ-KBjXGyIPj3aQdPBtAFe7ny95_h2wV9cnOn9xSTQV5kNSafz3f1uGOjxtKRCFB0trQJnNOE8mqozujZTrCOZvQ3TKKfmenGn8sNAL',
     '蜜薯系列', (SELECT id FROM categories WHERE name='蜜薯系列'), true, true, '山东烟台', '流油软糯', 4.9, 2400,
     '[{"name":"3KG/箱","price":29.90},{"name":"5KG/箱","price":49.90}]'),

    ('富硒紫薯 饱腹代餐', '低卡健康，富含花青素，代餐首选', 19.90, NULL,
     'https://lh3.googleusercontent.com/aida-public/AB6AXuAQ0uF_3QAWFwCRB3gi8j47ivRDfQV_N_KFIi0dlbumTNE68Mk9i8s-ezPMuIsy4qmG-qhTp-p2y13e7W4_Hj6Kdz4lGxTPkgwthiKlEjO4u7ObCTOG2nASTL-yQ85OWoshDHxwfy1dEIMLy1bESHYqZkRx-y-TAipwLyqF4Rwl3hKWHEjio4CHoqrfzk7n6S67xaUJ-Pj-BP_wC5cUYCki-aVXIB9oVlk-C0YogOeIoxsMwLSX_ZgtndtVImEfMPIHjD9ZD3UyzMk8',
     '紫薯系列', (SELECT id FROM categories WHERE name='紫薯系列'), true, false, '云南高原', '粉糯细腻', 4.7, 1800,
     '[{"name":"2KG/箱","price":19.90},{"name":"4KG/箱","price":35.00}]'),

    ('原味地瓜干 零添加', '休闲零食，自然风干，香甜软糯', 25.90, NULL,
     'https://lh3.googleusercontent.com/aida-public/AB6AXuBulzCTbA-MIR6eQbf4DpQHLzJNb2HbGtWLsuDzB_QH0eUPM4bXAmGbZsIfGRxgg-XwNU3kh7bjgqbHGk4vPUha1kpfTRdUk9aErCtoiuex3Mv_EvcCSTM-pKt_k5pXtts3CszmwzXWGMaot8adLqXWEiXgNtDiF7JtlHNlyfpKJdtIwBKpwZqmFNnUhWsh-EgrU025ET_XqpzmFJSZKehHU60_hv1ZOFeDVmtvm3IX2f5Pnk4O0Jl3erj-IZKjlituOvH2SKLAWUez',
     '薯类加工品', (SELECT id FROM categories WHERE name='薯类加工品'), true, false, '河南开封', '香甜软糯', 4.6, 960,
     '[{"name":"250g/袋","price":25.90},{"name":"500g/袋","price":45.00}]');
