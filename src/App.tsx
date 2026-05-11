import { useState, useEffect, lazy, Suspense } from "react";
import { motion, AnimatePresence } from "motion/react";
import emailjs from "@emailjs/browser";
import { 
  Code, 
  Globe, 
  Instagram, 
  Github, 
  Mail, 
  ArrowUpRight, 
  Menu, 
  X,
  ChevronRight,
  Play,
  Compass,
  Youtube,
  Loader2,
} from "lucide-react";
import { cn } from "@/src/lib/utils";

import { Routes, Route, useLocation } from "react-router-dom";

// Import Components
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";

// Lazy load pages for performance
const Home = lazy(() => import("./pages/Home"));
const Admin = lazy(() => import("./pages/Admin"));
const Quran = lazy(() => import("./pages/Quran"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Loading fallback
const PageLoader = () => (
  <div className="min-h-[60vh] flex items-center justify-center">
    <Loader2 className="w-8 h-8 text-brand-orange animate-spin opacity-20" />
  </div>
);

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    // Scroll to top on every route change
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [location.pathname]);

  useEffect(() => {
    // Only run on initial mount
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-brand-dark selection:bg-brand-orange selection:text-white flex flex-col">
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="preloader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: "easeInOut" }}
            className="fixed inset-0 z-[1000] bg-brand-dark flex flex-col items-center justify-center overflow-hidden"
          >
            <div className="relative text-center">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 2, ease: "easeInOut" }}
                className="absolute -top-4 left-0 h-[1px] bg-brand-orange"
              />
              <motion.h1 
                initial={{ opacity: 0, letterSpacing: "1em" }}
                animate={{ opacity: 1, letterSpacing: "0.2em" }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="text-white text-3xl md:text-5xl font-display font-bold uppercase tracking-[0.5em] mb-2"
              >
                SABBIR<span className="text-brand-orange">.</span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 1 }}
                className="text-white/40 text-[10px] uppercase tracking-[1em] font-bold"
              >
                Visionary Developer
              </motion.p>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ delay: 1, duration: 1, ease: "easeInOut" }}
                className="absolute -bottom-4 right-0 h-[1px] bg-brand-orange/40"
              />
            </div>
            {/* Grain Overlay */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] brightness-100 contrast-150" />
          </motion.div>
        ) : null}
      </AnimatePresence>

      <Header />
      
      <main className="flex-grow relative">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/quran" element={<Quran />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}
