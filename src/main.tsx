import { StrictMode, lazy, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'

// Lazy load components for performance optimization
const App = lazy(() => import('./App.tsx'));
const PreviewPage = lazy(() => import('./PreviewPage.tsx'));

const LoadingFallback = () => (
  <div className="min-h-[100dvh] bg-[#0a050c] flex items-center justify-center">
    <div className="relative">
      <div className="w-16 h-16 border-4 border-[#ce2bee]/20 border-t-[#ce2bee] rounded-full animate-spin" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-8 h-8 bg-[#ce2bee]/10 rounded-full animate-pulse blur-sm" />
      </div>
    </div>
  </div>
);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/p" element={<PreviewPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  </StrictMode>,
)
