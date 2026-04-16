import { useState, useEffect } from "react";
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
} from "lucide-react";
import { cn } from "@/src/lib/utils";

// Import Components
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import Home from "./pages/Home";

export default function App() {
  return (
    <div className="min-h-screen bg-brand-dark selection:bg-brand-orange selection:text-white">
      <Header />
      <Home />
      <Footer />
    </div>
  );
}
