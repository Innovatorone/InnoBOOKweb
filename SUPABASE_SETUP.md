# 🚀 Supabase Integration Setup Guide

## 1. Supabase Project yaratish

1. [Supabase](https://supabase.com) ga kiring (yoki ro'yxatdan o'ting)
2. "New Project" tugmasini bosing
3. Project nomi kiriting: `bookbites`
4. Database parolini yarating (ESLAB QOLING!)
5. Region tanlang (eng yaqini: Singapore)
6. "Create new project" bosing

## 2. Database Migration qo'llash

### Variant 1: Supabase Dashboard orqali

1. Supabase Dashboard'da proyektingizni oching
2. Chap menyudan **SQL Editor** ni bosing
3. `supabase/migrations/001_initial_schema.sql` faylini oching
4. Barcha kodini nusxalang
5. SQL Editor'ga joylashtiring va **Run** bosing
6. `002_sample_data.sql` ni ham xuddi shunday qo'llang
7. **MUHIM:** `003_auth_trigger.sql` ni qo'llang (bu yangi userlar uchun avtomatik profil yaratadi)

### Variant 2: Supabase CLI orqali

```bash
# Supabase CLI o'rnatish
npm install -g supabase

# Login qilish
supabase login

# Loyihani bog'lash
supabase link --project-ref your-project-ref

# Migratsiyalarni qo'llash
supabase db push
```

## 3. API Keys olish

1. Supabase Dashboard'da **Settings** > **API** ga o'ting
2. Quyidagi ma'lumotlarni ko'chirib oling:
   - **Project URL** (URL)
   - **anon public** key

## 4. Environment Variables sozlash

1. `.env.local.example` faylini nusxalang:
   ```bash
   cp .env.local.example .env.local
   ```

2. `.env.local` faylini oching va o'z ma'lumotlaringizni kiriting:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

## 5. Development serverni ishga tushirish

```bash
npm run dev
```

## 6. Test akkauntlar

**Demo akkaunt:**
- Email: `demo@bookbites.com`
- Password: `demo123`

**Admin akkaunt:**
- Email: `admin@bookbites.com`
- Password: `demo123`

---

## 🔧 Troubleshooting

### Migration xatoliklari

Agar migration xatolik bersa:

1. SQL Editor'da barcha jadvallarni o'chiring:
```sql
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
```

2. Migration'ni qaytadan qo'llang

### Authentication ishlamayapti

1. Supabase Dashboard > **Authentication** > **Providers** ga o'ting
2. **Email** provider yoqilganligini tekshiring
3. **Confirm email** o'chirilganligini tekshiring (development uchun)

### RLS (Row Level Security) muammolari

Agar ma'lumotlar ko'rinmasa:

1. SQL Editor'da:
```sql
-- RLS'ni vaqtinchalik o'chirish (faqat development)
ALTER TABLE books DISABLE ROW LEVEL SECURITY;
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
```

---

## 📚 Keyingi qadamlar

1. ✅ Supabase project yaratildi
2. ✅ Migration qo'llandi
3. ✅ Environment variables sozlandi
4. ✅ Development server ishga tushdi
5. ⬜ Production deploy (Vercel, Netlify)
6. ⬜ Email verification sozlash
7. ⬜ Payment integration (PRO/VIP plans)

---

## 🎯 Production Deployment

### Vercel

```bash
# Environment variables qo'shish
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_ANON_KEY

# Deploy
vercel --prod
```

### Netlify

1. Netlify Dashboard'da loyihangizni oching
2. **Site settings** > **Environment variables**
3. Quyidagi o'zgaruvchilarni qo'shing:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Deploy qiling

---

## 📦 Storage Buckets Setup

### 1. Bucketlarni yaratish

Supabase Dashboard'da **Storage** bo'limiga o'ting va quyidagi bucketlar ochilganligini tekshiring:
- ✅ `avatar` - Foydalanuvchi avatar rasmlari
- ✅ `bookImage` - Kitob muqova rasmlari  
- ✅ `audios` - Audiobook fayllari

Agar ochilmagan bo'lsa, `004_storage_setup.sql` migratsiyasini ishga tushiring.

### 2. Storage Policies

Migration avtomatik quyidagi policies yaratadi:
- **avatar**: Public read, Authenticated write (faqat o'z avatarini)
- **bookImage**: Public read, Admin-only write
- **audios**: Public read, Admin-only write

### 3. Fayl yuklash

```javascript
import { uploadAvatar, uploadBookImage, uploadAudio } from './lib/storage';

// Avatar yuklash
const { url } = await uploadAvatar(file, userId);

// Kitob muqovasi yuklash
const { url } = await uploadBookImage(file, bookId);

// Audio yuklash
const { url } = await uploadAudio(file, bookId, chapterNumber);
```

---

## 💡 Pro Tips

1. **RLS Policies**: Production'da RLS policies albatta yoqilgan bo'lishi kerak
2. **API Keys**: `anon` key'ni frontend'da ishlatish xavfsiz
3. **service_role** key'ni HECH QACHON frontend'da ishlatmang!
4. **Backup**: Supabase har kuni automatic backup qiladi (Pro plan)
5. **Storage**: Har bir bucket uchun alohida policies sozlang

Muammoga duch kelsangiz, `supabase/README.md` faylini o'qing!
