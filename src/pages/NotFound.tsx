import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { Home, ArrowLeft, Ghost } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-brand-dark flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-brand-orange/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-brand-orange/5 blur-[120px] rounded-full pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center relative z-10"
      >
        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="inline-block mb-8"
        >
          <Ghost className="w-24 h-24 text-brand-orange/40 mx-auto" />
        </motion.div>

        <h1 className="text-8xl md:text-[12rem] font-display font-bold tracking-tighter uppercase mb-4 text-white/10 selection:bg-transparent leading-none">
          404
        </h1>
        
        <h2 className="text-3xl md:text-5xl font-display font-bold tracking-tight uppercase mb-6 text-white">
          Page Not Found
        </h2>

        <p className="max-w-md mx-auto text-white/50 text-lg mb-12 font-light leading-relaxed">
          The cinematic experience you're looking for has moved to a different screen or never existed in this timeline.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link 
            to="/" 
            className="w-full sm:w-auto px-8 py-4 bg-brand-orange text-white font-bold uppercase tracking-widest text-xs rounded-full flex items-center justify-center gap-2 hover:scale-105 transition-transform"
          >
            <Home className="w-4 h-4" /> Go to Home
          </Link>
          <button 
            onClick={() => window.history.back()}
            className="w-full sm:w-auto px-8 py-4 border border-white/20 text-white font-bold uppercase tracking-widest text-xs rounded-full hover:bg-white hover:text-black transition-all flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> Go Back
          </button>
        </div>
      </motion.div>

      {/* Decorative Noise / Grain Overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] brightness-100 contrast-150" />
    </div>
  );
}
