# AIO REXPO QR | All in one QR Generator

A professional, high-performance web application to create, customize, and share all-in-one QR codes and bio-links.

## 🚀 Recent Improvements & Fixes

We've recently upgraded the application to ensure better performance and a more stable experience for our users.

### ⚡ Performance & Optimization
- **Code Splitting & Lazy Loading**: Significantly reduced initial bundle size by implementing React Lazy and Suspense. Only the necessary code for a page is loaded when visited.
- **Improved UX**: Added premium loading fallbacks and localized spinners for a smoother navigation experience.

### 🛠️ Key Fixes & Features
- **Persistent Cloud Profiles**: Profiles are now stored in **Firebase Firestore**. This eliminates "URL too long" errors and allows for reliable sharing via clean, short links (`/p?id=USER_ID`).
- **Stable Auto-Save**: Implemented an "initial load lock" to prevent default data from overwriting existing cloud profiles during login/logout transitions.
- **SPA Routing Fix**: Added `vercel.json` with rewrite rules to prevent 404 errors when direct-linking to sub-pages like `/p`.
- **Bio-Link QR Integration**: Personal profiles now feature a built-in, theme-matched QR code for easy scanning and sharing on any device.

## 🧰 Tech Stack
- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, Framer Motion
- **Icons**: Lucide React, Phosphor Icons
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
3. Setup `.env` (ensure Firebase config is in `src/firebase.ts`)
4. Run locally:
   ```bash
   npm run dev
   ```

## 📄 License
Developed by **Rexplore Technologies** © 2026
