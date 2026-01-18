-- =====================================================
-- ADD CATEGORY_ID TO BOOKS TABLE
-- Kitoblarni kategoriyalar bilan bog'lash
-- =====================================================

-- Category_id ustuni qo'shish
ALTER TABLE books
ADD COLUMN category_id UUID REFERENCES categories(id) ON DELETE SET NULL;

-- Index qo'shish
CREATE INDEX IF NOT EXISTS idx_books_category_id ON books(category_id);

-- Mavjud kitoblarni 'Fantasy' kategoriyasiga tayinlash (ixtiyoriy)
UPDATE books 
SET category_id = (SELECT id FROM categories WHERE name = 'Fantasy' LIMIT 1)
WHERE category_id IS NULL;
