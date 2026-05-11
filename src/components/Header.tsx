import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/src/lib/utils";
import { NAV_LINKS } from "../constants/navigation";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 50;
      setIsScrolled((prev) => {
        if (prev !== scrolled) return scrolled;
        return prev;
      });
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <nav 
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4",
          isScrolled ? "bg-brand-dark/80 backdrop-blur-md border-b border-white/10" : "bg-transparent"
        )}
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link to="/" className="text-2xl font-display font-bold tracking-tighter">
            SABBIR<span className="text-brand-orange">.</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              link.name === "Home" || link.name === "Holy Quran" ? (
                <Link 
                  key={link.name} 
                  to={link.name === "Home" ? "/" : link.href}
                  className="text-sm font-medium text-white/70 hover:text-white transition-colors uppercase tracking-widest"
                >
                  {link.name}
                </Link>
              ) : (
                <a 
                  key={link.name} 
                  href={link.href}
                  className="text-sm font-medium text-white/70 hover:text-white transition-colors uppercase tracking-widest"
                >
                  {link.name}
                </a>
              )
            ))}
            <a 
              href="https://wa.me/8801885261824" 
              target="_blank"
              rel="noreferrer"
              className="px-5 py-2 bg-emerald-500 text-white text-xs font-bold uppercase tracking-widest rounded-full hover:bg-emerald-600 transition-all flex items-center gap-2"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              WhatsApp
            </a>
          </div>

          {/* Mobile Toggle */}
          <button 
            className="md:hidden text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[60] bg-brand-dark flex flex-col items-center justify-center gap-8 md:hidden"
          >
            <button 
              className="absolute top-6 right-6 text-white p-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              <X className="w-8 h-8" />
            </button>
            {NAV_LINKS.map((link) => (
              link.name === "Home" || link.name === "Holy Quran" ? (
                <Link 
                  key={link.name} 
                  to={link.name === "Home" ? "/" : link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-4xl font-display font-bold uppercase tracking-tighter hover:text-brand-orange transition-colors"
                >
                  {link.name}
                </Link>
              ) : (
                <a 
                  key={link.name} 
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-4xl font-display font-bold uppercase tracking-tighter hover:text-brand-orange transition-colors"
                >
                  {link.name}
                </a>
              )
            ))}
            <a 
              href="https://wa.me/8801885261824" 
              target="_blank"
              rel="noreferrer"
              onClick={() => setMobileMenuOpen(false)}
              className="mt-4 px-10 py-4 bg-emerald-500 text-white font-bold uppercase tracking-widest text-sm rounded-full flex items-center gap-3"
            >
              <MessageCircle className="w-5 h-5" />
              WhatsApp
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
