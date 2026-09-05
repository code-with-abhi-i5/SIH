import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Mail, Lock, User, Loader } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { Button } from "../components/ui/button";

export function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const { t, language, setLanguage } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setForm({ name: "", email: "", password: "" });
  };

  const updateForm = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";
    const body = isLogin 
      ? { email: form.email, password: form.password }
      : { name: form.name, email: form.email, password: form.password };

    try {
      const res = await fetch(`http://localhost:5000${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("userName", data.name);
        navigate("/dashboard");
      } else {
        alert(data.message || "Authentication failed");
      }
    } catch (error) {
      alert("Could not connect to server. Ensure backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-navy-950 flex flex-col relative overflow-hidden text-white">
      {/* Background Effects */}
      <div className="absolute inset-0 grid-texture opacity-[0.03] pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-64 bg-saffron-500/10 blur-[120px] rounded-full pointer-events-none" />
      
      {/* Minimal Header */}
      <header className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-50">
        <Link to="/" className="inline-flex items-center gap-2 text-navy-300 hover:text-white transition-colors text-sm font-medium relative z-50">
          <ArrowLeft size={16} />
          {t("nav.home") || "Back to Home"}
        </Link>

        {/* Language Toggle */}
        <div className="flex items-center rounded-lg border border-navy-800 bg-navy-900 p-0.5">
          <button
            onClick={() => setLanguage("en")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              language === "en" ? "bg-white text-navy-900" : "text-navy-400 hover:text-white"
            }`}
          >
            EN
          </button>
          <button
            onClick={() => setLanguage("hi")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              language === "hi" ? "bg-white text-navy-900" : "text-navy-400 hover:text-white"
            }`}
          >
            हिं
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-8 z-10">
        <motion.div
          layout
          className="w-full max-w-md bg-navy-900/40 backdrop-blur-xl border border-navy-700/50 rounded-3xl p-6 sm:p-10 shadow-2xl shadow-navy-900/50"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={isLogin ? "login" : "signup"}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              {/* Header */}
              <div className="text-center space-y-2">
                <motion.div
                  layoutId="logo-indicator"
                  className="w-12 h-12 bg-gradient-to-br from-saffron-400 to-red-500 rounded-xl mx-auto mb-6 flex items-center justify-center shadow-lg shadow-saffron-500/20"
                >
                  <Lock size={20} className="text-white" />
                </motion.div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                  {isLogin ? t("auth.login.title") : t("auth.signup.title")}
                </h1>
                <p className="text-sm text-navy-300">
                  {isLogin ? t("auth.login.subtitle") : t("auth.signup.subtitle")}
                </p>
              </div>

              {/* Form */}
              <form className="space-y-4" onSubmit={handleSubmit}>
                {!isLogin && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-navy-300 uppercase tracking-wider">
                      {t("auth.name")}
                    </label>
                    <div className="relative">
                      <User size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-navy-500" />
                      <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={updateForm}
                        required
                        placeholder="John Doe"
                        className="w-full bg-navy-950/50 border border-navy-700 rounded-xl py-3 pl-10 pr-4 text-white placeholder:text-navy-600 focus:outline-none focus:ring-2 focus:ring-saffron-500/50 focus:border-saffron-500 transition-all"
                      />
                    </div>
                  </div>
                )}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-navy-300 uppercase tracking-wider">
                    {t("auth.email")}
                  </label>
                  <div className="relative">
                    <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-navy-500" />
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={updateForm}
                      required
                      placeholder="you@example.com"
                      className="w-full bg-navy-950/50 border border-navy-700 rounded-xl py-3 pl-10 pr-4 text-white placeholder:text-navy-600 focus:outline-none focus:ring-2 focus:ring-saffron-500/50 focus:border-saffron-500 transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-navy-300 uppercase tracking-wider">
                    {t("auth.password")}
                  </label>
                  <div className="relative">
                    <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-navy-500" />
                    <input
                      type="password"
                      name="password"
                      value={form.password}
                      onChange={updateForm}
                      required
                      placeholder="••••••••"
                      className="w-full bg-navy-950/50 border border-navy-700 rounded-xl py-3 pl-10 pr-4 text-white placeholder:text-navy-600 focus:outline-none focus:ring-2 focus:ring-saffron-500/50 focus:border-saffron-500 transition-all"
                    />
                  </div>
                </div>

                <Button 
                  variant="primary" 
                  disabled={loading}
                  className="w-full py-6 mt-4 shadow-lg shadow-saffron-500/20 hover:shadow-saffron-500/40 flex items-center justify-center"
                >
                  {loading ? <Loader className="animate-spin" size={20} /> : (isLogin ? t("auth.login.btn") : t("auth.signup.btn"))}
                </Button>
              </form>

              {/* Toggle Mode */}
              <div className="text-center">
                <button
                  type="button"
                  onClick={toggleMode}
                  className="text-sm font-medium text-navy-300 hover:text-white transition-colors"
                >
                  {isLogin ? t("auth.signup.link") : t("auth.login.link")}
                </button>
              </div>

              {/* Social Login */}
              <div className="pt-6 border-t border-navy-700/50 space-y-4">
                <p className="text-xs text-center text-navy-400 uppercase tracking-wider font-semibold">
                  {t("auth.or")}
                </p>
                <div className="flex flex-col gap-3">
                  <button type="button" onClick={() => alert("Google Login ke liye Google Cloud Console se Client ID chahiye hoga. Abhi ke liye normal Email/Password se signup karein!")} className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-navy-800 hover:bg-navy-700 text-sm font-medium transition-colors border border-navy-700 w-full">
                    <div className="w-4 h-4 rounded-full bg-gradient-to-tr from-blue-500 to-red-500" />
                    Continue with Google
                  </button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </main>
    </div>
  );
}
