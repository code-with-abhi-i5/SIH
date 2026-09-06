import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import gsap from "gsap";
import {
  ArrowLeft,
  Mail,
  Lock,
  User,
  Building,
  GraduationCap,
  MapPin,
  Phone,
  Briefcase,
  ShieldCheck,
  CheckCircle,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { useAuth, ROLES, ROLE_LABELS } from "../contexts/AuthContext";
import { useLanguage } from "../contexts/LanguageContext";

const ROLE_OPTIONS = [
  { id: ROLES.CITIZEN, label: "Citizen / Panchayat", icon: User, desc: "Report local issues & track community fixes" },
  { id: ROLES.STUDENT, label: "Student Innovator", icon: GraduationCap, desc: "Solve challenges, build prototypes & earn NEP credits" },
  { id: ROLES.FACULTY, label: "Faculty / Mentor", icon: ShieldCheck, desc: "Guide students & issue NEP 2020 credit certificates" },
  { id: ROLES.INDUSTRY, label: "CSR Partner", icon: Building, desc: "Fund innovative projects via transparent escrow" },
  { id: ROLES.ADMIN, label: "Govt / DM Admin", icon: Briefcase, desc: "Monitor GIS hotspots & coordinate resolution" },
];

export function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [selectedRole, setSelectedRole] = useState(ROLES.CITIZEN);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    organization: "",
    department: "",
    district: "Ranchi",
    phone: "",
    skills: "",
  });

  const { login, signup, loading, isAuthenticated } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const containerRef = useRef(null);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (!containerRef.current) return;
    gsap.fromTo(
      containerRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }
    );
  }, [isLogin]);

  const updateForm = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isLogin) {
      const res = await login(form.email, form.password);
      if (res.success) {
        navigate("/dashboard");
      }
    } else {
      const payload = {
        name: form.name,
        email: form.email,
        password: form.password,
        role: selectedRole,
        district: form.district,
        phone: form.phone,
        organization: form.organization || (selectedRole === "student" ? "BIT Mesra" : "JanSamadhan Hub"),
        department: form.department || "Computer Science / Engineering",
        skills: form.skills ? form.skills.split(",").map((s) => s.trim()) : ["Innovation", "Problem Solving"],
      };
      const res = await signup(payload);
      if (res.success) {
        navigate("/dashboard");
      }
    }
  };

  // Quick Demo Login Helper
  const handleQuickDemo = async (roleType) => {
    const demoCredentials = {
      [ROLES.CITIZEN]: { email: "citizen.ramesh@jharkhand.in", name: "Ramesh Mahto" },
      [ROLES.STUDENT]: { email: "aman.student@ranchiuniv.ac.in", name: "Aman Kumar" },
      [ROLES.FACULTY]: { email: "faculty.verma@bitmesra.ac.in", name: "Dr. S. K. Verma" },
      [ROLES.INDUSTRY]: { email: "csr.director@tatasteel.com", name: "Tata Steel CSR Foundation" },
      [ROLES.ADMIN]: { email: "dm.ranchi@jharkhand.gov.in", name: "District Magistrate Ranchi" },
    };

    const creds = demoCredentials[roleType] || demoCredentials[ROLES.STUDENT];
    await signup({
      name: creds.name,
      email: creds.email,
      password: "password123",
      role: roleType,
      organization: roleType === "student" ? "BIT Mesra" : roleType === "faculty" ? "Ranchi University" : "Govt of Jharkhand",
      department: "Technical Council",
      district: "Ranchi",
    });
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-warm-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Back to Home */}
      <div className="max-w-md w-full mx-auto mb-4">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-navy-600 hover:text-navy-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
      </div>

      <div
        ref={containerRef}
        className="max-w-xl w-full mx-auto bg-white rounded-2xl shadow-xl border border-navy-100/80 p-8 sm:p-10"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-navy-900 text-white flex items-center justify-center mx-auto mb-3 shadow-md">
            <ShieldCheck className="w-6 h-6 text-amber-400" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-navy-950">
            {isLogin ? "Welcome Back to JanSamadhan" : "Join the Civic Innovation Ecosystem"}
          </h2>
          <p className="text-xs sm:text-sm text-navy-600 mt-1">
            {isLogin
              ? "Sign in to access your role-based dashboard & active projects"
              : "Collaborate to solve local community challenges across Jharkhand"}
          </p>
        </div>

        {/* Form Mode Toggle */}
        <div className="flex bg-navy-50 p-1 rounded-xl mb-6">
          <button
            type="button"
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
              isLogin ? "bg-white text-navy-900 shadow-sm" : "text-navy-600 hover:text-navy-900"
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
              !isLogin ? "bg-white text-navy-900 shadow-sm" : "text-navy-600 hover:text-navy-900"
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Role Selector (When creating account) */}
        {!isLogin && (
          <div className="mb-6">
            <label className="block text-xs font-bold uppercase text-navy-700 mb-2">
              Select Your Stakeholder Role
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {ROLE_OPTIONS.map((opt) => (
                <button
                  type="button"
                  key={opt.id}
                  onClick={() => setSelectedRole(opt.id)}
                  className={`p-3 rounded-xl border text-left transition-all flex items-start gap-2.5 ${
                    selectedRole === opt.id
                      ? "border-navy-900 bg-navy-50/70 text-navy-950 shadow-sm"
                      : "border-navy-200 bg-white text-navy-700 hover:border-navy-400"
                  }`}
                >
                  <opt.icon
                    className={`w-4 h-4 shrink-0 mt-0.5 ${
                      selectedRole === opt.id ? "text-amber-600" : "text-navy-400"
                    }`}
                  />
                  <div>
                    <p className="text-xs font-bold leading-tight">{opt.label}</p>
                    <p className="text-[10px] text-navy-500 mt-0.5 leading-snug line-clamp-1">{opt.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-xs font-semibold text-navy-800 mb-1">Full Name / Organization</label>
              <div className="relative">
                <User className="w-4 h-4 text-navy-400 absolute left-3 top-3" />
                <input
                  type="text"
                  name="name"
                  required
                  value={form.name}
                  onChange={updateForm}
                  placeholder="e.g. Aman Kumar or Ranchi Tech Council"
                  className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-navy-50/50 border border-navy-200 rounded-xl focus:outline-none focus:border-navy-900"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-navy-800 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-navy-400 absolute left-3 top-3" />
              <input
                type="email"
                name="email"
                required
                value={form.email}
                onChange={updateForm}
                placeholder="name@university.ac.in or user@mail.com"
                className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-navy-50/50 border border-navy-200 rounded-xl focus:outline-none focus:border-navy-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-navy-800 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-navy-400 absolute left-3 top-3" />
              <input
                type="password"
                name="password"
                required
                value={form.password}
                onChange={updateForm}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-navy-50/50 border border-navy-200 rounded-xl focus:outline-none focus:border-navy-900"
              />
            </div>
          </div>

          {/* Dynamic Role-specific Fields on Signup */}
          {!isLogin && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-navy-800 mb-1">
                    {selectedRole === ROLES.STUDENT || selectedRole === ROLES.FACULTY
                      ? "University / College"
                      : selectedRole === ROLES.INDUSTRY
                      ? "Company / CSR Foundation"
                      : "District"}
                  </label>
                  <input
                    type="text"
                    name="organization"
                    value={form.organization}
                    onChange={updateForm}
                    placeholder={
                      selectedRole === ROLES.STUDENT
                        ? "e.g. BIT Mesra / Ranchi Univ"
                        : selectedRole === ROLES.INDUSTRY
                        ? "e.g. Tata Steel CSR"
                        : "e.g. Ranchi"
                    }
                    className="w-full px-3 py-2 text-xs bg-navy-50/50 border border-navy-200 rounded-xl focus:outline-none focus:border-navy-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-navy-800 mb-1">District</label>
                  <select
                    name="district"
                    value={form.district}
                    onChange={updateForm}
                    className="w-full px-3 py-2 text-xs bg-navy-50/50 border border-navy-200 rounded-xl focus:outline-none focus:border-navy-900"
                  >
                    <option value="Ranchi">Ranchi</option>
                    <option value="Dhanbad">Dhanbad</option>
                    <option value="East Singhbhum">East Singhbhum (Jamshedpur)</option>
                    <option value="Bokaro">Bokaro</option>
                    <option value="Hazaribagh">Hazaribagh</option>
                    <option value="Dumka">Dumka</option>
                    <option value="Deoghar">Deoghar</option>
                  </select>
                </div>
              </div>

              {selectedRole === ROLES.STUDENT && (
                <div>
                  <label className="block text-xs font-semibold text-navy-800 mb-1">
                    Technical Skills (comma separated)
                  </label>
                  <input
                    type="text"
                    name="skills"
                    value={form.skills}
                    onChange={updateForm}
                    placeholder="e.g. IoT, Solar Energy, AI/ML, Civil Engineering"
                    className="w-full px-3 py-2 text-xs bg-navy-50/50 border border-navy-200 rounded-xl focus:outline-none focus:border-navy-900"
                  />
                </div>
              )}
            </>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-navy-900 hover:bg-navy-800 text-white font-bold rounded-xl mt-2 flex items-center justify-center gap-2"
          >
            {loading ? "Processing..." : isLogin ? "Sign In to JanSamadhan" : "Create Account"}
            <ArrowRight className="w-4 h-4" />
          </Button>
        </form>

        {/* Instant Demo Persona Switcher */}
        <div className="mt-8 pt-6 border-t border-navy-100">
          <div className="flex items-center gap-1.5 mb-2.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <p className="text-xs font-bold text-navy-900">Instant Demo 1-Click Login:</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
            <button
              onClick={() => handleQuickDemo(ROLES.STUDENT)}
              className="px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-800 rounded-lg text-[11px] font-semibold text-left border border-blue-200 transition-colors"
            >
              🎓 Student Innovator
            </button>
            <button
              onClick={() => handleQuickDemo(ROLES.FACULTY)}
              className="px-2.5 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-800 rounded-lg text-[11px] font-semibold text-left border border-purple-200 transition-colors"
            >
              👨‍🏫 Faculty Mentor
            </button>
            <button
              onClick={() => handleQuickDemo(ROLES.INDUSTRY)}
              className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-lg text-[11px] font-semibold text-left border border-emerald-200 transition-colors"
            >
              🏢 CSR Partner
            </button>
            <button
              onClick={() => handleQuickDemo(ROLES.ADMIN)}
              className="px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-lg text-[11px] font-semibold text-left border border-amber-200 transition-colors"
            >
              🏛️ District Admin
            </button>
            <button
              onClick={() => handleQuickDemo(ROLES.CITIZEN)}
              className="px-2.5 py-1.5 bg-gray-50 hover:bg-gray-100 text-navy-800 rounded-lg text-[11px] font-semibold text-left border border-gray-200 transition-colors"
            >
              👤 Citizen / Gramin
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;
