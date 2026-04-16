export function Footer() {
  return (
    <footer className="py-12 px-6 border-t border-white/5 bg-brand-dark">
      <div className="max-w-7xl mx-auto text-center">
        <p className="text-white/20 text-[10px] uppercase tracking-[0.5em] font-bold">
          &copy; {new Date().getFullYear()} Sabbir Hossen. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}
