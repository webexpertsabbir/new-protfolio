import { useState, useEffect } from "react";
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  onAuthStateChanged, 
  signOut,
  User
} from "firebase/auth";
import { motion, AnimatePresence } from "motion/react";
import { 
  Plus, 
  Trash2, 
  Edit3,
  LogOut, 
  Image as ImageIcon, 
  Loader2, 
  ExternalLink,
  ShieldCheck,
  X
} from "lucide-react";
import { auth } from "../firebase";
import { 
  getProjects, 
  addProject, 
  updateProject,
  deleteProject, 
  uploadProjectImage, 
  Project 
} from "../services/projectService";
import { cn } from "@/src/lib/utils";

const ADMIN_EMAIL = "swufwebpro@gmail.com";

export default function Admin() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  
  const initialFormState = {
    title: "",
    category: "WordPress",
    imageUrl: "",
    link: "",
    description: ""
  };

  const [newProject, setNewProject] = useState(initialFormState);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
      if (u) {
        if (u.email === ADMIN_EMAIL) {
          fetchProjects();
          setError(null);
        } else {
          setError(`Access denied. ${u.email} is not authorized.`);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchProjects = async () => {
    try {
      const data = await getProjects();
      setProjects(data);
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to fetch projects. Check your database permissions.");
    }
  };

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    setError(null);
    try {
      await signInWithPopup(auth, provider);
    } catch (err: any) {
      console.error("Login error:", err);
      if (err.code === "auth/unauthorized-domain") {
        setError("This domain is not authorized in Firebase. Please add it to the Authorized Domains list in the Firebase Console.");
      } else {
        setError(err.message || "Login failed. Please try again.");
      }
    }
  };

  const handleLogout = () => signOut(auth);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);
    try {
      const url = await uploadProjectImage(file);
      setNewProject(prev => ({ ...prev, imageUrl: url }));
    } catch (err: any) {
      console.error("Image upload error:", err);
      setError(`Image upload failed: ${err.message || "Unknown error"}. Please ensure Firebase Storage is enabled in your console.`);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProject.imageUrl) return alert("Please upload an image first!");

    setIsAdding(true);
    try {
      if (editingId) {
        await updateProject(editingId, newProject);
        alert("Project updated successfully!");
      } else {
        await addProject(newProject);
        alert("Project added successfully!");
      }
      setNewProject(initialFormState);
      setEditingId(null);
      fetchProjects();
    } catch (error) {
      alert(editingId ? "Error updating project!" : "Error adding project!");
    } finally {
      setIsAdding(false);
    }
  };

  const handleEdit = (project: Project) => {
    setEditingId(project.id!);
    setNewProject({
      title: project.title,
      category: project.category,
      imageUrl: project.imageUrl,
      link: project.link,
      description: project.description || ""
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setNewProject(initialFormState);
  };

  const handleDelete = async (id: string, imageUrl: string) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;
    
    try {
      await deleteProject(id, imageUrl);
      fetchProjects();
    } catch (error) {
      alert("Error deleting project!");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-dark flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-brand-orange animate-spin" />
      </div>
    );
  }

  if (!user || user.email !== ADMIN_EMAIL) {
    return (
      <div className="min-h-screen bg-brand-dark flex flex-col items-center justify-center px-6">
        <ShieldCheck className="w-20 h-20 text-brand-orange mb-8 opacity-20" />
        <h1 className="text-4xl font-display font-bold uppercase tracking-tighter mb-4">Admin Access</h1>
        <p className="text-white/40 mb-8 text-center max-w-md">
          This area is restricted to the administrator. Please sign in with the authorized email to manage your portfolio.
        </p>
        
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm text-center max-w-md">
            {error}
          </div>
        )}

        <button 
          onClick={handleLogin}
          className="px-10 py-4 bg-white text-black font-bold uppercase tracking-widest text-sm rounded-full hover:bg-brand-orange hover:text-white transition-all"
        >
          Sign in with Google
        </button>
        <a href="/" className="mt-8 text-white/20 hover:text-white transition-colors text-xs uppercase tracking-widest">
          Back to Website
        </a>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-dark pt-32 pb-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <h1 className="text-5xl font-display font-bold uppercase tracking-tighter">Dashboard</h1>
            <p className="text-white/40 mt-2">Welcome back, {user.displayName}</p>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 px-6 py-3 border border-white/10 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-red-500/20 hover:border-red-500/50 transition-all"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>

        <div className="grid lg:grid-cols-[1fr_2fr] gap-12">
          {/* Add/Edit Project Form */}
          <div className="glass-card p-8 rounded-3xl h-fit sticky top-32">
            <h2 className="text-2xl font-display font-bold uppercase mb-8 flex items-center justify-between">
              <span className="flex items-center gap-3">
                {editingId ? <Edit3 className="text-brand-orange" /> : <Plus className="text-brand-orange" />}
                {editingId ? "Edit Project" : "Add Project"}
              </span>
              {editingId && (
                <button 
                  onClick={cancelEdit}
                  className="p-2 hover:bg-white/5 rounded-full transition-colors"
                  title="Cancel Edit"
                >
                  <X className="w-5 h-5 text-white/40" />
                </button>
              )}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-white/40">Project Title</label>
                <input 
                  type="text" 
                  required
                  value={newProject.title}
                  onChange={e => setNewProject(p => ({ ...p, title: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-brand-orange transition-colors"
                  placeholder="e.g. Fashion Hub Store"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-white/40">Category</label>
                <select 
                  value={newProject.category}
                  onChange={e => setNewProject(p => ({ ...p, category: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-brand-orange transition-colors appearance-none"
                >
                  {["WordPress", "WordPress WooCommerce", "React JS", "Next JS"].map(cat => (
                    <option key={cat} value={cat} className="bg-brand-dark">{cat}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-white/40">Live Link</label>
                <input 
                  type="url" 
                  required
                  value={newProject.link}
                  onChange={e => setNewProject(p => ({ ...p, link: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-brand-orange transition-colors"
                  placeholder="https://example.com"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-white/40">Thumbnail Image</label>
                <div className="relative group">
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label 
                    htmlFor="image-upload"
                    className={cn(
                      "flex flex-col items-center justify-center gap-4 p-8 border-2 border-dashed border-white/10 rounded-2xl cursor-pointer hover:border-brand-orange transition-all",
                      newProject.imageUrl && "border-brand-orange/50 bg-brand-orange/5"
                    )}
                  >
                    {uploading ? (
                      <Loader2 className="w-8 h-8 text-brand-orange animate-spin" />
                    ) : newProject.imageUrl ? (
                      <div className="text-center">
                        <ShieldCheck className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                        <span className="text-[10px] uppercase font-bold text-emerald-500">Image Uploaded to ImgBB</span>
                        <p className="text-[8px] text-white/20 mt-1 truncate max-w-[200px]">{newProject.imageUrl}</p>
                      </div>
                    ) : (
                      <>
                        <ImageIcon className="w-8 h-8 text-white/20 group-hover:text-brand-orange transition-colors" />
                        <span className="text-[10px] uppercase font-bold text-white/40">Click to Upload (Powered by ImgBB)</span>
                      </>
                    )}
                  </label>
                </div>
              </div>

              <button 
                type="submit"
                disabled={isAdding || uploading}
                className="w-full py-4 bg-brand-orange text-white font-bold uppercase tracking-[0.3em] text-xs rounded-xl hover:scale-[1.02] transition-transform disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isAdding ? <Loader2 className="w-4 h-4 animate-spin" /> : editingId ? "Update Project" : "Publish Project"}
              </button>
              {editingId && (
                <button 
                  type="button"
                  onClick={cancelEdit}
                  className="w-full py-4 border border-white/10 text-white/60 font-bold uppercase tracking-[0.3em] text-xs rounded-xl hover:bg-white/5 transition-colors"
                >
                  Cancel Edit
                </button>
              )}
            </form>
          </div>

          {/* Project List */}
          <div className="space-y-6">
            <h2 className="text-2xl font-display font-bold uppercase mb-8">Live Projects ({projects.length})</h2>
            <div className="grid sm:grid-cols-2 gap-6">
              <AnimatePresence mode="popLayout">
                {projects.map((project) => (
                  <motion.div 
                    key={project.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="glass-card rounded-2xl overflow-hidden group border border-white/5"
                  >
                    <div className="aspect-video relative overflow-hidden">
                      <img 
                        src={project.imageUrl} 
                        alt={project.title} 
                        className="w-full h-full object-cover object-top transition-all duration-[5000ms] group-hover:object-bottom"
                      />
                      <div className="absolute top-4 right-4 flex gap-2">
                        <a 
                          href={project.link} 
                          target="_blank" 
                          rel="noreferrer"
                          className="w-8 h-8 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center hover:bg-brand-orange transition-colors"
                          title="Preview Live"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                        <button 
                          onClick={() => handleEdit(project)}
                          className="w-8 h-8 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center hover:bg-white hover:text-black transition-colors"
                          title="Edit Project"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(project.id!, project.imageUrl)}
                          className="w-8 h-8 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center hover:bg-red-500 transition-colors"
                          title="Delete Project"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="p-6">
                      <span className="text-brand-orange text-[10px] font-bold uppercase tracking-widest">{project.category}</span>
                      <h3 className="text-xl font-display font-bold uppercase tracking-tighter mt-1">{project.title}</h3>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
