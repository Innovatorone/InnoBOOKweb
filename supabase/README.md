# BookBites Database Schema

## Supabase Migration

Bu loyiha uchun Supabase PostgreSQL database schemasi.

## Migratsiyalarni ishga tushirish

### 1. Supabase Project yaratish

1. [Supabase](https://supabase.com) ga kiring
2. Yangi project yarating
3. Project Settings > API dan `URL` va `anon key` ni oling

### 2. Supabase CLI ornatish

```bash
npm install -g supabase
```

### 3. Loyihani Supabase bilan bog'lash

```bash
# Loyiha papkasida
supabase init

# Supabase bilan login qilish
supabase login

# Loyihani remote project bilan bog'lash
supabase link --project-ref your-project-ref
```

### 4. Migratsiyalarni qo'llash

```bash
# Barcha migratsiyalarni qo'llash
supabase db push

# Yoki SQL fayllarni to'g'ridan-to'g'ri Supabase Dashboard > SQL Editor orqali ishlatish mumkin
```

### 5. Supabase Client kutubxonasini o'rnatish

```bash
npm install @supabase/supabase-js
```

## Database Schema Tahlili

### Asosiy Jadvallar

#### 1. **users** - Foydalanuvchilar
- Autentifikatsiya va profil ma'lumotlari
- Plan tizimi: FREE, PRO, VIP
- Role: user, admin
- Avatar emoji saqlash

#### 2. **books** - Kitoblar
- Barcha kitob ma'lumotlari
- Premium kitoblar uchun plan talabi
- Audiobook qo'llab-quvvatlash
- Rating va review soni

#### 3. **reviews** - Sharhlar
- Foydalanuvchilarning kitob sharhlari
- 1-5 yulduzli rating
- Like tizimi
- Har bir foydalanuvchi bir kitobga bitta sharh

#### 4. **user_reading_progress** - O'qish jarayoni
- Foydalanuvchi qaysi sahifada
- Progress foizi
- O'qish vaqti
- Status: reading, completed, paused, dropped

#### 5. **bookmarks** - Saqlangan kitoblar
- Foydalanuvchining sevimli kitoblari
- FavoritesContext ni replace qiladi

#### 6. **reader_bookmarks** - Sahifa belgilari
- Kitob ichidagi bookmark'lar
- Sahifa raqami va izoh

#### 7. **user_statistics** - Statistika
- O'qilgan kitoblar soni
- Jami sahifalar
- O'qish vaqti (daqiqa)
- Ketma-ket o'qish kunlari (streak)
- O'rtacha rating

#### 8. **badges** - Yutuqlar
- Achievement tizimi
- Talab turi va qiymati
- Icon va tavsif

#### 9. **user_badges** - Foydalanuvchi yutuqlari
- Qachon olingan
- User va badge bog'lanishi

#### 10. **authors** - Mualliflar
- Muallif ma'lumotlari
- Bio, quote, tugʻilgan sana
- Avatar emoji

#### 11. **book_authors** - Kitob-Muallif bog'lanishi
- Many-to-many relationship
- Role: author, co-author, editor, translator

#### 12. **collections** - Kolleksiyalar
- Kitob seriyalari
- Volume va chapter ma'lumotlari

#### 13. **friends** - Do'stlar
- Foydalanuvchilar o'rtasidagi do'stlik
- Status: pending, accepted, blocked

#### 14. **user_activities** - Faoliyat timeline
- Comment, reading, completed, review, bookmark
- Do'stlarning faoliyatini ko'rish

#### 15. **reading_schedule** - O'qish jadvali
- Kunlik maqsadlar
- Bajarilgan sahifalar

## Xususiyatlar

### 1. Auto-Update Timestamps
- Barcha jadvallar `created_at` va `updated_at` ga ega
- Trigger orqali avtomatik yangilanadi

### 2. Auto-Calculate Rating
- Review qo'shilganda kitob ratingi avtomatik hisoblanadi
- Trigger funksiya: `update_book_rating()`

### 3. Auto-Update Statistics
- Kitob tugallanganda statistika avtomatik yangilanadi
- Trigger funksiya: `update_user_statistics()`

### 4. Row Level Security (RLS)
- Har bir jadval uchun xavfsizlik qoidalari
- Foydalanuvchilar faqat o'z ma'lumotlarini ko'radi/tahrirlaydi
- Admin'lar kitoblarni boshqaradi
- Barcha reviewlarni ko'rish mumkin

### 5. Indexes
- Tez qidiruv uchun muhim ustunlarda index
- Performance optimization

## Environment Variables

`.env.local` faylida quyidagilarni qo'shing:

```env
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## API Integration Plan

Keyingi qadamlar:
1. Supabase client setup (`src/lib/supabase.js`)
2. API service'larni yaratish (`src/services/`)
3. Context'larni Supabase bilan integratsiya qilish
4. LocalStorage'dan Supabase'ga o'tish
5. Real-time subscriptions qo'shish

## Tarmoq Diagrammasi

```
users ──┬── user_reading_progress ── books
        ├── bookmarks ── books
        ├── reader_bookmarks ── books
        ├── reviews ── books
        ├── user_statistics
        ├── user_badges ── badges
        ├── friends (self-reference)
        ├── reading_schedule
        └── user_activities ── books

books ──┬── book_authors ── authors
        ├── collection_books ── collections
        └── reviews ── users

reviews ── review_likes ── users
```

## Muhim Eslatmalar

1. **Password Hashing**: Parollar bcrypt bilan hash qilinadi (cost factor: 10)
2. **UUID**: Barcha ID'lar UUID v4 formatida
3. **Timestamps**: Barcha vaqtlar UTC timezone bilan
4. **Cascading Deletes**: Foydalanuvchi o'chirilsa, barcha bog'liq ma'lumotlar avtomatik o'chiriladi
5. **Unique Constraints**: Bir foydalanuvchi bir kitobga bitta review, bitta bookmark, etc.

## Sample Credentials

Demo account:
- Email: `demo@bookbites.com`
- Password: `demo123`

Admin account:
- Email: `admin@bookbites.com`
- Password: `demo123`

**Eslatma**: Production'da bu parollarni o'zgartiring!
