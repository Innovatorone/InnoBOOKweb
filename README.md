# BookBites - Kitob O'qish Platformasi

Zamonaviy kitob o'qish va boshqarish platformasi. React, Vite va Supabase asosida qurilgan.

## 🚀 Deploy qilish

### Vercel'ga deploy qilish

1. **GitHub'ga push qiling**
   ```bash
   git add .
   git commit -m "Ready for Vercel deployment"
   git push origin main
   ```

2. **Vercel'ga import qiling**
   - [vercel.com](https://vercel.com) saytiga kiring
   - "Add New Project" tugmasini bosing
   - GitHub repository'ni tanlang
   - Framework Preset: **Vite** (avtomatik aniqlaydi)

3. **Environment Variables sozlang**
   
   Vercel dashboard'da quyidagi environment o'zgaruvchilarni qo'shing:
   
   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

4. **Deploy tugmasini bosing**

## 💻 Local Development

1. Install dependencies:
```bash
npm install
```

### Running the Application

Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

## 📦 Environment Variables

`.env.local.example` faylidan `.env.local` yarating va quyidagilarni to'ldiring:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## 🗄️ Database Setup

1. Supabase loyiha yarating: [supabase.com](https://supabase.com)
2. SQL Editor'da `supabase/migrations/` papkasidagi fayllarni tartib bilan ishga tushiring:
   - `001_initial_schema.sql` - Asosiy jadvallar
   - `002_sample_data.sql` - Namuna ma'lumotlar
   - `003_rls_policies.sql` - Row Level Security
   - `004_functions.sql` - Database funksiyalar
   - `005_simple_auth.sql` - Phone authentication
   - `006_reviews_mock_data.sql` - Sharhlar (ixtiyoriy)

## 🎯 Xususiyatlar

- ✅ Phone raqam bilan autentifikatsiya
- ✅ SMS verifikatsiya (Eskiz.uz tayyor)
- ✅ Kitoblar katalogi (premium/free)
- ✅ Audio kitoblar
- ✅ Sharhlar va baholash tizimi
- ✅ Admin panel (kitoblar boshqaruvi)
- ✅ File upload (rasm, audio, kitob)
- ✅ O'qish jadvali (zamonaviy calendar)
- ✅ Do'stlar tarmog'i

## 🔐 Demo Accounts

```
Phone: +998901234567
Password: demo123
Role: User

Phone: +998901234568
Password: demo123
Role: Admin
```

## 📱 Technologies

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Icon library
- **Supabase** - Backend & Database (PostgreSQL)
- **Supabase Storage** - File storage
- **Vercel** - Deployment platform

## 📁 Project Structure

```
src/
├── components/        # Reusable UI components
│   ├── Sidebar.jsx
│   ├── Header.jsx
│   ├── BookCard.jsx
│   └── ...
├── pages/            # Page components
│   ├── HomePage.jsx
│   ├── BookDetail.jsx
│   ├── SignUpPage.jsx
│   ├── AdminBooksPage.jsx
│   └── ...
├── services/         # API services
│   ├── api.js       # Supabase API calls
│   └── sms.js       # SMS verification
├── lib/             # Utilities
│   ├── supabase.js  # Supabase client
│   └── storage.js   # File upload helpers
├── context/         # React Context
│   ├── AuthContext.jsx
│   └── BooksContext.jsx
└── data/            # Mock data (fallback)
    └── mockData.js

supabase/
└── migrations/      # Database migrations
    ├── 001_initial_schema.sql
    ├── 002_sample_data.sql
    ├── 003_rls_policies.sql
    ├── 004_functions.sql
    ├── 005_simple_auth.sql
    └── 006_reviews_mock_data.sql
```

## 🚀 Vercel Deploy Checklist

- [x] `vercel.json` fayli yaratilgan
- [x] `.gitignore` da `.env.local` bor
- [x] `package.json` da build script bor
- [ ] GitHub'ga push qilish
- [ ] Vercel'da environment variables sozlash
- [ ] Supabase ma'lumotlarini kiritish
- [ ] Deploy tugmasini bosish

## 📄 License

MIT
