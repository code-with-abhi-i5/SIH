import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
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
  Check,
  ShieldCheck,
  Building2,
} from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { LocationPicker } from "../components/ui/LocationPicker";

const CATEGORIES = [
  { id: "Roads & Infrastructure", label: "Roads & Infrastructure", icon: Construction, color: "from-slate-600 to-slate-800" },
  { id: "Water", label: "Water Supply", icon: Droplets, color: "from-blue-600 to-cyan-700" },
  { id: "Education", label: "Education", icon: GraduationCap, color: "from-amber-600 to-orange-700" },
  { id: "Sanitation", label: "Sanitation & Waste", icon: Trash2, color: "from-emerald-600 to-green-800" },
  { id: "Healthcare", label: "Healthcare", icon: HeartPulse, color: "from-rose-600 to-red-700" },
  { id: "Electricity", label: "Electricity & Lighting", icon: Zap, color: "from-yellow-500 to-amber-600" },
  { id: "Environment", label: "Environment & Trees", icon: Leaf, color: "from-green-600 to-emerald-700" },
  { id: "Agriculture", label: "Agriculture & Rural", icon: Wheat, color: "from-amber-700 to-yellow-800" },
];

const SEVERITY = [
  { id: "Low", label: "Low Priority", color: "border-green-300 text-green-800 bg-green-50/80 hover:bg-green-100", activeBg: "border-green-600 bg-green-100 text-green-900 ring-2 ring-green-600" },
  { id: "Medium", label: "Medium Priority", color: "border-amber-300 text-amber-800 bg-amber-50/80 hover:bg-amber-100", activeBg: "border-amber-600 bg-amber-100 text-amber-900 ring-2 ring-amber-600" },
  { id: "High", label: "Urgent / High Hazard", color: "border-red-300 text-red-800 bg-red-50/80 hover:bg-red-100", activeBg: "border-red-600 bg-red-100 text-red-900 ring-2 ring-red-600" },
];

export function ReportPage() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    severity: "Medium",
    address: "",
    pincode: "",
    lat: 23.3441,
    lng: 85.3096,
    name: "",
    phone: "",
    email: "",
    image: null,
    imagePreview: null,
  });

  const update = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        update("image", file);
        update("imagePreview", reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login first to submit a report.");
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
            lat: form.lat,
            lng: form.lng,
          },
          imageUrl: form.imagePreview || "",
          contactDetails: {
            name: form.name,
            phone: form.phone,
            email: form.email,
          },
        }),
      });

      if (res.ok) {
        setSubmitted(true);
      } else {
        const data = await res.json();
        alert(data.message || "Something went wrong while submitting report");
      }
    } catch {
      alert("Could not connect to backend server. Ensure server is running on port 5000.");
    } finally {
      setLoading(false);
    }
  };

  const canNext = () => {
    if (step === 1) return form.category !== "";
    if (step === 2) return form.title.trim() !== "" && form.description.trim() !== "";
    if (step === 3) return form.address.trim() !== "";
    if (step === 4) return form.name.trim() !== "" && form.phone.trim() !== "";
    return true;
  };

  // Success Screen
  if (submitted) {
    return (
      <div className="min-h-screen bg-warm-50 flex items-center justify-center p-4 selection:bg-green-500/20 selection:text-green-900 font-sans">
        <div className="absolute inset-0 grid-texture opacity-40 pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-64 bg-green-500/10 blur-[120px] rounded-full pointer-events-none" />

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative z-10 w-full max-w-md bg-white/95 backdrop-blur-xl border border-green-100 rounded-3xl p-8 sm:p-10 shadow-2xl shadow-green-900/10 text-center space-y-6"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.15, type: "spring", stiffness: 220 }}
            className="w-20 h-20 rounded-full bg-green-50 border-2 border-green-500 flex items-center justify-center mx-auto shadow-lg shadow-green-600/20"
          >
            <CheckCircle size={42} className="text-green-600" />
          </motion.div>

          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-green-50 text-green-700 border border-green-200">
              <ShieldCheck size={14} />
              शिकायत दर्ज (Report Registered)
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900">
              Grievance Submitted!
            </h1>
            <p className="text-sm text-navy-600 leading-relaxed max-w-xs mx-auto">
              Your civic complaint has been registered with GPS coordinates. Department engineers have been notified.
            </p>
          </div>

          <div className="pt-2 flex flex-col gap-3">
            <Link
              to="/dashboard"
              className="w-full py-3.5 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold shadow-lg shadow-green-600/25 transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2"
            >
              Track on Dashboard
            </Link>
            <Link
              to="/"
              className="w-full py-3.5 rounded-xl bg-navy-50 hover:bg-navy-100 text-navy-700 font-semibold border border-navy-200 transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-warm-50 text-navy-900 selection:bg-green-500/20 selection:text-green-900 relative overflow-hidden font-sans">
      {/* Background Ambience */}
      <div className="absolute inset-0 grid-texture opacity-40 pointer-events-none" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-green-500/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/10 blur-[140px] rounded-full pointer-events-none" />

      {/* Top Header */}
      <header className="relative z-10 p-4 sm:p-6 flex justify-between items-center max-w-4xl mx-auto">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-navy-600 hover:text-navy-900 transition-colors text-xs sm:text-sm font-semibold bg-white/70 backdrop-blur-md px-3.5 py-2 rounded-full border border-navy-200 shadow-xs"
        >
          <ArrowLeft size={16} />
          Back to Home
        </Link>

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-white p-0.5 shadow-sm border border-green-200 flex items-center justify-center">
            <img src="/jharkhand-logo.png" alt="Emblem" className="w-full h-full object-contain" />
          </div>
          <div>
            <h1 className="text-sm sm:text-base font-extrabold text-navy-900 leading-tight">
              Report a Civic Problem
            </h1>
            <p className="text-[10px] text-green-700 font-bold uppercase tracking-wider">
              झारखण्ड जनसमाधान पोर्टल
            </p>
          </div>
        </div>

        <div className="w-20" />
      </header>

      {/* Stepper Progress Bar */}
      <div className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6 mb-6">
        <div className="bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-navy-100 shadow-sm">
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="flex-1 flex items-center gap-2">
                <div
                  className={`h-2 flex-1 rounded-full transition-all duration-500 ${
                    s <= step
                      ? "bg-gradient-to-r from-green-600 to-emerald-500 shadow-xs"
                      : "bg-navy-100"
                  }`}
                />
              </div>
            ))}
          </div>

          <div className="flex justify-between mt-2.5 text-[11px] font-bold text-navy-400">
            <span className={step >= 1 ? "text-green-700 font-extrabold" : ""}>
              1. Category
            </span>
            <span className={step >= 2 ? "text-green-700 font-extrabold" : ""}>
              2. Details
            </span>
            <span className={step >= 3 ? "text-green-700 font-extrabold" : ""}>
              3. Map & Location
            </span>
            <span className={step >= 4 ? "text-green-700 font-extrabold" : ""}>
              4. Contact
            </span>
          </div>
        </div>
      </div>

      {/* Main Form Container */}
      <main className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6 pb-32">
        <div className="bg-white/90 backdrop-blur-xl border border-navy-100 rounded-3xl p-6 sm:p-8 shadow-xl shadow-navy-900/5">
          <AnimatePresence mode="wait">
            {/* Step 1: Category + Severity */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 25 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -25 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-navy-900">
                    Select Problem Category
                  </h2>
                  <p className="text-xs sm:text-sm text-navy-500 mt-1">
                    Choose the government department or issue type you want to report.
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {CATEGORIES.map((cat) => {
                    const Icon = cat.icon;
                    const active = form.category === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => update("category", cat.id)}
                        className={`relative group p-4 rounded-2xl border-2 transition-all duration-200 text-left cursor-pointer ${
                          active
                            ? "border-green-600 bg-green-50/70 shadow-md shadow-green-600/10 ring-2 ring-green-600/20"
                            : "border-navy-100 bg-white hover:border-green-300 hover:bg-green-50/20 shadow-2xs"
                        }`}
                      >
                        <div
                          className={`w-10 h-10 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center mb-3 shadow-xs`}
                        >
                          <Icon size={18} className="text-white" />
                        </div>
                        <p className={`text-xs font-bold leading-snug ${active ? "text-green-950" : "text-navy-900"}`}>
                          {cat.label}
                        </p>
                        {active && (
                          <div className="absolute top-2.5 right-2.5 w-5 h-5 bg-green-600 rounded-full flex items-center justify-center shadow-xs">
                            <Check size={12} className="text-white" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Severity Selector */}
                <div className="pt-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-navy-500 mb-2.5">
                    Urgency & Hazard Level
                  </h3>
                  <div className="grid grid-cols-3 gap-2.5">
                    {SEVERITY.map((s) => {
                      const isActive = form.severity === s.id;
                      return (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => update("severity", s.id)}
                          className={`py-3 rounded-xl border-2 text-xs font-bold transition-all ${
                            isActive ? s.activeBg : s.color
                          }`}
                        >
                          {s.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 2: Title + Description + Image */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 25 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -25 }}
                transition={{ duration: 0.25 }}
                className="space-y-5"
              >
                <div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-navy-900">
                    Describe the Issue
                  </h2>
                  <p className="text-xs sm:text-sm text-navy-500 mt-1">
                    Provide a concise title and details for the inspection officer.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-navy-600 uppercase tracking-wider">
                    Problem Title *
                  </label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => update("title", e.target.value)}
                    placeholder="e.g. Broken road surface with deep potholes near Sakchi roundabout"
                    className="w-full bg-white border border-navy-200 rounded-xl py-3 px-4 text-xs sm:text-sm text-navy-900 placeholder:text-navy-400 focus:outline-none focus:ring-2 focus:ring-green-500/40 focus:border-green-600 shadow-2xs font-medium transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-navy-600 uppercase tracking-wider">
                    Detailed Description *
                  </label>
                  <textarea
                    value={form.description}
                    onChange={(e) => update("description", e.target.value)}
                    placeholder="Describe how this problem is affecting public safety, since when it started, etc."
                    rows={4}
                    className="w-full bg-white border border-navy-200 rounded-xl py-3 px-4 text-xs sm:text-sm text-navy-900 placeholder:text-navy-400 focus:outline-none focus:ring-2 focus:ring-green-500/40 focus:border-green-600 shadow-2xs font-medium transition-all resize-none"
                  />
                </div>

                {/* Photo Upload Box */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-navy-600 uppercase tracking-wider">
                    Attach Photo / Evidence (Optional)
                  </label>
                  <div
                    className="relative border-2 border-dashed border-navy-200 rounded-2xl overflow-hidden hover:border-green-500 bg-navy-50/40 hover:bg-green-50/20 transition-all cursor-pointer"
                    onClick={() => document.getElementById("image-upload").click()}
                  >
                    {form.imagePreview ? (
                      <div className="relative">
                        <img
                          src={form.imagePreview}
                          alt="Preview"
                          className="w-full h-44 object-cover"
                        />
                        <div className="absolute inset-0 bg-navy-950/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                          <p className="text-xs font-bold text-white bg-green-600 px-3 py-1.5 rounded-lg shadow-md">
                            Click to change photo
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-10 text-navy-500">
                        <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-700 mb-2.5">
                          <Upload size={22} />
                        </div>
                        <p className="text-xs font-bold text-navy-800">
                          Click to upload site photograph
                        </p>
                        <p className="text-[11px] text-navy-400 mt-0.5">
                          Supports JPG, PNG up to 10MB
                        </p>
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

            {/* Step 3: Interactive Location Map & Address */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 25 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -25 }}
                transition={{ duration: 0.25 }}
                className="space-y-5"
              >
                <div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-navy-900">
                    Pin Location on Map
                  </h2>
                  <p className="text-xs sm:text-sm text-navy-500 mt-1">
                    Use GPS, search landmark, or tap directly on the map to place the pin.
                  </p>
                </div>

                {/* Interactive Location Picker Map Component */}
                <LocationPicker
                  initialLat={form.lat || 23.3441}
                  initialLng={form.lng || 85.3096}
                  initialAddress={form.address}
                  initialPincode={form.pincode}
                  onLocationChange={({ lat, lng, address, pincode }) => {
                    update("lat", lat);
                    update("lng", lng);
                    if (address) update("address", address);
                    if (pincode) update("pincode", pincode);
                  }}
                />

                <div className="flex items-center gap-3 pt-1">
                  <div className="flex-1 h-px bg-navy-200" />
                  <span className="text-[11px] text-navy-500 uppercase tracking-wider font-bold">
                    Confirm Address Fields
                  </span>
                  <div className="flex-1 h-px bg-navy-200" />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-navy-600 uppercase tracking-wider">
                    Full Address / Landmark *
                  </label>
                  <input
                    type="text"
                    value={form.address}
                    onChange={(e) => update("address", e.target.value)}
                    placeholder="e.g. Near Tata Stadium, Sakchi, Jamshedpur"
                    className="w-full bg-white border border-navy-200 rounded-xl py-3 px-4 text-xs sm:text-sm text-navy-900 placeholder:text-navy-400 focus:outline-none focus:ring-2 focus:ring-green-500/40 focus:border-green-600 shadow-2xs font-medium"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-navy-600 uppercase tracking-wider">
                    Pincode
                  </label>
                  <input
                    type="text"
                    value={form.pincode}
                    onChange={(e) => update("pincode", e.target.value)}
                    placeholder="e.g. 831001"
                    maxLength={6}
                    className="w-full bg-white border border-navy-200 rounded-xl py-3 px-4 text-xs sm:text-sm text-navy-900 placeholder:text-navy-400 focus:outline-none focus:ring-2 focus:ring-green-500/40 focus:border-green-600 shadow-2xs font-medium"
                  />
                </div>
              </motion.div>
            )}

            {/* Step 4: Contact Details & Summary */}
            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 25 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -25 }}
                transition={{ duration: 0.25 }}
                className="space-y-5"
              >
                <div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-navy-900">
                    Contact & Review
                  </h2>
                  <p className="text-xs sm:text-sm text-navy-500 mt-1">
                    Provide contact details so municipal officers can coordinate resolution.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-navy-600 uppercase tracking-wider">
                    Citizen Full Name *
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => update("name", e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full bg-white border border-navy-200 rounded-xl py-3 px-4 text-xs sm:text-sm text-navy-900 placeholder:text-navy-400 focus:outline-none focus:ring-2 focus:ring-green-500/40 focus:border-green-600 shadow-2xs font-medium"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-navy-600 uppercase tracking-wider">
                    Phone Number (10 Digits) *
                  </label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => update("phone", e.target.value)}
                    placeholder="e.g. 9876543210"
                    className="w-full bg-white border border-navy-200 rounded-xl py-3 px-4 text-xs sm:text-sm text-navy-900 placeholder:text-navy-400 focus:outline-none focus:ring-2 focus:ring-green-500/40 focus:border-green-600 shadow-2xs font-medium"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-navy-600 uppercase tracking-wider">
                    Email Address (Optional)
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => update("email", e.target.value)}
                    placeholder="e.g. rahul@example.com"
                    className="w-full bg-white border border-navy-200 rounded-xl py-3 px-4 text-xs sm:text-sm text-navy-900 placeholder:text-navy-400 focus:outline-none focus:ring-2 focus:ring-green-500/40 focus:border-green-600 shadow-2xs font-medium"
                  />
                </div>

                {/* Final Summary Card */}
                <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-4 sm:p-5 space-y-3 mt-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-950 flex items-center gap-1.5">
                    <ShieldCheck size={15} className="text-emerald-700" />
                    Report Overview & Coordinates
                  </h3>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <p className="text-emerald-800 font-medium">Department:</p>
                      <p className="font-bold text-navy-900">{form.category || "—"}</p>
                    </div>
                    <div>
                      <p className="text-emerald-800 font-medium">Priority:</p>
                      <p className="font-bold text-navy-900">{form.severity}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-emerald-800 font-medium">Title:</p>
                      <p className="font-bold text-navy-900 truncate">{form.title || "—"}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-emerald-800 font-medium">Location:</p>
                      <p className="font-bold text-navy-900 truncate">{form.address || "—"}</p>
                      <p className="text-[10px] font-mono text-emerald-700 mt-0.5">
                        GPS: {form.lat?.toFixed(5)}°N, {form.lng?.toFixed(5)}°E
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Sticky Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-navy-100 p-3.5 sm:p-4 z-20 shadow-lg">
        <div className="max-w-2xl mx-auto flex gap-3">
          {step > 1 && (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="px-5 sm:px-6 py-3 rounded-xl bg-navy-50 hover:bg-navy-100 text-navy-700 font-bold text-xs sm:text-sm border border-navy-200 transition-colors"
            >
              Back
            </button>
          )}

          {step < 4 ? (
            <button
              type="button"
              onClick={() => canNext() && setStep(step + 1)}
              disabled={!canNext()}
              className={`flex-1 py-3 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 ${
                canNext()
                  ? "bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-600/25 active:scale-98 cursor-pointer"
                  : "bg-navy-100 text-navy-400 cursor-not-allowed"
              }`}
            >
              Continue to Step {step + 1}
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!canNext() || loading}
              className={`flex-1 py-3 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 ${
                canNext() && !loading
                  ? "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg shadow-green-600/30 active:scale-98 cursor-pointer"
                  : "bg-navy-100 text-navy-400 cursor-not-allowed"
              }`}
            >
              <Send size={15} />
              <span>{loading ? "Submitting Grievance..." : "Submit Civic Report"}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
