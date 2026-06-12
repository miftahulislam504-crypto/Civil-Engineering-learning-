# Enginex Learn 🏗️

> বাংলার সেরা Professional Civil Engineering Learning & Knowledge Platform

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

---

## 🚀 Tech Stack

- **Frontend:** React 18 + Vite + TypeScript
- **Styling:** Tailwind CSS + shadcn/ui
- **State:** Zustand + TanStack Query
- **Backend:** Firebase (Auth + Firestore + Storage)
- **Deployment:** Vercel + GitHub Actions

---

## 📁 Project Structure

```
src/
├── components/       # Reusable components
│   ├── layout/       # Navbar, Sidebar, Layouts
│   ├── auth/         # ProtectedRoute
│   └── common/       # PageLoader, etc.
├── pages/            # Route pages
│   ├── home/
│   ├── auth/
│   └── dashboard/
├── stores/           # Zustand stores
├── hooks/            # Custom hooks
├── services/         # Firebase services
├── types/            # TypeScript types
├── utils/            # Helper functions
└── config/           # Firebase config
```

---

## ⚙️ Local Setup

```bash
# 1. Clone করো
git clone https://github.com/yourusername/enginex-learn.git
cd enginex-learn

# 2. Dependencies install করো
npm install

# 3. Environment variables সেট করো
cp .env.example .env.local
# .env.local-এ Firebase config দাও

# 4. Dev server চালাও
npm run dev
```

---

## 🔥 Firebase Setup

1. [firebase.google.com](https://firebase.google.com) → New Project
2. Authentication → Enable Email/Password + Google
3. Firestore → Create Database (asia-south1, test mode)
4. Storage → Get Started (asia-south1)
5. Project Settings → Web App → Config কপি করো `.env.local`-এ

---

## 🌐 Vercel Deployment

GitHub Secrets-এ যোগ করো:
```
VITE_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID
VERCEL_TOKEN
VERCEL_ORG_ID
VERCEL_PROJECT_ID
```

---

## 📋 Sprint Progress

- [x] Sprint 1 — Project Setup + Auth + Layout
- [ ] Sprint 2 — User Dashboard & Profile
- [ ] Sprint 3 — Learning Center (Courses)
- [ ] Sprint 4 — Civil Encyclopedia ⭐
- [ ] Sprint 5 — Engineering Library
- [ ] Sprint 6 — Quiz & Exam System
- [ ] Sprint 7 — Design Lab + Calculators
- [ ] Sprint 8 — Construction Hub
- [ ] Sprint 9 — Software Hub
- [ ] Sprint 10 — AI Tutor
- [ ] Sprint 11 — Research Hub
- [ ] Sprint 12 — Career Center
- [ ] Sprint 13 — Certificate System
- [ ] Sprint 14 — Ecosystem Integration

---

© 2025 Enginex Learn
