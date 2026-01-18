-- =====================================================
-- SUBSCRIPTION PLANS TABLE
-- Obuna tariflari
-- =====================================================

CREATE TABLE IF NOT EXISTS subscription_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(20) UNIQUE NOT NULL CHECK (name IN ('FREE', 'PRO', 'VIP')),
  price INTEGER NOT NULL DEFAULT 0,
  duration VARCHAR(20) NOT NULL DEFAULT 'Oylik' CHECK (duration IN ('Doimiy', 'Oylik', 'Yillik')),
  features JSONB NOT NULL DEFAULT '[]'::jsonb,
  color VARCHAR(10) DEFAULT '#10b981',
  is_active BOOLEAN DEFAULT TRUE,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Default tariflarni qo'shish
INSERT INTO subscription_plans (name, price, duration, features, color, display_order) VALUES
  ('FREE', 0, 'Doimiy', 
   '["Oddiy kitoblar", "Chegara: 5 kitob/oy"]'::jsonb, 
   '#10b981', 1),
  
  ('PRO', 29000, 'Oylik', 
   '["Premium kitoblar", "Audiobook", "Chegara: 20 kitob/oy"]'::jsonb, 
   '#3b82f6', 2),
  
  ('VIP', 99000, 'Oylik', 
   '["Barcha kitoblar", "Audiobook", "Cheksiz", "Maxsus materiallar"]'::jsonb, 
   '#f59e0b', 3)
ON CONFLICT (name) DO NOTHING;

-- =====================================================
-- CATEGORIES TABLE
-- Kitob kategoriyalari
-- =====================================================

CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) UNIQUE NOT NULL,
  icon VARCHAR(10) DEFAULT '📚',
  description TEXT,
  book_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Default kategoriyalarni qo'shish
INSERT INTO categories (name, icon, description, display_order) VALUES
  ('Fantasy', '🧙', 'Fantastik asarlar', 1),
  ('Comic', '📚', 'Komiks va manga', 2),
  ('Fairy Tale', '🧚', 'Ertaklar', 3),
  ('Science Fiction', '🚀', 'Ilmiy-fantastika', 4),
  ('Romance', '💕', 'Romantik hikoyalar', 5),
  ('Mystery', '🔍', 'Detektiv va sirli hikoyalar', 6),
  ('Horror', '👻', 'Qo''rqinchli hikoyalar', 7),
  ('Adventure', '🏰', 'Sarguzasht asarlari', 8)
ON CONFLICT (name) DO NOTHING;

-- Update function for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for auto-updating updated_at
CREATE TRIGGER update_subscription_plans_updated_at BEFORE UPDATE ON subscription_plans
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Indexes
CREATE INDEX IF NOT EXISTS idx_subscription_plans_name ON subscription_plans(name);
CREATE INDEX IF NOT EXISTS idx_subscription_plans_active ON subscription_plans(is_active);
CREATE INDEX IF NOT EXISTS idx_categories_name ON categories(name);
CREATE INDEX IF NOT EXISTS idx_categories_active ON categories(is_active);
