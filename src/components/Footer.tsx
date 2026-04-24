import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="py-12 px-6 border-t border-white/5 bg-brand-dark">
      <div className="max-w-7xl mx-auto flex flex-col items-center gap-4">
        <p className="text-white/20 text-[10px] uppercase tracking-[0.5em] font-bold">
          &copy; {new Date().getFullYear()} Sabbir Hossen. All Rights Reserved.
        </p>
        <Link 
          to="/admin" 
          className="text-[10px] text-white/10 hover:text-brand-orange transition-colors uppercase tracking-widest font-bold"
        >
          Admin Dashboard
        </Link>
      </div>
    </footer>
  );
}
