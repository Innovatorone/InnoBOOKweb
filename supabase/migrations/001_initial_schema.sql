-- =====================================================
-- BookBites Database Migration
-- Supabase SQL Schema
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- USERS TABLE
-- Foydalanuvchilar ma'lumotlari
-- =====================================================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  avatar VARCHAR(50) DEFAULT '👤',
  plan VARCHAR(20) DEFAULT 'FREE' CHECK (plan IN ('FREE', 'PRO', 'VIP')),
  type VARCHAR(20) DEFAULT 'user' CHECK (type IN ('user', 'admin')),
  joined_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- BOOKS TABLE
-- Kitoblar ma'lumotlari
-- =====================================================
CREATE TABLE IF NOT EXISTS books (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(500) NOT NULL,
  author VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL DEFAULT 'Fiction',
  cover_url TEXT,
  cover_color VARCHAR(20),
  description TEXT,
  full_description TEXT,
  page_count INTEGER DEFAULT 0,
  language VARCHAR(100) DEFAULT 'Standard English',
  format VARCHAR(50) DEFAULT 'Paperback',
  isbn VARCHAR(50),
  publisher VARCHAR(255),
  publish_year INTEGER,
  editors TEXT,
  rating DECIMAL(3, 2) DEFAULT 0.0 CHECK (rating >= 0 AND rating <= 5),
  total_reviews INTEGER DEFAULT 0,
  is_premium BOOLEAN DEFAULT FALSE,
  required_plan VARCHAR(20) DEFAULT 'FREE' CHECK (required_plan IN ('FREE', 'PRO', 'VIP')),
  has_audiobook BOOLEAN DEFAULT FALSE,
  audio_url TEXT,
  audio_duration VARCHAR(20),
  narrator VARCHAR(255),
  book_file_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- REVIEWS TABLE
-- Kitob sharhlari
-- =====================================================
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  book_id UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  likes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(book_id, user_id)
);

-- =====================================================
-- USER_READING_PROGRESS TABLE
-- Foydalanuvchilarning kitob o'qish jarayoni
-- =====================================================
CREATE TABLE IF NOT EXISTS user_reading_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  book_id UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE,
  current_page INTEGER DEFAULT 0,
  progress_percentage DECIMAL(5, 2) DEFAULT 0.0,
  last_read_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  reading_time_minutes INTEGER DEFAULT 0,
  status VARCHAR(20) DEFAULT 'reading' CHECK (status IN ('reading', 'completed', 'paused', 'dropped')),
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, book_id)
);

-- =====================================================
-- BOOKMARKS TABLE
-- Foydalanuvchilarning saqlagan kitoblari
-- =====================================================
CREATE TABLE IF NOT EXISTS bookmarks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  book_id UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, book_id)
);

-- =====================================================
-- READER_BOOKMARKS TABLE
-- Kitob ichidagi sahifa belgilari (reader bookmarks)
-- =====================================================
CREATE TABLE IF NOT EXISTS reader_bookmarks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  book_id UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE,
  page_number INTEGER NOT NULL,
  note TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, book_id, page_number)
);

-- =====================================================
-- COLLECTIONS TABLE
-- Kitob kolleksiyalari
-- =====================================================
CREATE TABLE IF NOT EXISTS collections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(500) NOT NULL,
  cover_url TEXT,
  volumes INTEGER DEFAULT 1,
  chapters_per_volume INTEGER,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- COLLECTION_BOOKS TABLE
-- Kolleksiya va kitoblar bog'lanishi
-- =====================================================
CREATE TABLE IF NOT EXISTS collection_books (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  collection_id UUID NOT NULL REFERENCES collections(id) ON DELETE CASCADE,
  book_id UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE,
  volume_number INTEGER,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(collection_id, book_id)
);

-- =====================================================
-- AUTHORS TABLE
-- Mualliflar ma'lumotlari
-- =====================================================
CREATE TABLE IF NOT EXISTS authors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  avatar VARCHAR(50),
  title VARCHAR(100),
  bio TEXT,
  quote TEXT,
  birth_date DATE,
  death_date DATE,
  nationality VARCHAR(100),
  website_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- BOOK_AUTHORS TABLE
-- Kitob va mualliflar bog'lanishi (many-to-many)
-- =====================================================
CREATE TABLE IF NOT EXISTS book_authors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  book_id UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES authors(id) ON DELETE CASCADE,
  role VARCHAR(50) DEFAULT 'author' CHECK (role IN ('author', 'co-author', 'editor', 'translator')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(book_id, author_id, role)
);

-- =====================================================
-- USER_STATISTICS TABLE
-- Foydalanuvchi statistikasi
-- =====================================================
CREATE TABLE IF NOT EXISTS user_statistics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  books_read INTEGER DEFAULT 0,
  total_pages_read INTEGER DEFAULT 0,
  reading_time_minutes INTEGER DEFAULT 0,
  reading_streak_days INTEGER DEFAULT 0,
  last_streak_date DATE,
  average_rating DECIMAL(3, 2) DEFAULT 0.0,
  reviews_written INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- BADGES TABLE
-- Badge'lar (achievements)
-- =====================================================
CREATE TABLE IF NOT EXISTS badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL UNIQUE,
  icon VARCHAR(50),
  description TEXT,
  requirement_type VARCHAR(50) NOT NULL,
  requirement_value INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- USER_BADGES TABLE
-- Foydalanuvchi badge'lari
-- =====================================================
CREATE TABLE IF NOT EXISTS user_badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  badge_id UUID NOT NULL REFERENCES badges(id) ON DELETE CASCADE,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, badge_id)
);

-- =====================================================
-- REVIEW_LIKES TABLE
-- Sharhlarga like bosish
-- =====================================================
CREATE TABLE IF NOT EXISTS review_likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  review_id UUID NOT NULL REFERENCES reviews(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(review_id, user_id)
);

-- =====================================================
-- FRIENDS TABLE
-- Foydalanuvchilar do'stligi
-- =====================================================
CREATE TABLE IF NOT EXISTS friends (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  friend_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'blocked')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CHECK (user_id != friend_id),
  UNIQUE(user_id, friend_id)
);

-- =====================================================
-- READING_SCHEDULE TABLE
-- O'qish jadvallari
-- =====================================================
CREATE TABLE IF NOT EXISTS reading_schedule (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  target_pages INTEGER DEFAULT 0,
  completed_pages INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- =====================================================
-- USER_ACTIVITIES TABLE
-- Foydalanuvchi faoliyati (timeline uchun)
-- =====================================================
CREATE TABLE IF NOT EXISTS user_activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  activity_type VARCHAR(50) NOT NULL CHECK (activity_type IN ('comment', 'reading', 'completed', 'review', 'bookmark')),
  book_id UUID REFERENCES books(id) ON DELETE CASCADE,
  chapter VARCHAR(255),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- INDEXES for Performance
-- =====================================================
CREATE INDEX idx_books_author ON books(author);
CREATE INDEX idx_books_category ON books(category);
CREATE INDEX idx_books_is_premium ON books(is_premium);
CREATE INDEX idx_books_rating ON books(rating DESC);
CREATE INDEX idx_reviews_book_id ON reviews(book_id);
CREATE INDEX idx_reviews_user_id ON reviews(user_id);
CREATE INDEX idx_reviews_created_at ON reviews(created_at DESC);
CREATE INDEX idx_user_reading_progress_user_id ON user_reading_progress(user_id);
CREATE INDEX idx_user_reading_progress_book_id ON user_reading_progress(book_id);
CREATE INDEX idx_user_reading_progress_status ON user_reading_progress(status);
CREATE INDEX idx_bookmarks_user_id ON bookmarks(user_id);
CREATE INDEX idx_bookmarks_book_id ON bookmarks(book_id);
CREATE INDEX idx_reader_bookmarks_user_book ON reader_bookmarks(user_id, book_id);
CREATE INDEX idx_user_activities_user_id ON user_activities(user_id);
CREATE INDEX idx_user_activities_created_at ON user_activities(created_at DESC);
CREATE INDEX idx_friends_user_id ON friends(user_id);
CREATE INDEX idx_friends_status ON friends(status);

-- =====================================================
-- FUNCTIONS for Auto-Update Timestamps
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- TRIGGERS for Auto-Update Timestamps
-- =====================================================
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_books_updated_at BEFORE UPDATE ON books
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_reading_progress_updated_at BEFORE UPDATE ON user_reading_progress
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_collections_updated_at BEFORE UPDATE ON collections
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_authors_updated_at BEFORE UPDATE ON authors
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_statistics_updated_at BEFORE UPDATE ON user_statistics
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- FUNCTION to Update Book Rating
-- Kitob ratingini avtomatik yangilash
-- =====================================================
CREATE OR REPLACE FUNCTION update_book_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE books SET
    rating = (
      SELECT COALESCE(AVG(rating), 0)
      FROM reviews
      WHERE book_id = NEW.book_id
    ),
    total_reviews = (
      SELECT COUNT(*)
      FROM reviews
      WHERE book_id = NEW.book_id
    )
  WHERE id = NEW.book_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_book_rating AFTER INSERT OR UPDATE ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_book_rating();

-- =====================================================
-- FUNCTION to Update Review Likes Count
-- Sharh likes sonini avtomatik yangilash
-- =====================================================
CREATE OR REPLACE FUNCTION update_review_likes()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE reviews SET
    likes = (
      SELECT COUNT(*)
      FROM review_likes
      WHERE review_id = COALESCE(NEW.review_id, OLD.review_id)
    )
  WHERE id = COALESCE(NEW.review_id, OLD.review_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_review_likes AFTER INSERT OR DELETE ON review_likes
  FOR EACH ROW EXECUTE FUNCTION update_review_likes();

-- =====================================================
-- FUNCTION to Update User Statistics
-- Foydalanuvchi statistikasini avtomatik yangilash
-- =====================================================
CREATE OR REPLACE FUNCTION update_user_statistics()
RETURNS TRIGGER AS $$
BEGIN
  -- Kitob tugallanganda statistikani yangilash
  IF NEW.status = 'completed' AND (OLD.status IS NULL OR OLD.status != 'completed') THEN
    INSERT INTO user_statistics (user_id, books_read, total_pages_read, reading_time_minutes)
    VALUES (
      NEW.user_id,
      1,
      (SELECT page_count FROM books WHERE id = NEW.book_id),
      NEW.reading_time_minutes
    )
    ON CONFLICT (user_id) DO UPDATE SET
      books_read = user_statistics.books_read + 1,
      total_pages_read = user_statistics.total_pages_read + (SELECT page_count FROM books WHERE id = NEW.book_id),
      reading_time_minutes = user_statistics.reading_time_minutes + NEW.reading_time_minutes,
      updated_at = NOW();
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_user_statistics AFTER INSERT OR UPDATE ON user_reading_progress
  FOR EACH ROW EXECUTE FUNCTION update_user_statistics();

-- =====================================================
-- ROW LEVEL SECURITY (RLS) Policies
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE books ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_reading_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE reader_bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_statistics ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE friends ENABLE ROW LEVEL SECURITY;
ALTER TABLE reading_schedule ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_activities ENABLE ROW LEVEL SECURITY;

-- Users can read their own data
CREATE POLICY "Users can view own data" ON users
  FOR SELECT USING (auth.uid() = id);

-- Users can update their own data
CREATE POLICY "Users can update own data" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Everyone can read books
CREATE POLICY "Anyone can view books" ON books
  FOR SELECT USING (TRUE);

-- Only admins can insert/update books
CREATE POLICY "Only admins can modify books" ON books
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND type = 'admin'
    )
  );

-- Users can read all reviews
CREATE POLICY "Anyone can view reviews" ON reviews
  FOR SELECT USING (TRUE);

-- Users can create their own reviews
CREATE POLICY "Users can create reviews" ON reviews
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own reviews
CREATE POLICY "Users can update own reviews" ON reviews
  FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own reviews
CREATE POLICY "Users can delete own reviews" ON reviews
  FOR DELETE USING (auth.uid() = user_id);

-- Users can only access their own reading progress
CREATE POLICY "Users can view own reading progress" ON user_reading_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own reading progress" ON user_reading_progress
  FOR ALL USING (auth.uid() = user_id);

-- Users can only access their own bookmarks
CREATE POLICY "Users can view own bookmarks" ON bookmarks
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own bookmarks" ON bookmarks
  FOR ALL USING (auth.uid() = user_id);

-- Users can only access their own reader bookmarks
CREATE POLICY "Users can view own reader bookmarks" ON reader_bookmarks
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own reader bookmarks" ON reader_bookmarks
  FOR ALL USING (auth.uid() = user_id);

-- Users can only access their own statistics
CREATE POLICY "Users can view own statistics" ON user_statistics
  FOR SELECT USING (auth.uid() = user_id);

-- Users can only access their own badges
CREATE POLICY "Users can view own badges" ON user_badges
  FOR SELECT USING (auth.uid() = user_id);

-- Users can like reviews
CREATE POLICY "Users can view review likes" ON review_likes
  FOR SELECT USING (TRUE);

CREATE POLICY "Users can create review likes" ON review_likes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own review likes" ON review_likes
  FOR DELETE USING (auth.uid() = user_id);

-- Friends policies
CREATE POLICY "Users can view own friends" ON friends
  FOR SELECT USING (auth.uid() = user_id OR auth.uid() = friend_id);

CREATE POLICY "Users can manage own friendships" ON friends
  FOR ALL USING (auth.uid() = user_id);

-- Reading schedule policies
CREATE POLICY "Users can view own schedule" ON reading_schedule
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own schedule" ON reading_schedule
  FOR ALL USING (auth.uid() = user_id);

-- Activity policies
CREATE POLICY "Users can view friends activities" ON user_activities
  FOR SELECT USING (
    auth.uid() = user_id OR
    EXISTS (
      SELECT 1 FROM friends 
      WHERE (user_id = auth.uid() AND friend_id = user_activities.user_id AND status = 'accepted')
      OR (friend_id = auth.uid() AND user_id = user_activities.user_id AND status = 'accepted')
    )
  );

CREATE POLICY "Users can create own activities" ON user_activities
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- =====================================================
-- COMMENTS
-- =====================================================
COMMENT ON TABLE users IS 'Foydalanuvchilar jadvali - barcha foydalanuvchilar ma''lumotlari';
COMMENT ON TABLE books IS 'Kitoblar jadvali - barcha kitoblar ma''lumotlari';
COMMENT ON TABLE reviews IS 'Sharhlar jadvali - foydalanuvchilarning kitob sharhlari';
COMMENT ON TABLE user_reading_progress IS 'O''qish jarayoni - foydalanuvchilarning kitob o''qish progressi';
COMMENT ON TABLE bookmarks IS 'Saqlangan kitoblar - foydalanuvchilarning sevimli kitoblari';
COMMENT ON TABLE reader_bookmarks IS 'Sahifa belgilari - kitob ichidagi sahifa bookmark''lari';
COMMENT ON TABLE user_statistics IS 'Foydalanuvchi statistikasi - o''qilgan kitoblar, sahifalar, vaqt';
COMMENT ON TABLE badges IS 'Badgelar - yutuqlar (achievements)';
COMMENT ON TABLE user_badges IS 'Foydalanuvchi badge''lari - foydalanuvchilar tomonidan olingan badgelar';
COMMENT ON TABLE friends IS 'Do''stlar - foydalanuvchilar o''rtasidagi do''stlik';
COMMENT ON TABLE user_activities IS 'Faoliyat - foydalanuvchilarning timeline faoliyati';
