# Vercel'ga Deploy Qilish Bo'yicha Qo'llanma

## 1-qadam: GitHub Repository yaratish

```bash
# Loyihani Git'ga qo'shish (agar qo'shilmagan bo'lsa)
git init
git add .
git commit -m "Initial commit - BookBites platform ready for deployment"

# GitHub'da yangi repository yarating va qo'shing
git remote add origin https://github.com/your-username/bookbites.git
git branch -M main
git push -u origin main
```

## 2-qadam: Supabase Setup

### Database yaratish

1. [supabase.com](https://supabase.com) ga boring
2. "New Project" tugmasini bosing
3. Project nomi va parolni kiriting
4. Region tanlang (eng yaqinini)

### Migratsiyalarni ishga tushirish

Supabase Dashboard → SQL Editor'da quyidagi fayllarni **tartib bilan** ishga tushiring:

1. `001_initial_schema.sql` - Asosiy jadvallar
2. `002_sample_data.sql` - Namuna kitoblar
3. `003_rls_policies.sql` - Xavfsizlik
4. `004_functions.sql` - Funksiyalar
5. `005_simple_auth.sql` - Autentifikatsiya
6. `006_reviews_mock_data.sql` - Sharhlar (ixtiyoriy)

### Storage Buckets yaratish

Supabase Dashboard → Storage:

1. **avatar** bucket yarating (public)
2. **bookImage** bucket yarating (public)
3. **audios** bucket yarating (public)
4. **books** bucket yarating (public)

Har birini yaratgandan keyin "Make public" tugmasini bosing.

### API Keys olish

Supabase Dashboard → Settings → API:

- `Project URL` ni nusxalang
- `anon` `public` key ni nusxalang

## 3-qadam: Vercel'ga Deploy

### Vercel Account

1. [vercel.com](https://vercel.com) ga boring
2. "Sign Up" → GitHub bilan ro'yxatdan o'ting

### Import Project

1. Vercel Dashboard'da "Add New..." → "Project"
2. GitHub repository'ni import qiling
3. "Import" tugmasini bosing

### Environment Variables

"Configure Project" sahifasida:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key-here
```

**MUHIM:** 
- Environment variable nomlari AYNAN `VITE_` bilan boshlanishi kerak
- Supabase URL va Key'ni to'g'ri nusxalang

### Deploy Settings

Vercel avtomatik aniqlaydi, lekin tekshiring:

- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### Deploy

"Deploy" tugmasini bosing va kuting (2-3 daqiqa).

## 4-qadam: Post-Deployment

### Domain

Vercel sizga avtomatik domain beradi:
```
https://your-project.vercel.app
```

Custom domain qo'shish:
1. Project Settings → Domains
2. Add Domain
3. DNS sozlamalarini yangilang

### Testing

Deploy'dan keyin test qiling:

1. Asosiy sahifa ochilishini tekshiring
2. Login qiling: `+998901234567` / `demo123`
3. Kitoblar ko'rinishini tekshiring
4. Rasm va fayllar yuklanishini tekshiring
5. Admin panel: `+998901234568` / `demo123`

### Monitoring

Vercel Dashboard → Project → Analytics:
- Traffic ko'rish
- Performance monitoring
- Error tracking

## 5-qadam: Update qilish

Yangilanishlarni deploy qilish juda oson:

```bash
git add .
git commit -m "Update: add new features"
git push origin main
```

Vercel avtomatik qayta deploy qiladi!

## Troubleshooting

### Environment Variables ishlamayapti

1. Vercel Dashboard → Settings → Environment Variables
2. Variable'larni qayta kiriting
3. "Redeploy" tugmasini bosing

### Build fails

1. Vercel Dashboard → Deployments → Failed deployment
2. Loglarni o'qing
3. Xatoni local'da test qiling: `npm run build`

### Supabase connection error

1. Supabase URL to'g'ri ekanini tekshiring
2. Anon key to'g'ri nusxalangan ekanini tekshiring
3. Supabase loyiha aktiv ekanini tekshiring

### Images ko'rinmayapti

1. Supabase Storage buckets public ekanini tekshiring
2. RLS policies to'g'ri sozlangan ekanini tekshiring
3. Browser console'da xatolarni ko'ring

## Environment Variables Checklist

- [ ] `VITE_SUPABASE_URL` - Supabase project URL
- [ ] `VITE_SUPABASE_ANON_KEY` - Supabase anon/public key
- [ ] Vercel'da o'rnatilgan
- [ ] Production, Preview, Development uchun sozlangan

## Supabase Checklist

- [ ] Project yaratilgan
- [ ] Barcha migratsiyalar ishga tushirilgan
- [ ] Storage buckets yaratilgan va public qilingan
- [ ] API keys olingan
- [ ] RLS policies yoqilgan

## Vercel Checklist

- [ ] GitHub bilan ulangan
- [ ] Repository import qilingan
- [ ] Environment variables sozlangan
- [ ] Birinchi deploy muvaffaqiyatli
- [ ] Domain ishlayapti
- [ ] SSL certificate aktiv (avtomatik)

## Keyingi Qadamlar

1. Custom domain qo'shish
2. Analytics yoqish
3. SEO optimization
4. Performance monitoring
5. Error tracking sozlash

---

**Yordam kerakmi?**
- Vercel Docs: https://vercel.com/docs
- Supabase Docs: https://supabase.com/docs
- GitHub Issues: Muammolarni bu yerda xabar qiling
