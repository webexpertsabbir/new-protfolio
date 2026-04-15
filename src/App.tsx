import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import emailjs from "@emailjs/browser";
import { 
  Camera, 
  Video, 
  Code, 
  Globe, 
  Instagram, 
  Twitter, 
  Github, 
  Mail, 
  ArrowUpRight, 
  Menu, 
  X,
  ChevronRight,
  Play,
  Tent,
  PenTool,
  Film,
  Compass,
  User,
  Building2,
  ShoppingBag,
  Bug,
  Zap,
  Layout,
  Youtube,
  Monitor,
  Home,
  GraduationCap
} from "lucide-react";
import { cn } from "@/src/lib/utils";

// Import Assets
import bannerImg from "./assets/sabbir-hossen-banner.webp";
import freelancerImg from "./assets/sabbir-hossain-freelancer.webp";
import zooImg from "./assets/chattogram-zoo.webp";
import sitakundaImg from "./assets/sitakunda.webp";
import waterfallImg from "./assets/sohosrodhara-waterfall.webp";
import patuartekImg from "./assets/patuartek-sea-beach.webp";
import coxsBazarImg from "./assets/coxs-bazar.webp";

const NAV_LINKS = [
  { name: "Home", href: "#home" },
  { name: "About", href: "#about" },
  { name: "Expertise", href: "#expertise" },
  { name: "Lifestyle", href: "#lifestyle" },
  { name: "Work", href: "#work" },
  { name: "Contact", href: "#contact" },
];

const SERVICES = [
  {
    title: "Web Design & Development",
    description: "End-to-end website solutions from creative design to high-performance development.",
    icon: Monitor,
    color: "from-cyan-500/20 to-transparent",
  },
  {
    title: "Convert Website",
    description: "Converting Figma designs into pixel-perfect WordPress, React JS, or Next.js websites.",
    icon: Layout,
    color: "from-purple-500/20 to-transparent",
  },
  {
    title: "Portfolio Websites",
    description: "Creating stunning personal portfolios that showcase your work and personality effectively.",
    icon: User,
    color: "from-orange-500/20 to-transparent",
  },
  {
    title: "Business Websites",
    description: "Professional and scalable websites tailored for businesses to establish a strong online presence.",
    icon: Building2,
    color: "from-blue-500/20 to-transparent",
  },
  {
    title: "E-commerce Stores",
    description: "Building robust online stores with seamless user experiences and secure payment integrations.",
    icon: ShoppingBag,
    color: "from-emerald-500/20 to-transparent",
  },
  {
    title: "Real Estate Websites",
    description: "Custom property listing platforms with advanced search and map integrations.",
    icon: Home,
    color: "from-amber-500/20 to-transparent",
  },
  {
    title: "E-learning Platforms",
    description: "Scalable LMS solutions for online courses, student management, and digital learning.",
    icon: GraduationCap,
    color: "from-indigo-500/20 to-transparent",
  },
  {
    title: "Bug Fixing",
    description: "Identifying and resolving technical issues to ensure your website runs smoothly and error-free.",
    icon: Bug,
    color: "from-red-500/20 to-transparent",
  },
  {
    title: "Speed Optimization",
    description: "Optimizing loading times and performance to improve user retention and SEO rankings.",
    icon: Zap,
    color: "from-yellow-500/20 to-transparent",
  },
];

const INTERESTS = [
  { title: "Travel Filmmaking", icon: Film, desc: "Cinematic travel stories" },
  { title: "Vlogging", icon: Video, desc: "Sharing digital insights" },
  { title: "Photography", icon: Camera, desc: "Capturing the world" },
  { title: "Cinematography", icon: Video, desc: "Visual art in motion" },
  { title: "Solo Camping", icon: Tent, desc: "Finding peace in nature" },
];

const PROJECTS = [
  {
    title: "Corporate Business Portal",
    category: "WordPress",
    image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&q=80&w=800&h=1600",
    link: "#",
  },
  {
    title: "Fashion Hub Store",
    category: "WordPress WooCommerce",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=800&h=1600",
    link: "#",
  },
  {
    title: "SaaS Dashboard",
    category: "React JS",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800&h=1600",
    link: "#",
  },
  {
    title: "Creative Agency Site",
    category: "Next JS",
    image: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=800&h=1600",
    link: "#",
  },
  {
    title: "Tech Blog Platform",
    category: "WordPress",
    image: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&q=80&w=800&h=1600",
    link: "#",
  },
  {
    title: "Gadget Shop",
    category: "WordPress WooCommerce",
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=800&h=1600",
    link: "#",
  },
];

export default function App() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("All");
  const [selectedProject, setSelectedProject] = useState<typeof PROJECTS[0] | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: "" });
    
    try {
      // 1. Send Email via EmailJS
      const emailParams = {
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
      };

      // Using hardcoded IDs to ensure reliability in this environment
      await emailjs.send(
        "service_76fwtld",
        "template_5hjl8sg",
        emailParams,
        "8cuzuhLX4FAUmIj1T"
      );

      setSubmitStatus({
        type: "success",
        message: "আপনার মেসেজটি সফলভাবে পাঠানো হয়েছে এবং ইমেইল করা হয়েছে! আমি শীঘ্রই আপনার সাথে যোগাযোগ করব।"
      });
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmitStatus({
        type: "error",
        message: "দুঃখিত, মেসেজটি পাঠানো সম্ভব হয়নি। দয়া করে আপনার ইন্টারনেট কানেকশন চেক করুন অথবা সরাসরি ইমেইল করুন।"
      });
    } finally {
      setIsSubmitting(false);
      // Clear status after 5 seconds
      setTimeout(() => setSubmitStatus({ type: null, message: "" }), 5000);
    }
  };

  const filteredProjects = activeTab === "All" 
    ? PROJECTS 
    : PROJECTS.filter(p => p.category === activeTab);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-brand-dark selection:bg-brand-orange selection:text-white">
      {/* Navigation */}
      <nav 
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4",
          isScrolled ? "bg-brand-dark/80 backdrop-blur-md border-b border-white/10" : "bg-transparent"
        )}
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <a href="#home" className="text-2xl font-display font-bold tracking-tighter">
            SABBIR<span className="text-brand-orange">.</span>
          </a>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <a 
                key={link.name} 
                href={link.href}
                className="text-sm font-medium text-white/70 hover:text-white transition-colors uppercase tracking-widest"
              >
                {link.name}
              </a>
            ))}
            <a 
              href="#contact" 
              className="px-5 py-2 bg-white text-black text-xs font-bold uppercase tracking-widest rounded-full hover:bg-brand-orange hover:text-white transition-all"
            >
              Hire Me
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
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-brand-dark flex flex-col items-center justify-center gap-8 md:hidden"
          >
            {NAV_LINKS.map((link) => (
              <a 
                key={link.name} 
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-3xl font-display font-bold uppercase tracking-tighter"
              >
                {link.name}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Video/Image Placeholder */}
        <div className="absolute inset-0 z-0">
          <motion.img 
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 10, repeat: Infinity, repeatType: "reverse", ease: "linear" }}
            src={bannerImg} 
            alt="Cinematic Background"
            className="w-full h-full object-cover opacity-50"
          />
          {/* Noise Overlay */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] brightness-100 contrast-150" />
          
          {/* Multi-layered Gradients for Depth */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-brand-dark" />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-dark/40 via-transparent to-brand-dark/40" />
          
          {/* Subtle Vignette */}
          <div className="absolute inset-0 shadow-[inset_0_0_150px_rgba(0,0,0,0.6)]" />
          
          {/* Brand Glow / Light Leak */}
          <div className="absolute -bottom-[10%] -right-[5%] w-[40%] h-[40%] bg-brand-orange/5 blur-[100px] rounded-full pointer-events-none" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-4 py-1 mb-6 border border-white/20 rounded-full text-[10px] uppercase tracking-[0.3em] font-bold text-white/60">
              Web Developer • Freelancer • Travel Filmmaker
            </span>
            <h1 className="text-[15vw] md:text-[12vw] leading-[0.85] font-display font-bold tracking-tighter uppercase mb-8">
              SABBIR <br />
              <span className="outline-text">HOSSEN</span>
            </h1>
            <p className="max-w-2xl mx-auto text-lg md:text-xl text-white/60 font-light leading-relaxed mb-10">
              Full-stack developer and visual storyteller. Crafting high-performance 
              web experiences and cinematic narratives since 2022.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a 
                href="#work" 
                className="group px-8 py-4 bg-brand-orange text-white font-bold uppercase tracking-widest text-xs rounded-full flex items-center gap-2 hover:scale-105 transition-transform"
              >
                View Portfolio <ArrowUpRight className="w-4 h-4" />
              </a>
              <a 
                href="#contact" 
                className="px-8 py-4 border border-white/20 text-white font-bold uppercase tracking-widest text-xs rounded-full hover:bg-white hover:text-black transition-all"
              >
                Let's Talk
              </a>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40"
        >
          <div className="w-[1px] h-12 bg-white" />
          <span className="text-[10px] uppercase tracking-widest font-bold">Scroll</span>
        </motion.div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-[1fr_1.5fr] gap-16 items-center">
          <div className="relative aspect-[4/5] rounded-2xl overflow-hidden group">
            <img 
              src={freelancerImg} 
              alt="Sabbir Hossen"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-brand-orange/10 mix-blend-overlay" />
          </div>
          
          <div>
            <span className="text-brand-orange font-bold uppercase tracking-widest text-xs mb-4 block">The Freelancer</span>
            <h2 className="text-5xl md:text-7xl font-display font-bold tracking-tighter uppercase mb-8">
              Code meets <br />
              <span className="italic font-serif font-normal lowercase opacity-60">cinematic</span> vision.
            </h2>
            <div className="space-y-6 text-white/60 text-lg leading-relaxed">
              <p>
                I am Sabbir Hossen, a professional freelancer and web developer specializing in WordPress, React JS, and Next.js. 
                Since 2022, I have been actively working in global marketplaces, helping brands build robust digital identities.
              </p>
              <p>
                Beyond the screen, I am a passionate travel filmmaker and cinematographer. My life is a blend of 
                technical precision and creative exploration—whether I'm debugging a complex React application 
                 or documenting a solo camping trip in the wilderness.
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-8 mt-12">
              <div>
                <h4 className="text-white font-bold text-3xl mb-1">2022</h4>
                <p className="text-white/40 text-xs uppercase tracking-widest">Started Freelancing</p>
              </div>
              <div>
                <h4 className="text-white font-bold text-3xl mb-1">Marketplace</h4>
                <p className="text-white/40 text-xs uppercase tracking-widest">Active Presence</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Expertise Section */}
      <section id="expertise" className="py-24 px-6 bg-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-brand-orange font-bold uppercase tracking-widest text-xs mb-4 block">Core Skills</span>
            <h2 className="text-4xl md:text-6xl font-display font-bold tracking-tighter uppercase">Expertise</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {SERVICES.map((service, idx) => (
              <motion.div 
                key={service.title}
                whileHover={{ y: -10 }}
                className="p-8 rounded-3xl border border-white/10 glass-card relative overflow-hidden group transition-all"
              >
                <div className={cn("absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500", service.color)} />
                <service.icon className="w-12 h-12 text-brand-orange mb-6 relative z-10" />
                <h3 className="text-2xl font-display font-bold uppercase mb-4 relative z-10">{service.title}</h3>
                <p className="text-white/60 leading-relaxed relative z-10">{service.description}</p>
                <div className="mt-8 relative z-10">
                  <button className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest group-hover:text-brand-orange transition-colors">
                    View Projects <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Lifestyle/Interests Section */}
      <section id="lifestyle" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-16">
            <div className="flex-1">
              <span className="text-brand-orange font-bold uppercase tracking-widest text-xs mb-4 block">Beyond Code</span>
              <h2 className="text-4xl md:text-6xl font-display font-bold tracking-tighter uppercase mb-8">Lifestyle & <br />Interests</h2>
              <p className="text-white/60 text-lg leading-relaxed mb-10">
                When I'm not coding, you'll find me exploring the world through a lens or finding solitude in nature. 
                My interests fuel my creativity and provide a unique perspective to my professional work.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {INTERESTS.map((interest) => (
                  <div key={interest.title} className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-brand-orange transition-colors">
                    <div className="w-10 h-10 rounded-full bg-brand-orange/10 flex items-center justify-center">
                      <interest.icon className="w-5 h-5 text-brand-orange" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold uppercase tracking-widest">{interest.title}</h4>
                      <p className="text-[10px] text-white/40 uppercase tracking-widest">{interest.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex-1 relative">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <img src={zooImg} alt="Chattogram Zoo" className="rounded-2xl aspect-[3/4] object-cover" />
                  <img src={sitakundaImg} alt="Sitakunda Sabbir Hossen" className="rounded-2xl aspect-square object-cover" />
                </div>
                <div className="space-y-4 pt-8">
                  <img src={waterfallImg} alt="Sohosrodhara Waterfall Sabbir Hossen" className="rounded-2xl aspect-square object-cover" />
                  <img src={patuartekImg} alt="patuartek sea beach cox's bazar Sabbir hossen" className="rounded-2xl aspect-[3/4] object-cover" />
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-brand-orange rounded-full flex items-center justify-center animate-pulse">
                <Compass className="w-12 h-12 text-white" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section id="work" className="py-24 px-6 bg-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
            <div>
              <span className="text-brand-orange font-bold uppercase tracking-widest text-xs mb-4 block">Selected Works</span>
              <h2 className="text-4xl md:text-6xl font-display font-bold tracking-tighter uppercase">Portfolio</h2>
            </div>
            <div className="flex flex-wrap gap-3">
              {["All", "WordPress", "WordPress WooCommerce", "React JS", "Next JS"].map((tab) => (
                <button 
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    "px-6 py-2 rounded-full border text-xs font-bold uppercase tracking-widest transition-all",
                    activeTab === tab 
                      ? "bg-brand-orange border-brand-orange text-white" 
                      : "border-white/10 hover:bg-white hover:text-black"
                  )}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project, idx) => (
                <motion.div 
                  key={project.title}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4 }}
                  onClick={() => setSelectedProject(project)}
                  className="group relative aspect-[3/4] rounded-3xl overflow-hidden cursor-pointer bg-brand-dark/50"
                >
                  <div className="w-full h-full overflow-hidden">
                    <img 
                      src={project.image} 
                      alt={project.title}
                      className="w-full h-full object-cover object-top transition-all duration-[5000ms] ease-in-out group-hover:object-bottom"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6">
                    <span className="text-brand-orange text-[10px] font-bold uppercase tracking-widest mb-2">{project.category}</span>
                    <h3 className="text-2xl font-display font-bold uppercase tracking-tighter mb-4">{project.title}</h3>
                    <div className="flex items-center gap-4">
                      <button className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center hover:bg-brand-orange hover:text-white transition-colors">
                        <Play className="w-4 h-4 fill-current" />
                      </button>
                      <span className="text-[10px] font-bold uppercase tracking-widest">View Details</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          
          <div className="mt-16 text-center">
            <button className="px-12 py-5 border border-white/10 rounded-full text-xs font-bold uppercase tracking-[0.3em] hover:bg-white hover:text-black transition-all">
              Explore All Projects
            </button>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 px-6 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16">
          <div>
            <h2 className="text-6xl md:text-8xl font-display font-bold tracking-tighter uppercase mb-8">
              Let's <br />
              <span className="text-brand-orange">Create</span>
            </h2>
            <p className="text-white/60 text-xl font-light leading-relaxed mb-12">
              Have a project in mind? Whether it's a cinematic film or a complex web application, 
              I'm ready to bring your vision to life.
            </p>
            
            <div className="space-y-6">
              <a href="mailto:swufwebpro@gmail.com" className="flex items-center gap-4 group">
                <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center group-hover:border-brand-orange transition-colors">
                  <Mail className="w-5 h-5 text-brand-orange" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Email Me</p>
                  <p className="text-lg font-medium">swufwebpro@gmail.com</p>
                </div>
              </a>
              <div className="flex items-center gap-4 group">
                <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center group-hover:border-brand-orange transition-colors">
                  <Globe className="w-5 h-5 text-brand-orange" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Location</p>
                  <p className="text-lg font-medium">Dhaka, Bangladesh</p>
                </div>
              </div>
            </div>

            <div className="flex gap-4 mt-12">
              {[
                { Icon: Instagram, href: "#" },
                { Icon: Youtube, href: "#" },
                { Icon: Github, href: "#" }
              ].map((social, i) => (
                <a 
                  key={i} 
                  href={social.href} 
                  className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-all group"
                >
                  <social.Icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </a>
              ))}
            </div>
          </div>

          <div className="glass-card p-10 rounded-3xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-white/40">Name</label>
                  <input 
                    type="text" 
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-brand-orange transition-colors" 
                    placeholder="Name" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-white/40">Email</label>
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-brand-orange transition-colors" 
                    placeholder="Email" 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-white/40">Subject</label>
                <input 
                  type="text" 
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-brand-orange transition-colors" 
                  placeholder="Project Inquiry" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-white/40">Message</label>
                <textarea 
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={4} 
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-brand-orange transition-colors" 
                  placeholder="Tell me about your project..."
                ></textarea>
              </div>
              
              {submitStatus.type && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    "p-4 rounded-xl text-sm font-medium",
                    submitStatus.type === "success" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-red-500/10 text-red-400 border border-red-500/20"
                  )}
                >
                  {submitStatus.message}
                </motion.div>
              )}

              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-brand-orange text-white font-bold uppercase tracking-[0.3em] text-xs rounded-xl hover:scale-[1.02] transition-transform disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Send Message"
                )}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/5 bg-brand-dark">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-white/20 text-[10px] uppercase tracking-[0.5em] font-bold">
            &copy; {new Date().getFullYear()} Sabbir Hossen. All Rights Reserved.
          </p>
        </div>
      </footer>

      {/* Project Modal */}
      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProject(null)}
              className="absolute inset-0 bg-brand-dark/95 backdrop-blur-xl"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-4xl bg-white/5 border border-white/10 rounded-3xl overflow-hidden glass-card"
            >
              <button 
                onClick={() => setSelectedProject(null)}
                className="absolute top-6 right-6 z-10 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand-orange transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="grid md:grid-cols-2">
                <div className="h-[400px] md:h-[600px] overflow-hidden group/modal">
                  <img 
                    src={selectedProject.image} 
                    alt={selectedProject.title}
                    className="w-full h-full object-cover object-top transition-all duration-[8000ms] ease-in-out hover:object-bottom"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="p-8 md:p-12 flex flex-col justify-center">
                  <span className="text-brand-orange font-bold uppercase tracking-widest text-xs mb-4 block">
                    {selectedProject.category}
                  </span>
                  <h3 className="text-4xl md:text-5xl font-display font-bold tracking-tighter uppercase mb-6">
                    {selectedProject.title}
                  </h3>
                  <p className="text-white/60 text-lg leading-relaxed mb-8">
                    A high-performance digital solution built with precision and modern technologies. 
                    This project showcases expertise in {selectedProject.category} and focuses on 
                    delivering a seamless user experience.
                  </p>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 text-sm">
                      <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                        <Code className="w-4 h-4 text-brand-orange" />
                      </div>
                      <span className="text-white/40">Technologies:</span>
                      <span className="font-bold uppercase tracking-widest text-[10px]">{selectedProject.category}</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                        <Globe className="w-4 h-4 text-brand-orange" />
                      </div>
                      <span className="text-white/40">Status:</span>
                      <span className="font-bold uppercase tracking-widest text-[10px]">Live Project</span>
                    </div>
                  </div>
                  <div className="mt-10 flex gap-4">
                    <a 
                      href={selectedProject.link}
                      className="flex-1 py-4 bg-brand-orange text-white text-center font-bold uppercase tracking-widest text-xs rounded-xl hover:scale-105 transition-transform"
                    >
                      Visit Website
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style>{`
        .outline-text {
          -webkit-text-stroke: 1.5px rgba(255,255,255,0.7);
          color: rgba(255,255,255,0.05);
          text-shadow: 0 0 40px rgba(0,0,0,0.5);
        }
      `}</style>
    </div>
  );
}
