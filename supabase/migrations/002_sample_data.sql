-- =====================================================
-- Sample Data Insertion
-- Mock data'dan real database'ga ma'lumotlarni ko'chirish
-- =====================================================

-- =====================================================
-- BADGES (Achievements)
-- =====================================================
INSERT INTO badges (name, icon, description, requirement_type, requirement_value) VALUES
  ('Bookworm', '📚', '10 ta kitob o''qildi', 'books_read', 10),
  ('Speed Reader', '⚡', '1 hafta ichida 5 kitob', 'weekly_books', 5),
  ('Reviewer', '⭐', '20 ta sharh yozildi', 'reviews_written', 20),
  ('Consistent', '🔥', '30 kun ketma-ket o''qish', 'reading_streak', 30),
  ('Genre Explorer', '🌍', '5 xil janrdan o''qish', 'genre_count', 5),
  ('Century Club', '💯', '100 kitob o''qildi', 'books_read', 100)
ON CONFLICT (name) DO NOTHING;

-- =====================================================
-- AUTHORS
-- =====================================================
INSERT INTO authors (name, avatar, title, quote) VALUES
  ('J.K. Rowling', '👩', 'author', 'It is our choices that show what we truly are, far more than our abilities.'),
  ('George R.R. Martin', '👨‍🦳', 'author', 'Fire and Blood tells the story of the Targaryen dynasty in Westeros, chronicling the conquest of the Seven Kingdoms by House Targaryen. It also covers the Targaryen civil war known as the Dance of the Dragons.'),
  ('C.S. Lewis', '👨', 'author', 'You can never get a cup of tea large enough or a book long enough to suit me.'),
  ('Patrick Rothfuss', '👨', 'author', 'Words are pale shadows of forgotten names. As names have power, words have power.'),
  ('Disney', '🏰', 'publisher', 'All our dreams can come true, if we have the courage to pursue them.'),
  ('Marvel', '🦸', 'publisher', 'With great power comes great responsibility.')
ON CONFLICT DO NOTHING;

-- =====================================================
-- BOOKS
-- Mock data'dagi kitoblarni qo'shish
-- =====================================================

-- Book 1: Harry Potter: Half Blood Prince
INSERT INTO books (
  title, author, category, cover_url, cover_color, description, full_description,
  page_count, language, format, isbn, editors, rating, has_audiobook,
  audio_duration, is_premium, required_plan
) VALUES (
  'Harry Potter: Half Blood Prince',
  'JK Rowling',
  'Fantasy',
  'https://images.unsplash.com/photo-1621351183012-e2f9972dd9bf?w=400',
  '#1a4d2e',
  'The story takes place during Harry''s sixth year at Hogwarts School of Witchcraft and Wizardry, where he discovers more about Lord Voldemort''s past and the prophecy that foretells his defeat.',
  'With action-packed sequences, shocking twists, and moments of heart-wrenching tragedy, ''Half-Blood Prince'' is a must-read for any fan of the Harry Potter series.',
  300,
  'Standard English (USA & UK)',
  'Paperback',
  '987 3 32564 435 B',
  'J.K. Rowling (author), Christopher Reath, Alena Gestahon, Steve Korg',
  4.5,
  TRUE,
  '4:52:30',
  FALSE,
  'FREE'
);

-- Book 2: The Cambers of Secrets
INSERT INTO books (
  title, author, category, cover_url, cover_color, description,
  page_count, language, has_audiobook, audio_duration, is_premium, required_plan
) VALUES (
  'The Cambers of Secrets',
  'JK Rowling',
  'Fantasy',
  'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400',
  '#2d5016',
  'Harry as he returns to Hogwarts school of witchcraft and wizardry for his 2nd year, only to discover that...',
  300,
  'Standard English (USA & UK)',
  TRUE,
  '3:45:20',
  FALSE,
  'FREE'
);

-- Book 3: Beauty and the Beast: Disney
INSERT INTO books (
  title, author, category, cover_url, cover_color, description,
  page_count, language, has_audiobook, audio_duration, is_premium, required_plan
) VALUES (
  'Beauty and the Beast: Disney',
  'Disney',
  'Fairy Tale',
  'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400',
  '#1e3a5f',
  'A tale as old as time about beauty, love, and looking beyond appearances.',
  256,
  'Standard English',
  TRUE,
  '2:15:45',
  FALSE,
  'FREE'
);

-- Book 4: Fire and Blood - A Game of Thrones series
INSERT INTO books (
  title, author, category, cover_url, cover_color, description,
  page_count, language, has_audiobook, audio_duration, is_premium, required_plan
) VALUES (
  'Fire and Blood - A Game of Thrones series',
  'George RR Martin',
  'Fantasy',
  'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400',
  '#8b0000',
  'Fire and Blood tells the story of the Targaryen dynasty in Westeros, chronicling the conquest of the Seven Kingdoms by House Targaryen.',
  736,
  'Standard English',
  TRUE,
  '6:20:15',
  TRUE,
  'PRO'
);

-- Book 5: The Chronicles of Narnia
INSERT INTO books (
  title, author, category, cover_url, cover_color, description,
  page_count, language, is_premium, required_plan
) VALUES (
  'The Chronicles of Narnia',
  'C.S. Lewis',
  'Fantasy',
  'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=400',
  '#1a3a52',
  'A magical journey through a wardrobe into a land of eternal winter.',
  768,
  'Standard English',
  TRUE,
  'VIP'
);

-- Book 6: Deadpool Samurai edition: Marvel
INSERT INTO books (
  title, author, category, cover_url, cover_color, description,
  page_count, language, is_premium, required_plan
) VALUES (
  'Deadpool Samurai edition: Marvel',
  'Marvel',
  'Comic',
  'https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=400',
  '#dc143c',
  'The merc with a mouth goes to Japan in this action-packed adventure.',
  192,
  'Standard English',
  FALSE,
  'FREE'
);

-- Book 7: The World of Ice and Fire
INSERT INTO books (
  title, author, category, cover_url, cover_color, description,
  page_count, language, is_premium, required_plan
) VALUES (
  'The World of Ice and Fire',
  'George R.R. Martin',
  'Fantasy',
  'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=400',
  '#8b4513',
  'The comprehensive history of the Seven Kingdoms.',
  336,
  'Standard English',
  FALSE,
  'FREE'
);

-- Book 8: Fantastic Beasts Volume II
INSERT INTO books (
  title, author, category, cover_url, cover_color, description,
  page_count, language, is_premium, required_plan
) VALUES (
  'Fantastic Beasts Volume II',
  'J.K. Rowling',
  'Fantasy',
  'https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=400',
  '#2f4f4f',
  'An exploration of magical creatures in the wizarding world.',
  288,
  'Standard English',
  FALSE,
  'FREE'
);

-- Book 9: Game of Thrones Volume III
INSERT INTO books (
  title, author, category, cover_url, cover_color, description,
  page_count, language, is_premium, required_plan
) VALUES (
  'Game of Thrones Volume III',
  'George R.R. Martin',
  'Fantasy',
  'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400',
  '#4169e1',
  'A Storm of Swords continues the epic saga of Westeros.',
  992,
  'Standard English',
  FALSE,
  'FREE'
);

-- Book 10: The Wise Man's Fear
INSERT INTO books (
  title, author, category, cover_url, cover_color, description,
  page_count, language, is_premium, required_plan
) VALUES (
  'The Wise Man''s Fear',
  'Patrick Rothfuss',
  'Fantasy',
  'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400',
  '#228b22',
  'The second book in the Kingkiller Chronicle series.',
  994,
  'Standard English',
  FALSE,
  'FREE'
);

-- =====================================================
-- COLLECTIONS
-- =====================================================
INSERT INTO collections (title, volumes, chapters_per_volume, cover_url) VALUES
  ('A Legend of Ice and Fire: The Ice Horse', 2, 8, 'https://images.unsplash.com/photo-1621351183012-e2f9972dd9bf?w=400')
ON CONFLICT DO NOTHING;

-- =====================================================
-- DEMO USER (for testing)
-- Password: demo123 (hashed with bcrypt)
-- =====================================================
INSERT INTO users (email, password_hash, name, avatar, plan, type) VALUES
  ('demo@bookbites.com', '$2a$10$xqZKx/ZLLv8YwKxGM3vZqeSaU4r3KfW8Y1lJj7vKZJZWKXqJqKxUy', 'Alexander Mark', '👤', 'FREE', 'user'),
  ('admin@bookbites.com', '$2a$10$xqZKx/ZLLv8YwKxGM3vZqeSaU4r3KfW8Y1lJj7vKZJZWKXqJqKxUy', 'Admin User', '👨‍💼', 'VIP', 'admin')
ON CONFLICT (email) DO NOTHING;

-- =====================================================
-- NOTE: Qolgan ma'lumotlar (reviews, user progress, etc.)
-- foydalanuvchilar tomonidan ishlatish jarayonida yaratiladi
-- =====================================================
