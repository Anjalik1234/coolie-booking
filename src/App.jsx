import { lazy, Suspense, useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import LoadingScreen from './components/ui/LoadingScreen';
import './App.css';

// Lazy-load all pages for code splitting
const Home               = lazy(() => import('./pages/Home'));
const Login              = lazy(() => import('./pages/Login'));
const Register           = lazy(() => import('./pages/Register'));
const Dashboard          = lazy(() => import('./pages/Dashboard'));
const BookCoolie         = lazy(() => import('./pages/BookCoolie'));
const CoolieListing      = lazy(() => import('./pages/CoolieListing'));
const BookingConfirmation = lazy(() => import('./pages/BookingConfirmation'));

// AnimatePresence needs location inside Router
function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={null}>
        <Routes location={location} key={location.pathname}>
          <Route path="/"                   element={<Home />} />
          <Route path="/login"              element={<Login />} />
          <Route path="/register"           element={<Register />} />
          <Route path="/dashboard"          element={<Dashboard />} />
          <Route path="/book"               element={<BookCoolie />} />
          <Route path="/coolies"            element={<CoolieListing />} />
          <Route path="/booking-confirmation" element={<BookingConfirmation />} />
        </Routes>
      </Suspense>
    </AnimatePresence>
  );
}

export default function App() {
  const [appLoading, setAppLoading] = useState(true);

  // Simulate initial app load
  useEffect(() => {
    const t = setTimeout(() => setAppLoading(false), 2000);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      <LoadingScreen isVisible={appLoading} />

      <BrowserRouter>
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative' }} className="grain">
          <Navbar />
          <main style={{ flex: 1 }}>
            <AnimatedRoutes />
          </main>
          <Footer />
        </div>
      </BrowserRouter>

      {/* Toast notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#111827',
            color: '#f1f5fd',
            border: '1px solid rgba(249,115,22,0.2)',
            fontFamily: 'DM Sans, sans-serif',
            fontSize: '14px',
          },
          success: { iconTheme: { primary: '#22c55e', secondary: '#111827' } },
          error:   { iconTheme: { primary: '#ef4444', secondary: '#111827' } },
        }}
      />
    </>
  );
}