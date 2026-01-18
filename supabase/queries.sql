-- =====================================================
-- Useful Database Queries
-- Foydali so'rovlar va ma'lumot olish
-- =====================================================

-- =====================================================
-- BOOKS QUERIES
-- =====================================================

-- 1. Barcha kitoblarni rating bo'yicha saralash
SELECT 
  id, title, author, category, rating, total_reviews, is_premium
FROM books
ORDER BY rating DESC, total_reviews DESC
LIMIT 20;

-- 2. Premium kitoblarni plan bo'yicha olish
SELECT 
  title, author, required_plan, rating, page_count
FROM books
WHERE is_premium = TRUE
ORDER BY required_plan, rating DESC;

-- 3. Audiobook'larni olish
SELECT 
  title, author, audio_duration, narrator, rating
FROM books
WHERE has_audiobook = TRUE
ORDER BY rating DESC;

-- 4. Kategoriya bo'yicha kitoblar
SELECT 
  category, COUNT(*) as total_books, AVG(rating) as avg_rating
FROM books
GROUP BY category
ORDER BY total_books DESC;

-- 5. Eng ko'p sharh yozilgan kitoblar
SELECT 
  title, author, total_reviews, rating
FROM books
WHERE total_reviews > 0
ORDER BY total_reviews DESC
LIMIT 10;

-- =====================================================
-- USER QUERIES
-- =====================================================

-- 6. Plan bo'yicha foydalanuvchilar statistikasi
SELECT 
  plan, COUNT(*) as user_count
FROM users
WHERE is_active = TRUE
GROUP BY plan
ORDER BY user_count DESC;

-- 7. Oxirgi ro'yxatdan o'tganlar
SELECT 
  name, email, plan, joined_date
FROM users
ORDER BY joined_date DESC
LIMIT 20;

-- 8. Active foydalanuvchilar
SELECT 
  u.name, u.plan, u.last_login,
  us.books_read, us.reading_time_minutes
FROM users u
LEFT JOIN user_statistics us ON u.id = us.user_id
WHERE u.last_login > NOW() - INTERVAL '30 days'
ORDER BY u.last_login DESC;

-- =====================================================
-- READING PROGRESS QUERIES
-- =====================================================

-- 9. Eng aktiv o'quvchilar
SELECT 
  u.name, 
  COUNT(DISTINCT urp.book_id) as books_reading,
  SUM(urp.reading_time_minutes) as total_minutes
FROM users u
JOIN user_reading_progress urp ON u.id = urp.user_id
WHERE urp.status = 'reading'
GROUP BY u.id, u.name
ORDER BY total_minutes DESC
LIMIT 20;

-- 10. Tugallangan kitoblar statistikasi
SELECT 
  b.title, 
  COUNT(urp.user_id) as completed_by_users,
  AVG(urp.reading_time_minutes) as avg_reading_time
FROM books b
JOIN user_reading_progress urp ON b.id = urp.book_id
WHERE urp.status = 'completed'
GROUP BY b.id, b.title
ORDER BY completed_by_users DESC
LIMIT 20;

-- 11. Foydalanuvchining o'qish jarayoni
SELECT 
  b.title, b.author, b.page_count,
  urp.current_page, urp.progress_percentage, urp.status,
  urp.last_read_at, urp.reading_time_minutes
FROM user_reading_progress urp
JOIN books b ON urp.book_id = b.id
WHERE urp.user_id = 'USER_UUID_HERE'
ORDER BY urp.last_read_at DESC;

-- =====================================================
-- REVIEWS & RATINGS QUERIES
-- =====================================================

-- 12. Kitobning barcha sharhlari
SELECT 
  r.rating, r.comment, r.likes, r.created_at,
  u.name as user_name, u.avatar
FROM reviews r
JOIN users u ON r.user_id = u.id
WHERE r.book_id = 'BOOK_UUID_HERE'
ORDER BY r.created_at DESC;

-- 13. Rating distribution (1-5 yulduz)
SELECT 
  rating, COUNT(*) as count,
  ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 2) as percentage
FROM reviews
WHERE book_id = 'BOOK_UUID_HERE'
GROUP BY rating
ORDER BY rating DESC;

-- 14. Eng ko'p sharh yozganlar
SELECT 
  u.name, COUNT(r.id) as review_count, AVG(r.rating) as avg_rating_given
FROM users u
JOIN reviews r ON u.id = r.user_id
GROUP BY u.id, u.name
ORDER BY review_count DESC
LIMIT 20;

-- 15. Oxirgi sharhlar (timeline)
SELECT 
  r.rating, r.comment, r.created_at,
  u.name as user_name, u.avatar,
  b.title as book_title, b.author
FROM reviews r
JOIN users u ON r.user_id = u.id
JOIN books b ON r.book_id = b.id
ORDER BY r.created_at DESC
LIMIT 50;

-- =====================================================
-- BOOKMARKS & FAVORITES QUERIES
-- =====================================================

-- 16. Foydalanuvchining saqlangan kitoblari
SELECT 
  b.title, b.author, b.cover_url, b.rating,
  bm.created_at as bookmarked_at
FROM bookmarks bm
JOIN books b ON bm.book_id = b.id
WHERE bm.user_id = 'USER_UUID_HERE'
ORDER BY bm.created_at DESC;

-- 17. Eng ko'p saqlangan kitoblar
SELECT 
  b.title, b.author, COUNT(bm.user_id) as bookmark_count
FROM books b
JOIN bookmarks bm ON b.id = bm.book_id
GROUP BY b.id, b.title, b.author
ORDER BY bookmark_count DESC
LIMIT 20;

-- =====================================================
-- STATISTICS & ACHIEVEMENTS QUERIES
-- =====================================================

-- 18. Foydalanuvchi statistikasi
SELECT 
  us.books_read,
  us.total_pages_read,
  us.reading_time_minutes,
  ROUND(us.reading_time_minutes::NUMERIC / 60, 2) as reading_hours,
  us.reading_streak_days,
  us.average_rating,
  us.reviews_written
FROM user_statistics us
WHERE us.user_id = 'USER_UUID_HERE';

-- 19. Top o'quvchilar (leaderboard)
SELECT 
  u.name, u.avatar,
  us.books_read,
  us.total_pages_read,
  us.reading_time_minutes,
  us.reading_streak_days
FROM user_statistics us
JOIN users u ON us.user_id = u.id
ORDER BY us.books_read DESC, us.total_pages_read DESC
LIMIT 50;

-- 20. Foydalanuvchi badge'lari
SELECT 
  b.name, b.icon, b.description,
  ub.earned_at
FROM user_badges ub
JOIN badges b ON ub.badge_id = b.id
WHERE ub.user_id = 'USER_UUID_HERE'
ORDER BY ub.earned_at DESC;

-- 21. Badge progress (necha % bajarilgan)
WITH user_stats AS (
  SELECT * FROM user_statistics WHERE user_id = 'USER_UUID_HERE'
)
SELECT 
  b.name, b.icon, b.description,
  b.requirement_type, b.requirement_value,
  CASE 
    WHEN b.requirement_type = 'books_read' THEN us.books_read
    WHEN b.requirement_type = 'reviews_written' THEN us.reviews_written
    WHEN b.requirement_type = 'reading_streak' THEN us.reading_streak_days
    ELSE 0
  END as current_value,
  ROUND(
    CASE 
      WHEN b.requirement_type = 'books_read' THEN (us.books_read::NUMERIC / b.requirement_value * 100)
      WHEN b.requirement_type = 'reviews_written' THEN (us.reviews_written::NUMERIC / b.requirement_value * 100)
      WHEN b.requirement_type = 'reading_streak' THEN (us.reading_streak_days::NUMERIC / b.requirement_value * 100)
      ELSE 0
    END, 2
  ) as progress_percentage,
  EXISTS(SELECT 1 FROM user_badges WHERE user_id = 'USER_UUID_HERE' AND badge_id = b.id) as unlocked
FROM badges b
CROSS JOIN user_stats us
ORDER BY progress_percentage DESC;

-- =====================================================
-- FRIENDS & SOCIAL QUERIES
-- =====================================================

-- 22. Foydalanuvchining do'stlari
SELECT 
  u.name, u.avatar, u.plan,
  f.status, f.created_at
FROM friends f
JOIN users u ON f.friend_id = u.id
WHERE f.user_id = 'USER_UUID_HERE' AND f.status = 'accepted'
ORDER BY f.created_at DESC;

-- 23. Do'stlarning faoliyati (timeline)
SELECT 
  u.name, u.avatar,
  ua.activity_type, ua.comment, ua.chapter,
  b.title as book_title,
  ua.created_at
FROM user_activities ua
JOIN users u ON ua.user_id = u.id
LEFT JOIN books b ON ua.book_id = b.id
WHERE ua.user_id IN (
  SELECT friend_id FROM friends 
  WHERE user_id = 'USER_UUID_HERE' AND status = 'accepted'
)
ORDER BY ua.created_at DESC
LIMIT 50;

-- =====================================================
-- ADMIN QUERIES
-- =====================================================

-- 24. Platform statistikasi (dashboard uchun)
SELECT 
  (SELECT COUNT(*) FROM users WHERE is_active = TRUE) as total_users,
  (SELECT COUNT(*) FROM users WHERE plan = 'FREE') as free_users,
  (SELECT COUNT(*) FROM users WHERE plan = 'PRO') as pro_users,
  (SELECT COUNT(*) FROM users WHERE plan = 'VIP') as vip_users,
  (SELECT COUNT(*) FROM books) as total_books,
  (SELECT COUNT(*) FROM books WHERE is_premium = TRUE) as premium_books,
  (SELECT COUNT(*) FROM reviews) as total_reviews,
  (SELECT AVG(rating) FROM books) as avg_book_rating;

-- 25. Kunlik yangi foydalanuvchilar (oxirgi 30 kun)
SELECT 
  DATE(joined_date) as date,
  COUNT(*) as new_users
FROM users
WHERE joined_date > NOW() - INTERVAL '30 days'
GROUP BY DATE(joined_date)
ORDER BY date DESC;

-- 26. Eng mashhur kitoblar (bookmarks + reviews + reading)
SELECT 
  b.title, b.author, b.rating,
  COUNT(DISTINCT bm.user_id) as bookmarks,
  COUNT(DISTINCT r.user_id) as reviews,
  COUNT(DISTINCT urp.user_id) as readers,
  (COUNT(DISTINCT bm.user_id) + COUNT(DISTINCT r.user_id) + COUNT(DISTINCT urp.user_id)) as popularity_score
FROM books b
LEFT JOIN bookmarks bm ON b.id = bm.book_id
LEFT JOIN reviews r ON b.id = r.book_id
LEFT JOIN user_reading_progress urp ON b.id = urp.book_id
GROUP BY b.id, b.title, b.author, b.rating
ORDER BY popularity_score DESC
LIMIT 20;

-- =====================================================
-- PERFORMANCE MONITORING QUERIES
-- =====================================================

-- 27. Database size
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- 28. Most active tables
SELECT 
  relname as table_name,
  n_tup_ins as inserts,
  n_tup_upd as updates,
  n_tup_del as deletes
FROM pg_stat_user_tables
ORDER BY (n_tup_ins + n_tup_upd + n_tup_del) DESC;

-- =====================================================
-- MAINTENANCE QUERIES
-- =====================================================

-- 29. O'chirilgan foydalanuvchilarni tozalash
-- DELETE FROM users WHERE is_active = FALSE AND last_login < NOW() - INTERVAL '1 year';

-- 30. Eski faoliyatlarni arxivlash
-- DELETE FROM user_activities WHERE created_at < NOW() - INTERVAL '6 months';

-- =====================================================
-- CUSTOM VIEWS (optional)
-- =====================================================

-- Popular books view
CREATE OR REPLACE VIEW popular_books AS
SELECT 
  b.*,
  COUNT(DISTINCT bm.user_id) as bookmark_count,
  COUNT(DISTINCT urp.user_id) as reader_count
FROM books b
LEFT JOIN bookmarks bm ON b.id = bm.book_id
LEFT JOIN user_reading_progress urp ON b.id = urp.book_id
GROUP BY b.id
ORDER BY bookmark_count DESC, reader_count DESC;

-- User profile view
CREATE OR REPLACE VIEW user_profiles AS
SELECT 
  u.id, u.name, u.avatar, u.plan, u.joined_date,
  us.books_read, us.total_pages_read, us.reading_time_minutes,
  us.reading_streak_days, us.average_rating,
  COUNT(DISTINCT ub.badge_id) as badges_earned
FROM users u
LEFT JOIN user_statistics us ON u.id = us.user_id
LEFT JOIN user_badges ub ON u.id = ub.user_id
GROUP BY u.id, us.books_read, us.total_pages_read, us.reading_time_minutes,
         us.reading_streak_days, us.average_rating;
