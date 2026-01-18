-- =====================================================
-- Reviews Mock Data
-- Kitoblar uchun namuna sharhlari
-- =====================================================

-- First ensure demo users exist
DO $$
DECLARE
  user1_id UUID;
  user2_id UUID;
BEGIN
  -- Check if users exist, if not create them
  SELECT id INTO user1_id FROM users WHERE phone = '+998901234567' LIMIT 1;
  IF user1_id IS NULL THEN
    INSERT INTO users (phone, password_hash, name, avatar, plan, type)
    VALUES ('+998901234567', crypt('demo123', gen_salt('bf')), 'Demo User 1', '👤', 'FREE', 'user')
    RETURNING id INTO user1_id;
  END IF;

  SELECT id INTO user2_id FROM users WHERE phone = '+998901234568' LIMIT 1;
  IF user2_id IS NULL THEN
    INSERT INTO users (phone, password_hash, name, avatar, plan, type)
    VALUES ('+998901234568', crypt('demo123', gen_salt('bf')), 'Admin User', '👨‍💼', 'VIP', 'admin')
    RETURNING id INTO user2_id;
  END IF;
END $$;

-- CSV fayldagi mavjud kitoblar uchun sharhlar
-- Existing book IDs from database

INSERT INTO reviews (book_id, user_id, rating, comment, likes, created_at) VALUES
-- Harry Potter: Half Blood Prince (ce3d4fc9-ee88-4339-b352-f2f30d6ccbb5)
('ce3d4fc9-ee88-4339-b352-f2f30d6ccbb5',
 (SELECT id FROM users WHERE phone = '+998901234567' LIMIT 1),
 5,
 'Harry Potter seriyasining eng yaxshi qismlaridan biri! Syujet juda qiziqarli va hayajonli.',
 34,
 NOW() - INTERVAL '3 days'),

('ce3d4fc9-ee88-4339-b352-f2f30d6ccbb5',
 (SELECT id FROM users WHERE phone = '+998901234568' LIMIT 1),
 5,
 'J.K. Rowling ajoyib yozuvchi! Har bir sahifada yangilik bor.',
 28,
 NOW() - INTERVAL '1 week'),

-- The Cambers of Secrets (8bc9debe-6721-42d4-9cd5-29f629085657)
('8bc9debe-6721-42d4-9cd5-29f629085657',
 (SELECT id FROM users WHERE phone = '+998901234567' LIMIT 1),
 4,
 'Hogwarts haqida yanada ko''proq ma''lumot. Sirli va qo''rqinchli lavhalar bor.',
 19,
 NOW() - INTERVAL '5 days'),

('8bc9debe-6721-42d4-9cd5-29f629085657',
 (SELECT id FROM users WHERE phone = '+998901234568' LIMIT 1),
 5,
 'Ikkinchi qism birinchisidan ham yaxshi chiqibdi. Tom Riddle ning hikoyasi ajoyib!',
 22,
 NOW() - INTERVAL '2 weeks'),

-- Beauty and the Beast: Disney (c4218e7e-0e57-4ecb-b53d-6373b31064ad)
('c4218e7e-0e57-4ecb-b53d-6373b31064ad',
 (SELECT id FROM users WHERE phone = '+998901234567' LIMIT 1),
 5,
 'Klassik Disney ertagi! Bolalar va kattalar uchun ajoyib kitob.',
 45,
 NOW() - INTERVAL '1 month'),

('c4218e7e-0e57-4ecb-b53d-6373b31064ad',
 (SELECT id FROM users WHERE phone = '+998901234568' LIMIT 1),
 5,
 'Go''zal va ta''sirli hikoya. Muhabbat va saxovat haqida.',
 38,
 NOW() - INTERVAL '2 weeks'),

-- Fire and Blood (4dc98264-5b6f-4619-87d1-8d0984f53eea)
('4dc98264-5b6f-4619-87d1-8d0984f53eea',
 (SELECT id FROM users WHERE phone = '+998901234567' LIMIT 1),
 5,
 'Targaryen sulolasi tarixi juda qiziqarli! George R.R. Martin ustasi o''z ishining.',
 52,
 NOW() - INTERVAL '4 days'),

('4dc98264-5b6f-4619-87d1-8d0984f53eea',
 (SELECT id FROM users WHERE phone = '+998901234568' LIMIT 1),
 4,
 'Ajdaholar va qirollik intrikalari. Juda chuqur va batafsil yozilgan.',
 31,
 NOW() - INTERVAL '1 week'),

-- The Chronicles of Narnia (ca883c2d-a90c-4149-a1c0-016b99251690)
('ca883c2d-a90c-4149-a1c0-016b99251690',
 (SELECT id FROM users WHERE phone = '+998901234567' LIMIT 1),
 5,
 'C.S. Lewis ning sehrli dunyosi haqiqatan ham ajoyib. Narnia haqida o''qib chiqolmadim!',
 67,
 NOW() - INTERVAL '2 weeks'),

('ca883c2d-a90c-4149-a1c0-016b99251690',
 (SELECT id FROM users WHERE phone = '+998901234568' LIMIT 1),
 5,
 'Fantasy janrining eng yaxshi asarlaridan biri. Har yili qayta o''qiyman.',
 58,
 NOW() - INTERVAL '3 weeks'),

-- Deadpool Samurai edition (0ba00935-3e27-42fe-8551-7446e5f0ca3c)
('0ba00935-3e27-42fe-8551-7446e5f0ca3c',
 (SELECT id FROM users WHERE phone = '+998901234567' LIMIT 1),
 4,
 'Deadpool Yaponiyada! Juda kulgili va action bilan to''la. Marvel muxlislari uchun ajoyib.',
 41,
 NOW() - INTERVAL '6 days'),

('0ba00935-3e27-42fe-8551-7446e5f0ca3c',
 (SELECT id FROM users WHERE phone = '+998901234568' LIMIT 1),
 5,
 'Samurai va Deadpool kombinatsiyasi ajoyib! Komiks juda qiziqarli chiqibdi.',
 36,
 NOW() - INTERVAL '10 days'),

-- The World of Ice and Fire (caa1d498-d131-47c6-981a-32f406f1e04c)
('caa1d498-d131-47c6-981a-32f406f1e04c',
 (SELECT id FROM users WHERE phone = '+998901234567' LIMIT 1),
 4,
 'Westeros tarixi haqida juda batafsil ma''lumot. Game of Thrones muxlislari uchun majburiy!',
 29,
 NOW() - INTERVAL '1 week'),

('caa1d498-d131-47c6-981a-32f406f1e04c',
 (SELECT id FROM users WHERE phone = '+998901234568' LIMIT 1),
 5,
 'Etti Qirollik tarixi juda qiziqarli. Har bir oila haqida alohida hikoyalar.',
 33,
 NOW() - INTERVAL '2 weeks'),

-- Fantastic Beasts Volume II (29b231c1-81fb-4fcd-96c6-95c1e1742cfa)
('29b231c1-81fb-4fcd-96c6-95c1e1742cfa',
 (SELECT id FROM users WHERE phone = '+998901234567' LIMIT 1),
 5,
 'Sehrli mavjudotlar haqida juda qiziqarli ma''lumotlar. Rowling ning tasavvuri cheksiz!',
 44,
 NOW() - INTERVAL '5 days'),

('29b231c1-81fb-4fcd-96c6-95c1e1742cfa',
 (SELECT id FROM users WHERE phone = '+998901234568' LIMIT 1),
 4,
 'Harry Potter dunyosini yanada chuqurroq o''rganish imkoniyati. Juda yoqdi!',
 27,
 NOW() - INTERVAL '1 week'),

-- Game of Thrones Volume III (ee6b6cdd-c78f-4957-856c-4ab4a8b7956d)
('ee6b6cdd-c78f-4957-856c-4ab4a8b7956d',
 (SELECT id FROM users WHERE phone = '+998901234567' LIMIT 1),
 5,
 'A Storm of Swords - eng yaxshi qism! Shuncha voqealar va kutilmagan burilishlar.',
 71,
 NOW() - INTERVAL '3 weeks'),

('ee6b6cdd-c78f-4957-856c-4ab4a8b7956d',
 (SELECT id FROM users WHERE phone = '+998901234568' LIMIT 1),
 5,
 'George R.R. Martin ning eng kuchli asarlaridan biri. Hech kim xavfsiz emas!',
 63,
 NOW() - INTERVAL '1 month'),

-- The Wise Man's Fear (2c883cc4-369c-438d-8726-d0cd47741bd1)
('2c883cc4-369c-438d-8726-d0cd47741bd1',
 (SELECT id FROM users WHERE phone = '+998901234567' LIMIT 1),
 5,
 'Patrick Rothfuss ning ikkinchi kitobi birinchisidan ham qiziqarli! Kvothe ning sarguzashtlari davom etadi.',
 48,
 NOW() - INTERVAL '2 weeks'),

('2c883cc4-369c-438d-8726-d0cd47741bd1',
 (SELECT id FROM users WHERE phone = '+998901234568' LIMIT 1),
 5,
 'Kingkiller Chronicle seriyasi ajoyib! Uchinchi kitobni intizor bilan kutaman.',
 55,
 NOW() - INTERVAL '3 weeks');

-- Update book stats (average rating and total reviews will be calculated by triggers)
-- This is just to ensure data consistency

COMMENT ON TABLE reviews IS 'Kitoblar uchun foydalanuvchi sharhlari va baholari';
