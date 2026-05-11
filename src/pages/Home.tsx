import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Helmet } from "react-helmet-async";
import { ProjectSkeleton } from "../components/Skeleton";

import { 
  Code, 
  Globe, 
  Instagram, 
  Github, 
  Mail, 
  ArrowUpRight, 
  ChevronRight,
  Play,
  Compass,
  Youtube,
  X,
  ShieldCheck
} from "lucide-react";
import ReCAPTCHA from "react-google-recaptcha";
import { cn } from "@/src/lib/utils";

// Import Constants
import { SERVICES } from "../constants/services";
import { INTERESTS } from "../constants/interests";

// Import Service
import { sendEmail } from "../services/emailService";
import { getProjects, getCategories, Project } from "../services/projectService";

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<string[]>(["All"]);
  const [activeTab, setActiveTab] = useState("All");
  const [visibleCount, setVisibleCount] = useState(6);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [captchaValue, setCaptchaValue] = useState<string | null>(null);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectsData, categoriesData] = await Promise.all([
          getProjects(),
          getCategories()
        ]);
        
        setProjects(projectsData);
        
        if (categoriesData.length > 0) {
          setCategories(["All", ...categoriesData.map(c => c.name)]);
        } else {
          const uniqueCategories = ["All", ...new Set(projectsData.map(p => p.category))];
          setCategories(uniqueCategories);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoadingProjects(false);
      }
    };
    fetchData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const onCaptchaChange = (value: string | null) => {
    setCaptchaValue(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!captchaValue) {
      setSubmitStatus({
        type: "error",
        message: "Please complete the reCAPTCHA to verify you are a human."
      });
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: "" });
    
    try {
      await sendEmail({
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
      });

      setSubmitStatus({
        type: "success",
        message: "Your message has been successfully sent and emailed! I will contact you soon."
      });
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmitStatus({
        type: "error",
        message: "Sorry, the message could not be sent. Please check your internet connection or email us directly."
      });
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSubmitStatus({ type: null, message: "" }), 5000);
    }
  };

  const filteredProjects = useMemo(() => 
    activeTab === "All" 
      ? projects 
      : projects.filter(p => p.category === activeTab),
  [activeTab, projects]);

  const visibleProjects = useMemo(() => 
    filteredProjects.slice(0, visibleCount),
  [filteredProjects, visibleCount]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setVisibleCount(6); // Reset to 6 when tab changes
  };

  const loadMore = () => {
    setVisibleCount(prev => prev + 6);
  };

  return (
    <>
      <Helmet>
        <title>Sabbir Hossen | Web Developer & Visual Storyteller</title>
        <meta name="description" content="Portfolio of Sabbir Hossen - Professional Web Developer specializing in React, Next.js, and WordPress. Travel Filmmaker & Cinematographer." />
        <meta name="keywords" content="Sabbir Hossen, Web Developer, React Developer, WordPress Expert, Filmmaker, Freelancer Bangladesh, Portfolio" />
        <meta property="og:title" content="Sabbir Hossen | Web Developer & Visual Storyteller" />
        <meta property="og:description" content="Crafting high-performance web experiences and cinematic narratives since 2022." />
        <meta property="og:image" content="/sabbir-hossain-freelancer.webp" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>
      <main>
      {/* Hero Section */}
      <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <motion.img 
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 10, repeat: Infinity, repeatType: "reverse", ease: "linear" }}
            src="/sabbir-hossen-banner.webp" 
            alt="Cinematic Background"
            className="w-full h-full object-cover opacity-50"
          />
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] brightness-100 contrast-150" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-brand-dark" />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-dark/40 via-transparent to-brand-dark/40" />
          <div className="absolute inset-0 shadow-[inset_0_0_150px_rgba(0,0,0,0.6)]" />
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
            <h1 className="text-[18vw] sm:text-[15vw] md:text-[12vw] leading-[0.85] font-display font-bold tracking-tighter uppercase mb-8">
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
      <motion.section 
        id="about" 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="py-16 md:py-24 px-6"
      >
        <div className="max-w-7xl mx-auto grid md:grid-cols-[1fr_1.5fr] gap-10 md:gap-16 items-center">
          <div className="relative aspect-[4/5] md:aspect-[4/5] rounded-2xl overflow-hidden group max-w-md mx-auto md:max-w-none w-full">
            <img 
              src="/sabbir-hossain-freelancer.webp" 
              alt="Sabbir Hossen"
              loading="lazy"
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
      </motion.section>

      {/* Expertise Section */}
      <motion.section 
        id="expertise" 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="py-16 md:py-24 px-6 bg-white/5"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <span className="text-brand-orange font-bold uppercase tracking-widest text-xs mb-4 block">Core Skills</span>
            <h2 className="text-4xl md:text-6xl font-display font-bold tracking-tighter uppercase">Expertise</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {SERVICES.map((service) => (
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
      </motion.section>

      {/* Lifestyle/Interests Section */}
      <motion.section 
        id="lifestyle" 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="py-16 md:py-24 px-6"
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-12 md:gap-16">
            <div className="flex-1 w-full">
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
            <div className="flex-1 relative w-full">
              <div className="grid grid-cols-2 gap-2 sm:gap-4">
                <div className="space-y-2 sm:space-y-4">
                  <img src="/chattogram-zoo.webp" alt="Chattogram Zoo" loading="lazy" className="rounded-2xl aspect-[3/4] object-cover" />
                  <img src="/sitakunda.webp" alt="Sitakunda Sabbir Hossen" loading="lazy" className="rounded-2xl aspect-square object-cover" />
                </div>
                <div className="space-y-2 sm:space-y-4 pt-4 sm:pt-8">
                  <img src="/sohosrodhara-waterfall.webp" alt="Sohosrodhara Waterfall Sabbir Hossen" loading="lazy" className="rounded-2xl aspect-square object-cover" />
                  <img src="/patuartek-sea-beach.webp" alt="patuartek sea beach cox's bazar Sabbir hossen" loading="lazy" className="rounded-2xl aspect-[3/4] object-cover" />
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-brand-orange rounded-full flex items-center justify-center animate-pulse">
                <Compass className="w-12 h-12 text-white" />
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Portfolio Section */}
      <section 
        id="work" 
        className="py-16 md:py-24 px-6 bg-white/5"
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 md:mb-16 gap-8">
            <div>
              <span className="text-brand-orange font-bold uppercase tracking-widest text-xs mb-4 block">Selected Works</span>
              <h2 className="text-4xl md:text-6xl font-display font-bold tracking-tighter uppercase">Portfolio</h2>
            </div>
            <div className="flex flex-wrap gap-2 md:gap-3">
              {categories.map((tab) => (
                <button 
                  key={tab}
                  onClick={() => handleTabChange(tab)}
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

          <div className="min-h-[600px]">
            {loadingProjects ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {Array.from({ length: 6 }).map((_, i) => (
                  <ProjectSkeleton key={i} />
                ))}
              </div>
            ) : (
              <AnimatePresence mode="wait">
                <motion.div 
                  key={activeTab}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 min-h-[600px] w-full"
                >
                  {visibleProjects.map((project) => (
                    <div 
                      key={project.id}
                      onClick={() => setSelectedProject(project)}
                      className="group relative aspect-[3/4] rounded-3xl overflow-hidden cursor-pointer bg-brand-dark/50 border border-white/5"
                    >
                      <div className="w-full h-full overflow-hidden">
                        <img 
                          src={project.imageUrl} 
                          alt={project.title}
                          loading="lazy"
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
                    </div>
                  ))}
                </motion.div>
              </AnimatePresence>
            )}
          </div>
          
          {filteredProjects.length > visibleCount && (
            <div className="mt-16 text-center">
              <button 
                onClick={loadMore}
                className="px-12 py-5 border border-white/10 rounded-full text-xs font-bold uppercase tracking-[0.3em] hover:bg-white hover:text-black transition-all"
              >
                Load More Projects
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Contact Section */}
      <motion.section 
        id="contact" 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="py-16 md:py-24 px-6 relative overflow-hidden"
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 md:gap-16">
          <div>
            <h2 className="text-5xl md:text-8xl font-display font-bold tracking-tighter uppercase mb-8">
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

          <div className="glass-card p-6 md:p-10 rounded-3xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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

              {/* reCAPTCHA */}
              <div className="flex justify-center sm:justify-start">
                <ReCAPTCHA
                  sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY || ""}
                  onChange={onCaptchaChange}
                  theme="dark"
                />
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
      </motion.section>

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
                <div className="h-[250px] sm:h-[400px] md:h-[600px] overflow-hidden group/modal">
                  <img 
                    src={selectedProject.imageUrl} 
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
          -webkit-text-stroke: 1px rgba(255,255,255,0.7);
          color: rgba(255,255,255,0.05);
          text-shadow: 0 0 40px rgba(0,0,0,0.5);
        }
        @media (min-width: 768px) {
          .outline-text {
            -webkit-text-stroke: 1.5px rgba(255,255,255,0.7);
          }
        }
      `}</style>
    </main>
    </>
  );
}
