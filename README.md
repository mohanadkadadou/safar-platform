# Safar سفر — دليل النشر الكامل

---

## الخطوة ١ — تثبيت المتطلبات

```bash
npm install @supabase/supabase-js @supabase/ssr
```

---

## الخطوة ٢ — إعداد ملف البيئة

الملف `.env.local` موجود بالفعل مع keys مشروعك:

```env
NEXT_PUBLIC_SUPABASE_URL=https://bxhifemvicapfffthilm.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_SQAyvNETNLWYGOc1yYu6uw_yGMlAAeR
ADMIN_PASSWORD=admin123
SUPABASE_SERVICE_ROLE_KEY=← اضف هذا من Supabase → Settings → API → service_role
```

> **مهم:** الـ service_role key يخليك تقدر تنشر وتحذف فعاليات من الداش بورد.
> روح: supabase.com → مشروعك → Settings → API → انسخ service_role secret

---

## الخطوة ٣ — تشغيل Schema في Supabase

1. روح [supabase.com](https://supabase.com) → مشروعك
2. من القائمة اليسار اختار **SQL Editor**
3. اضغط **New query**
4. افتح ملف `supabase-schema.sql` من المشروع والصق المحتوى كامل
5. اضغط **Run** (أو Ctrl+Enter)
6. المفروض تشوف رسالة نجاح وجدول فيه 3 صفوف (events/registrations/poll_votes)

---

## الخطوة ٤ — تشغيل المشروع محلياً

```bash
# تأكد إنك في مجلد المشروع
cd safar

# ثبّت الباكجات
npm install

# شغّل
npm run dev
```

افتح المتصفح على: **http://localhost:3000**

---

## الخطوة ٥ — النشر على Vercel (اختياري)

```bash
# ثبّت Vercel CLI
npm install -g vercel

# انشر
vercel
```

في dashboard Vercel أضف نفس متغيرات البيئة:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `ADMIN_PASSWORD`

---

## كيف تستخدم الداش بورد

| خطوة | التفصيل |
|------|---------|
| **Login** | اضغط "Admin Login" في الناف بار |
| **Password** | `admin123` (غيّرها في `.env.local`) |
| **New Event** | الداش بورد → New Event → عبئ البيانات |
| **نشر فعالية** | اختار Status = Published عند الإنشاء، **أو** احفظها Draft ثم اضغط Publish |
| **المشاركون** | الداش بورد → Participants → شوف التسجيلات أو صدّر CSV |

---

## هيكل المشروع

```
safar/
├── .env.local                  ← keys مشروعك (لا ترفعه على GitHub)
├── supabase-schema.sql         ← شغّله في Supabase SQL Editor
│
├── utils/supabase/
│   ├── client.ts               ← Supabase browser client
│   ├── server.ts               ← Supabase server client (SSR)
│   └── middleware.ts           ← session refresh
│
├── middleware.ts               ← Next.js middleware
│
├── app/
│   ├── layout.tsx              ← Language + Auth context
│   ├── page.tsx                ← الصفحة الرئيسية (SPA)
│   ├── globals.css
│   └── api/
│       ├── auth/route.ts       ← التحقق من كلمة السر
│       ├── events/route.ts     ← CRUD الفعاليات
│       └── register/route.ts  ← تسجيل المشاركين
│
├── components/
│   ├── Navbar.tsx
│   ├── Hero.tsx
│   ├── EventsGrid.tsx          ← يجيب الفعاليات من Supabase
│   ├── PollSection.tsx         ← تصويت real-time
│   ├── AdminDashboard.tsx      ← لوحة التحكم كاملة
│   ├── EventPage.tsx           ← صفحة الفعالية العامة
│   ├── RegisterFlow.tsx        ← 5 خطوات تسجيل
│   └── ...
│
├── lib/
│   ├── supabase.ts             ← exports للـ clients
│   ├── constants.ts            ← ألوان، poll options، features
│   └── translations.ts        ← ترجمة EN/AR
│
└── types/index.ts              ← TypeScript types
```

---

## استكشاف الأخطاء

**الفعاليات ما تظهر؟**
- تأكد إن status = `published`
- تأكد إن RLS policies تم إنشاؤها في Supabase (شغّل الـ schema مرة ثانية)

**الداش بورد ما يحفظ؟**
- أضف `SUPABASE_SERVICE_ROLE_KEY` في `.env.local`
- الـ service_role key من: Supabase → Settings → API → service_role (اضغط Reveal)

**خطأ 401 عند Login؟**
- تأكد `ADMIN_PASSWORD` في `.env.local` يطابق اللي تكتبه

---

**Project Manager: Mohanad Kadadou**
