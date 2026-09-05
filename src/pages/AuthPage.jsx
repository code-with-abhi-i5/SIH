import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import gsap from "gsap";
import { ArrowLeft, Mail, Lock, User, Loader } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { Button } from "../components/ui/button";
import { GoogleLogin } from "@react-oauth/google";

export function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const { t, language, setLanguage } = useLanguage();
  const navigate = useNavigate();
  
  const formRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/dashboard");
    }
  }, [navigate]);

  useEffect(() => {
    // Initial entrance animation
    if (!containerRef.current) return;
    
    let ctx = gsap.context(() => {
      gsap.from(containerRef.current, {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out"
      });
    }, containerRef);
    
    return () => ctx.revert();
  }, []);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const toggleMode = () => {
    const tl = gsap.timeline();
    tl.to(formRef.current, { opacity: 0, y: -10, duration: 0.2, ease: "power2.in" })
      .call(() => {
        setIsLogin(!isLogin);
        setForm({ name: "", email: "", password: "" });
      })
      .to(formRef.current, { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" }, "+=0.1");
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

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setLoading(true);
      const res = await fetch(`http://localhost:5000/api/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credential: credentialResponse.credential }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("userName", data.name);
        if (data.avatar) localStorage.setItem("userAvatar", data.avatar);
        navigate("/dashboard");
      } else {
        alert(data.message || "Google authentication failed");
      }
    } catch (error) {
      console.error("Google auth error:", error);
      alert("Could not connect to authentication server. Ensure backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    console.error("Google Login Failed");
    alert("Google Sign In was unsuccessful. Please try again.");
  };


  return (
    <div className="min-h-screen bg-warm-50 flex flex-col relative overflow-hidden text-navy-900 selection:bg-green-500/20 selection:text-green-900">
      {/* Background Effects */}
      <div className="absolute inset-0 grid-texture opacity-50 pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-64 bg-green-500/10 blur-[120px] rounded-full pointer-events-none" />
      
      {/* Minimal Header */}
      <header className="absolute top-0 left-0 right-0 p-4 sm:p-6 flex justify-between items-center z-50">
        <Link to="/" className="inline-flex items-center gap-2 text-navy-500 hover:text-navy-900 transition-colors text-sm font-semibold bg-white/50 backdrop-blur-md px-4 py-2 rounded-full border border-navy-100">
          <ArrowLeft size={16} />
          {t("nav.home") || "Back to Home"}
        </Link>

        {/* Language Toggle */}
        <div className="flex items-center rounded-full border border-navy-200 bg-white p-1 shadow-sm">
          <button
            onClick={() => setLanguage("en")}
            className={`px-4 py-1.5 text-xs font-bold rounded-full transition-all ${
              language === "en" ? "bg-green-600 text-white shadow-md shadow-green-600/20" : "text-navy-500 hover:text-navy-900 hover:bg-navy-50"
            }`}
          >
            EN
          </button>
          <button
            onClick={() => setLanguage("hi")}
            className={`px-4 py-1.5 text-xs font-bold rounded-full transition-all ${
              language === "hi" ? "bg-green-600 text-white shadow-md shadow-green-600/20" : "text-navy-500 hover:text-navy-900 hover:bg-navy-50"
            }`}
          >
            हिं
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-8 z-10">
        <div
          ref={containerRef}
          className="w-full max-w-md bg-white/90 backdrop-blur-xl border border-navy-100 rounded-3xl p-6 sm:p-10 shadow-xl shadow-navy-900/5"
        >
          <div ref={formRef} className="space-y-8">
            {/* Header */}
            <div className="text-center space-y-2">
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg shadow-green-600/20">
                <Lock size={24} className="text-white" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900 tracking-tight">
                {isLogin ? t("auth.login.title") : t("auth.signup.title")}
              </h1>
              <p className="text-sm text-navy-500 font-medium">
                {isLogin ? t("auth.login.subtitle") : t("auth.signup.subtitle")}
              </p>
            </div>

            {/* Form */}
            <form className="space-y-5" onSubmit={handleSubmit}>
              {!isLogin && (
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-navy-500 uppercase tracking-widest ml-1">
                    {t("auth.name")}
                  </label>
                  <div className="relative">
                    <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-navy-400" />
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={updateForm}
                      required
                      placeholder="John Doe"
                      className="w-full bg-navy-50 border border-navy-200 rounded-xl py-3.5 pl-11 pr-4 text-navy-900 placeholder:text-navy-400 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 focus:bg-white transition-all font-medium"
                    />
                  </div>
                </div>
              )}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-navy-500 uppercase tracking-widest ml-1">
                  {t("auth.email")}
                </label>
                <div className="relative">
                  <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-navy-400" />
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={updateForm}
                    required
                    placeholder="you@example.com"
                    className="w-full bg-navy-50 border border-navy-200 rounded-xl py-3.5 pl-11 pr-4 text-navy-900 placeholder:text-navy-400 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 focus:bg-white transition-all font-medium"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-navy-500 uppercase tracking-widest ml-1">
                  {t("auth.password")}
                </label>
                <div className="relative">
                  <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-navy-400" />
                  <input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={updateForm}
                    required
                    placeholder="••••••••"
                    className="w-full bg-navy-50 border border-navy-200 rounded-xl py-3.5 pl-11 pr-4 text-navy-900 placeholder:text-navy-400 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 focus:bg-white transition-all font-medium"
                  />
                </div>
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full py-4 mt-2 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold shadow-lg shadow-green-600/20 transition-all hover:-translate-y-0.5 flex items-center justify-center disabled:opacity-70 disabled:hover:translate-y-0"
              >
                {loading ? <Loader className="animate-spin" size={20} /> : (isLogin ? t("auth.login.btn") : t("auth.signup.btn"))}
              </button>
            </form>

            {/* Toggle Mode */}
            <div className="text-center">
              <button
                type="button"
                onClick={toggleMode}
                className="text-sm font-bold text-navy-500 hover:text-green-600 transition-colors"
              >
                {isLogin ? t("auth.signup.link") : t("auth.login.link")}
              </button>
            </div>

            {/* Social Login */}
            <div className="pt-6 border-t border-navy-100 space-y-4">
              <p className="text-[10px] text-center text-navy-400 uppercase tracking-widest font-bold">
                {t("auth.or")}
              </p>
              <div className="flex justify-center w-full min-h-[44px]">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                  theme="outline"
                  size="large"
                  shape="pill"
                  width="380"
                  text={isLogin ? "signin_with" : "signup_with"}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
