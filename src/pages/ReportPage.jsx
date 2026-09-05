import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Camera,
  MapPin,
  Send,
  Construction,
  Droplets,
  GraduationCap,
  Trash2,
  HeartPulse,
  Zap,
  Leaf,
  Wheat,
  AlertTriangle,
  CheckCircle,
  Upload,
} from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";

const CATEGORIES = [
  { id: "Roads & Infrastructure", label: "Roads & Infrastructure", icon: Construction, color: "from-slate-500 to-slate-700" },
  { id: "Water", label: "Water", icon: Droplets, color: "from-blue-500 to-blue-700" },
  { id: "Education", label: "Education", icon: GraduationCap, color: "from-amber-500 to-amber-700" },
  { id: "Sanitation", label: "Sanitation", icon: Trash2, color: "from-green-500 to-green-700" },
  { id: "Healthcare", label: "Healthcare", icon: HeartPulse, color: "from-red-500 to-red-700" },
  { id: "Electricity", label: "Electricity", icon: Zap, color: "from-yellow-500 to-yellow-700" },
  { id: "Environment", label: "Environment", icon: Leaf, color: "from-emerald-500 to-emerald-700" },
  { id: "Agriculture", label: "Agriculture", icon: Wheat, color: "from-orange-500 to-orange-700" },
];

const SEVERITY = [
  { id: "Low", label: "Low", color: "border-green-500 text-green-400 bg-green-500/10" },
  { id: "Medium", label: "Medium", color: "border-yellow-500 text-yellow-400 bg-yellow-500/10" },
  { id: "High", label: "High", color: "border-red-500 text-red-400 bg-red-500/10" },
];

export function ReportPage() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    severity: "Medium",
    address: "",
    pincode: "",
    image: null,
    imagePreview: null,
  });

  const update = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      update("image", file);
      update("imagePreview", URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    // For now, store locally. Backend integration later.
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/auth");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/reports", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: form.title,
          description: form.description,
          category: form.category,
          severity: form.severity,
          location: {
            address: form.address,
            pincode: form.pincode,
          },
        }),
      });

      if (res.ok) {
        setSubmitted(true);
      } else {
        const data = await res.json();
        alert(data.message || "Something went wrong");
      }
    } catch {
      alert("Could not connect to server");
    }
  };

  const canNext = () => {
    if (step === 1) return form.category !== "";
    if (step === 2) return form.title.trim() !== "" && form.description.trim() !== "";
    if (step === 3) return true;
    return true;
  };

  // Success screen
  if (submitted) {
    return (
      <div className="min-h-screen bg-navy-950 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center space-y-6"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-20 h-20 rounded-full bg-green-500/20 border-2 border-green-500 flex items-center justify-center mx-auto"
          >
            <CheckCircle size={40} className="text-green-400" />
          </motion.div>
          <h1 className="text-3xl font-extrabold text-white">Report Submitted!</h1>
          <p className="text-navy-300 max-w-sm mx-auto">
            Your complaint has been registered successfully. You can track its status from your dashboard.
          </p>
          <div className="flex gap-3 justify-center pt-4">
            <Link
              to="/dashboard"
              className="px-6 py-3 rounded-xl bg-saffron-500 text-white font-semibold hover:bg-saffron-600 transition-colors"
            >
              Go to Dashboard
            </Link>
            <Link
              to="/"
              className="px-6 py-3 rounded-xl bg-navy-800 text-navy-300 font-semibold hover:bg-navy-700 transition-colors border border-navy-700"
            >
              Back to Home
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-navy-950 text-white relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 grid-texture opacity-[0.03]" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-saffron-500/8 blur-[150px] rounded-full" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 blur-[150px] rounded-full" />

      {/* Header */}
      <header className="relative z-10 p-6 flex justify-between items-center">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-navy-300 hover:text-white transition-colors text-sm font-medium"
        >
          <ArrowLeft size={16} />
          Back
        </Link>
        <h1 className="text-lg font-bold">Report a Problem</h1>
        <div className="w-16" />
      </header>

      {/* Progress Bar */}
      <div className="relative z-10 max-w-2xl mx-auto px-6 mb-8">
        <div className="flex items-center gap-2">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex-1 flex items-center gap-2">
              <div
                className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
                  s <= step ? "bg-gradient-to-r from-saffron-500 to-saffron-400" : "bg-navy-800"
                }`}
              />
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2 text-[10px] uppercase tracking-widest text-navy-500 font-semibold">
          <span className={step >= 1 ? "text-saffron-400" : ""}>Category</span>
          <span className={step >= 2 ? "text-saffron-400" : ""}>Details</span>
          <span className={step >= 3 ? "text-saffron-400" : ""}>Location</span>
        </div>
      </div>

      {/* Form Content */}
      <main className="relative z-10 max-w-2xl mx-auto px-6 pb-32">
        <AnimatePresence mode="wait">
          {/* Step 1: Category + Severity */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="space-y-8"
            >
              <div>
                <h2 className="text-2xl font-extrabold mb-2">Select Category</h2>
                <p className="text-sm text-navy-400">Choose the type of problem you want to report.</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {CATEGORIES.map((cat) => {
                  const Icon = cat.icon;
                  const active = form.category === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => update("category", cat.id)}
                      className={`relative group p-4 rounded-2xl border-2 transition-all duration-300 text-left ${
                        active
                          ? "border-saffron-500 bg-saffron-500/10 shadow-lg shadow-saffron-500/10"
                          : "border-navy-700/50 bg-navy-900/40 hover:border-navy-600 hover:bg-navy-800/50"
                      }`}
                    >
                      <div
                        className={`w-10 h-10 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center mb-3`}
                      >
                        <Icon size={18} className="text-white" />
                      </div>
                      <p className="text-xs font-bold text-white leading-tight">{cat.label}</p>
                      {active && (
                        <motion.div
                          layoutId="cat-check"
                          className="absolute top-2 right-2 w-5 h-5 bg-saffron-500 rounded-full flex items-center justify-center"
                        >
                          <CheckCircle size={12} className="text-white" />
                        </motion.div>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Severity */}
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-navy-400 mb-3">Severity Level</h3>
                <div className="flex gap-3">
                  {SEVERITY.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => update("severity", s.id)}
                      className={`flex-1 py-3 rounded-xl border-2 text-sm font-bold transition-all ${
                        form.severity === s.id
                          ? s.color + " shadow-lg"
                          : "border-navy-700 text-navy-500 bg-navy-900/30 hover:border-navy-600"
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 2: Title + Description + Image */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-2xl font-extrabold mb-2">Describe the Problem</h2>
                <p className="text-sm text-navy-400">Tell us what you see and why it needs attention.</p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-navy-300 uppercase tracking-wider">Problem Title</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => update("title", e.target.value)}
                  placeholder="e.g. Large pothole on main road"
                  className="w-full bg-navy-900/50 border border-navy-700 rounded-xl py-3.5 px-4 text-white placeholder:text-navy-600 focus:outline-none focus:ring-2 focus:ring-saffron-500/50 focus:border-saffron-500 transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-navy-300 uppercase tracking-wider">
                  Detailed Description
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) => update("description", e.target.value)}
                  placeholder="Describe the problem in detail — how it affects the community, since when, etc."
                  rows={4}
                  className="w-full bg-navy-900/50 border border-navy-700 rounded-xl py-3.5 px-4 text-white placeholder:text-navy-600 focus:outline-none focus:ring-2 focus:ring-saffron-500/50 focus:border-saffron-500 transition-all resize-none"
                />
              </div>

              {/* Image Upload */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-navy-300 uppercase tracking-wider">
                  Photo / Evidence (Optional)
                </label>
                <div
                  className="relative border-2 border-dashed border-navy-700 rounded-2xl overflow-hidden hover:border-navy-500 transition-colors cursor-pointer"
                  onClick={() => document.getElementById("image-upload").click()}
                >
                  {form.imagePreview ? (
                    <div className="relative">
                      <img
                        src={form.imagePreview}
                        alt="Preview"
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute inset-0 bg-navy-950/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                        <p className="text-sm font-semibold text-white">Click to change</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-navy-500">
                      <Upload size={32} className="mb-3" />
                      <p className="text-sm font-medium">Click to upload a photo</p>
                      <p className="text-xs text-navy-600 mt-1">JPG, PNG up to 10MB</p>
                    </div>
                  )}
                </div>
                <input
                  type="file"
                  id="image-upload"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>
            </motion.div>
          )}

          {/* Step 3: Location */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-2xl font-extrabold mb-2">Location</h2>
                <p className="text-sm text-navy-400">Where is this problem happening?</p>
              </div>

              {/* GPS Button Placeholder */}
              <button
                type="button"
                className="w-full py-4 rounded-2xl border-2 border-dashed border-navy-600 bg-navy-900/40 text-navy-400 flex items-center justify-center gap-3 hover:border-saffron-500 hover:text-saffron-400 transition-all"
              >
                <MapPin size={20} />
                <span className="text-sm font-semibold">Use My Current Location (Coming Soon)</span>
              </button>

              <div className="flex items-center gap-4">
                <div className="flex-1 h-px bg-navy-800" />
                <span className="text-xs text-navy-600 uppercase tracking-wider font-semibold">or enter manually</span>
                <div className="flex-1 h-px bg-navy-800" />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-navy-300 uppercase tracking-wider">
                  Address / Area / Landmark
                </label>
                <input
                  type="text"
                  value={form.address}
                  onChange={(e) => update("address", e.target.value)}
                  placeholder="e.g. Near Tata Stadium, Sakchi, Jamshedpur"
                  className="w-full bg-navy-900/50 border border-navy-700 rounded-xl py-3.5 px-4 text-white placeholder:text-navy-600 focus:outline-none focus:ring-2 focus:ring-saffron-500/50 focus:border-saffron-500 transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-navy-300 uppercase tracking-wider">Pincode</label>
                <input
                  type="text"
                  value={form.pincode}
                  onChange={(e) => update("pincode", e.target.value)}
                  placeholder="e.g. 831001"
                  maxLength={6}
                  className="w-full bg-navy-900/50 border border-navy-700 rounded-xl py-3.5 px-4 text-white placeholder:text-navy-600 focus:outline-none focus:ring-2 focus:ring-saffron-500/50 focus:border-saffron-500 transition-all"
                />
              </div>

              {/* Summary */}
              <div className="bg-navy-900/60 border border-navy-700/50 rounded-2xl p-5 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-navy-400">Summary</h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-navy-500 text-xs">Category</p>
                    <p className="font-semibold text-white">{form.category || "—"}</p>
                  </div>
                  <div>
                    <p className="text-navy-500 text-xs">Severity</p>
                    <p className="font-semibold text-white">{form.severity}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-navy-500 text-xs">Title</p>
                    <p className="font-semibold text-white">{form.title || "—"}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-navy-950/90 backdrop-blur-lg border-t border-navy-800 p-4 z-20">
        <div className="max-w-2xl mx-auto flex gap-3">
          {step > 1 && (
            <button
              onClick={() => setStep(step - 1)}
              className="px-6 py-3.5 rounded-xl bg-navy-800 text-navy-300 font-semibold hover:bg-navy-700 transition-colors border border-navy-700"
            >
              Back
            </button>
          )}
          {step < 3 ? (
            <button
              onClick={() => canNext() && setStep(step + 1)}
              disabled={!canNext()}
              className={`flex-1 py-3.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                canNext()
                  ? "bg-gradient-to-r from-saffron-500 to-saffron-600 text-white shadow-lg shadow-saffron-500/20 hover:shadow-saffron-500/40"
                  : "bg-navy-800 text-navy-600 cursor-not-allowed"
              }`}
            >
              Continue
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="flex-1 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/20 hover:shadow-green-500/40 transition-all flex items-center justify-center gap-2"
            >
              <Send size={16} />
              Submit Report
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
