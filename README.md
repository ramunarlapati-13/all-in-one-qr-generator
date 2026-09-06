# AIO REXPO QR | All in one QR Generator

A professional, high-performance web application to create, customize, and share all-in-one QR codes and bio-links.

## 🚀 Recent Improvements & Fixes

We've recently upgraded the application to ensure better performance, SEO compliance, and monetization readiness.

### 💰 Monetization & SEO (AdSense Ready)
- **Targeted Ad Placement**: Integrated Google AdSense via a custom `AdSenseScript` component that only injects ads on content-rich pages (Home, About, Privacy, Terms).
- **Policy Compliance**: Specifically excluded ads from user-generated `PreviewPage` ("Bio Link" pages) to strictly adhere to AdSense "valuable inventory" policies.
- **Enhanced Publisher Content**: creating a "publisher-first" landing page with deep-dive content on QR technology, security protocols, and use cases to improve SEO and crawler visibility.
- **Crawler Optimization**: Removed lazy loading from the main landing content to ensure immediate indexing by search engines.

### ⚡ Performance & Optimization
- **Code Splitting**: Utilized React Lazy and Suspense for heavy components like `AdminPage` and `LoginPage`.
- **Improved UX**: Added premium loading fallbacks and localized spinners for a smoother navigation experience.

### 🛠️ Key Fixes & Features
- **New Static Pages**: Added dedicated **About**, **Terms of Service**, and **Privacy Policy** pages to meet legal and platform requirements.
- **Persistent Cloud Profiles**: Profiles are now stored in **Firebase Firestore**. This eliminates "URL too long" errors and allows for reliable sharing via clean, short links (`/p?id=USER_ID`).
- **Stable Auto-Save**: Implemented an "initial load lock" to prevent default data from overwriting existing cloud profiles during login/logout transitions.
- **SPA Routing Fix**: Added `vercel.json` with rewrite rules to prevent 404 errors when direct-linking to sub-pages like `/p`.

## 📂 Project Structure

```bash
src/
├── assets/             # Static assets (images, icons)
├── components/         # Reusable UI components
│   ├── AdminPage.tsx   # Admin dashboard
│   ├── BioPage.tsx     # The actual "Link in Bio" profile view
│   ├── LandingContent.tsx # SEO-rich homepage content
│   ├── LoginPage.tsx   # Authentication modal
│   └── AdSenseScript.tsx # Context-aware AdSense injector
├── pages/              # Route-specific pages
│   ├── About.tsx
│   ├── PrivacyPolicy.tsx
│   └── TermsOfService.tsx
├── App.tsx             # Main application logic & state
├── main.tsx            # Entry point & Routing configuration
├── firebase.ts         # Firebase initialization
└── index.css           # Global Tailwind CSS styles
```

## 🧰 Tech Stack
- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, Framer Motion
- **Icons**: Lucide React
- **Backend / DB**: Firebase (Auth, Firestore, Realtime Database)
- **Deployment**: Vercel

## 🏗️ Getting Started

### Prerequisites
- Node.js (v18+)
- Firebase Account & Project setup

### Installation
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Setup environment variables:
   ```bash
   cp .env.example .env
   ```
   Fill in your Firebase project credentials in `.env`.
4. Run locally:
   ```bash
   npm run dev
   ```

## 📄 License
Developed by **Rexplore Technologies** © 2026
