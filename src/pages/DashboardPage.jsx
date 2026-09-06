import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import gsap from "gsap";
import {
  ArrowLeft,
  FileText,
  Clock,
  Loader,
  CheckCircle,
  AlertTriangle,
  MapPin,
  Calendar,
  ChevronRight,
  Plus,
  BarChart3,
  Construction,
  Droplets,
  GraduationCap,
  Trash2,
  HeartPulse,
  Zap,
  Leaf,
  Wheat,
  LogOut,
  ExternalLink,
  Camera,
} from "lucide-react";

const CATEGORY_ICONS = {
  "Roads & Infrastructure": Construction,
  Water: Droplets,
  Education: GraduationCap,
  Sanitation: Trash2,
  Healthcare: HeartPulse,
  Electricity: Zap,
  Environment: Leaf,
  Agriculture: Wheat,
};

const STATUS_CONFIG = {
  Pending: {
    color: "bg-yellow-50 text-yellow-700 border-yellow-200",
    icon: Clock,
    dotColor: "bg-yellow-500",
  },
  "In Progress": {
    color: "bg-blue-50 text-blue-700 border-blue-200",
    icon: Loader,
    dotColor: "bg-blue-500",
  },
  Resolved: {
    color: "bg-green-50 text-green-700 border-green-200",
    icon: CheckCircle,
    dotColor: "bg-green-500",
  },
};

const SEVERITY_COLORS = {
  Low: "text-green-600",
  Medium: "text-yellow-600",
  High: "text-red-600",
};

export function DashboardPage() {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, inProgress: 0, resolved: 0 });
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null);
  const [filter, setFilter] = useState("All");

  const containerRef = useRef(null);
  const listRef = useRef(null);

  const token = localStorage.getItem("token");
  const userName = localStorage.getItem("userName") || "User";

  useEffect(() => {
    if (!token) {
      navigate("/auth");
      return;
    }
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [reportsRes, statsRes] = await Promise.all([
        fetch("http://localhost:5000/api/reports/my", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("http://localhost:5000/api/reports/stats", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      if (reportsRes.ok) {
        const data = await reportsRes.json();
        setReports(data);
      }
      if (statsRes.ok) {
        const data = await statsRes.json();
        setStats(data);
      }
    } catch {
      console.error("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!loading && containerRef.current) {
      let ctx = gsap.context(() => {
        gsap.from(".stat-card", {
          y: 30,
          opacity: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: "power3.out",
        });
      }, containerRef);
      return () => ctx.revert();
    }
  }, [loading]);

  useEffect(() => {
    if (!loading && listRef.current) {
      let ctx = gsap.context(() => {
        gsap.fromTo(
          ".report-item",
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, stagger: 0.05, ease: "power2.out" }
        );
      }, listRef);
      return () => ctx.revert();
    }
  }, [loading, filter]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    navigate("/");
  };

  const filteredReports =
    filter === "All" ? reports : reports.filter((r) => r.status === filter);

  const statCards = [
    { label: "Total Reports", value: stats.total, icon: FileText, color: "text-navy-600 bg-navy-50", border: "border-navy-100" },
    { label: "Pending", value: stats.pending, icon: Clock, color: "text-saffron-600 bg-saffron-50", border: "border-saffron-100" },
    { label: "In Progress", value: stats.inProgress, icon: Loader, color: "text-blue-600 bg-blue-50", border: "border-blue-100" },
    { label: "Resolved", value: stats.resolved, icon: CheckCircle, color: "text-green-600 bg-green-50", border: "border-green-100" },
  ];

  const handleExpand = (id) => {
    const isExpanding = selectedReport !== id;
    setSelectedReport(isExpanding ? id : null);
    
    if (isExpanding) {
      setTimeout(() => {
        gsap.fromTo(
          `#details-${id}`,
          { height: 0, opacity: 0 },
          { height: "auto", opacity: 1, duration: 0.4, ease: "power2.out" }
        );
      }, 10);
    }
  };

  return (
    <div className="min-h-screen bg-warm-50 text-navy-900 relative selection:bg-green-500/20 selection:text-green-900" ref={containerRef}>
      {/* Background Texture */}
      <div className="absolute inset-0 grid-texture opacity-50" />
      <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-green-50 to-transparent opacity-50 pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 bg-white/80 backdrop-blur-xl border-b border-navy-100 shadow-sm sticky top-0">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="w-10 h-10 rounded-full flex items-center justify-center bg-navy-50 text-navy-600 hover:bg-navy-100 transition-colors"
            >
              <ArrowLeft size={18} />
            </Link>
            <div>
              <h1 className="text-xl font-bold text-navy-900 tracking-tight">Dashboard</h1>
              <p className="text-sm text-navy-500 font-medium">Welcome back, {userName}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/report"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-green-600 hover:bg-green-700 text-white text-sm font-semibold shadow-lg shadow-green-600/20 transition-all hover:-translate-y-0.5"
            >
              <Plus size={18} />
              <span className="hidden sm:inline">New Report</span>
            </Link>
            <button
              onClick={handleLogout}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
              title="Logout"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {statCards.map((card, i) => {
            const Icon = card.icon;
            return (
              <div
                key={card.label}
                className={`stat-card relative overflow-hidden rounded-2xl bg-white border ${card.border} shadow-sm p-6 hover:shadow-md transition-shadow`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-navy-500 font-semibold">{card.label}</p>
                    <p className="text-3xl font-bold text-navy-900 mt-2">{card.value}</p>
                  </div>
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${card.color}`}>
                    <Icon size={24} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Filter Tabs & Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-lg font-bold text-navy-900">Your Reports</h2>
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 hide-scrollbar">
            {["All", "Pending", "In Progress", "Resolved"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all whitespace-nowrap ${
                  filter === f
                    ? "bg-navy-900 text-white shadow-md shadow-navy-900/20"
                    : "bg-white text-navy-600 hover:bg-navy-50 border border-navy-200"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Reports List */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-4">
            <Loader size={36} className="text-green-600 animate-spin" />
            <p className="text-navy-500 font-medium">Loading your reports...</p>
          </div>
        ) : filteredReports.length === 0 ? (
          <div className="text-center py-24 px-4 bg-white rounded-3xl border border-navy-100 shadow-sm">
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600">
              <FileText size={32} />
            </div>
            <h3 className="text-2xl font-bold text-navy-900 mb-2">No Reports Found</h3>
            <p className="text-navy-500 max-w-sm mx-auto mb-8">
              {filter === "All" 
                ? "You haven't submitted any reports yet. Be the voice of your community."
                : `You don't have any ${filter.toLowerCase()} reports at the moment.`}
            </p>
            {filter === "All" && (
              <Link
                to="/report"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-green-600 hover:bg-green-700 text-white font-bold shadow-lg shadow-green-600/20 transition-all hover:-translate-y-1"
              >
                <Plus size={18} />
                Submit a Report
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-4" ref={listRef}>
            {filteredReports.map((report) => {
              const statusConf = STATUS_CONFIG[report.status] || STATUS_CONFIG.Pending;
              const StatusIcon = statusConf.icon;
              const CatIcon = CATEGORY_ICONS[report.category] || FileText;
              const expanded = selectedReport === report._id;

              return (
                <div
                  key={report._id}
                  className="report-item bg-white border border-navy-100 rounded-2xl overflow-hidden hover:border-navy-200 hover:shadow-md transition-all duration-300"
                >
                  {/* Main Row */}
                  <button
                    onClick={() => handleExpand(report._id)}
                    className="w-full px-5 py-5 sm:px-6 flex items-center gap-4 sm:gap-6 text-left focus:outline-none"
                  >
                    {/* Category Icon */}
                    <div className="w-12 h-12 rounded-full bg-navy-50 flex items-center justify-center shrink-0 text-navy-600">
                      <CatIcon size={22} />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-navy-900 text-base truncate pr-4">{report.title}</h3>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-1.5 text-sm text-navy-500">
                        <span className="flex items-center gap-1.5 font-medium">
                          <Calendar size={14} className="text-navy-400" />
                          {new Date(report.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                        <span className={`flex items-center gap-1.5 font-medium ${SEVERITY_COLORS[report.severity] || ""}`}>
                          <AlertTriangle size={14} />
                          {report.severity} Severity
                        </span>
                      </div>
                    </div>

                    {/* Attached Photo Thumbnail */}
                    {report.imageUrl && (
                      <div className="hidden md:block w-11 h-11 rounded-xl overflow-hidden border border-navy-200 shrink-0 shadow-2xs">
                        <img src={report.imageUrl} alt="Thumbnail" className="w-full h-full object-cover" />
                      </div>
                    )}

                    {/* Status Badge */}
                    <div className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-sm font-bold shrink-0 bg-white">
                      <div className={`w-2 h-2 rounded-full ${statusConf.dotColor}`} />
                      <span className="text-navy-900">{report.status}</span>
                    </div>

                    <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-navy-50 text-navy-500 transition-transform duration-300 ${expanded ? "rotate-90 bg-navy-100" : ""}`}>
                      <ChevronRight size={18} />
                    </div>
                  </button>

                  {/* Mobile Status Badge (shown on small screens below the title) */}
                  <div className="px-5 pb-4 sm:hidden">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-navy-100 w-fit text-xs font-bold bg-navy-50">
                      <div className={`w-2 h-2 rounded-full ${statusConf.dotColor}`} />
                      <span className="text-navy-700">{report.status}</span>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {expanded && (
                    <div id={`details-${report._id}`} className="overflow-hidden bg-navy-50/50 border-t border-navy-100">
                      <div className="px-5 sm:px-6 py-6 space-y-6">
                        <div>
                          <p className="text-xs font-bold text-navy-400 uppercase tracking-wider mb-2">Description</p>
                          <p className="text-navy-700 leading-relaxed text-sm">{report.description}</p>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          <div className="bg-white rounded-xl p-4 border border-navy-100 shadow-sm">
                            <p className="text-xs font-bold text-navy-400 uppercase tracking-wider mb-1">Category</p>
                            <p className="font-semibold text-navy-900 flex items-center gap-2">
                              <CatIcon size={16} className="text-navy-500" />
                              {report.category}
                            </p>
                          </div>
                          <div className="bg-white rounded-xl p-4 border border-navy-100 shadow-sm">
                            <p className="text-xs font-bold text-navy-400 uppercase tracking-wider mb-1">Location</p>
                            <p className="font-semibold text-navy-900 flex items-start gap-2">
                              <MapPin size={16} className="text-red-500 shrink-0 mt-0.5" />
                              <span className="line-clamp-2">{report.location?.address || "Not provided"}</span>
                            </p>
                            {report.location?.lat && report.location?.lng && (
                              <a
                                href={`https://www.google.com/maps?q=${report.location.lat},${report.location.lng}`}
                                target="_blank"
                                rel="noreferrer"
                                className="mt-2.5 inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-lg border border-emerald-200 transition-all shadow-2xs"
                              >
                                <ExternalLink size={11} />
                                View on Map ({report.location.lat.toFixed(4)}°, {report.location.lng.toFixed(4)}°)
                              </a>
                            )}
                          </div>
                          <div className="bg-white rounded-xl p-4 border border-navy-100 shadow-sm">
                            <p className="text-xs font-bold text-navy-400 uppercase tracking-wider mb-1">Pincode</p>
                            <p className="font-semibold text-navy-900">
                              {report.location?.pincode || "—"}
                            </p>
                          </div>
                          
                          {report.contactDetails && (
                            <div className="sm:col-span-2 lg:col-span-3 bg-white rounded-xl p-4 border border-navy-100 shadow-sm">
                              <p className="text-xs font-bold text-navy-400 uppercase tracking-wider mb-3">Contact Information</p>
                              <div className="flex flex-wrap gap-x-8 gap-y-3 text-sm">
                                <p className="flex items-center gap-2">
                                  <span className="text-navy-500">Name:</span> 
                                  <span className="font-semibold text-navy-900">{report.contactDetails.name}</span>
                                </p>
                                <p className="flex items-center gap-2">
                                  <span className="text-navy-500">Phone:</span> 
                                  <span className="font-semibold text-navy-900">{report.contactDetails.phone}</span>
                                </p>
                                {report.contactDetails.email && (
                                  <p className="flex items-center gap-2">
                                    <span className="text-navy-500">Email:</span> 
                                    <span className="font-semibold text-navy-900">{report.contactDetails.email}</span>
                                  </p>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Attached Photo / Evidence */}
                          {report.imageUrl && (
                            <div className="sm:col-span-2 lg:col-span-3 bg-white rounded-xl p-4 border border-navy-100 shadow-sm">
                              <p className="text-xs font-bold text-navy-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                                <Camera size={14} className="text-emerald-600" />
                                Attached Site Photograph / Evidence
                              </p>
                              <div className="relative group rounded-xl overflow-hidden border border-navy-100 max-w-sm sm:max-w-md bg-navy-50">
                                <img
                                  src={report.imageUrl}
                                  alt="Report Evidence"
                                  className="w-full h-48 sm:h-60 object-cover rounded-xl transition-transform duration-300 group-hover:scale-[1.02] cursor-pointer"
                                  onClick={() => window.open(report.imageUrl, '_blank')}
                                />
                                <div className="absolute bottom-2.5 right-2.5 bg-navy-950/80 backdrop-blur-xs text-white text-[10px] font-semibold px-2.5 py-1 rounded-lg pointer-events-none shadow-sm">
                                  Click to view full photo
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Status Timeline */}
                        <div className="pt-4 border-t border-navy-100">
                          <p className="text-xs font-bold text-navy-400 uppercase tracking-wider mb-4">Status Progress</p>
                          <div className="relative">
                            <div className="absolute top-1/2 left-0 w-full h-1 bg-navy-100 -translate-y-1/2 rounded-full" />
                            <div 
                              className="absolute top-1/2 left-0 h-1 bg-green-500 -translate-y-1/2 rounded-full transition-all duration-500" 
                              style={{ 
                                width: report.status === 'Resolved' ? '100%' : 
                                       report.status === 'In Progress' ? '50%' : '0%' 
                              }}
                            />
                            
                            <div className="relative flex justify-between">
                              {["Pending", "In Progress", "Resolved"].map((s, idx) => {
                                const isActive =
                                  s === "Pending" ||
                                  (s === "In Progress" && (report.status === "In Progress" || report.status === "Resolved")) ||
                                  (s === "Resolved" && report.status === "Resolved");
                                
                                const isCurrent = report.status === s;
                                const conf = STATUS_CONFIG[s];
                                const I = conf.icon;

                                return (
                                  <div key={s} className="flex flex-col items-center relative z-10 w-20">
                                    <div
                                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                                        isActive
                                          ? isCurrent 
                                            ? `${conf.color} border-2 ring-4 ring-white` 
                                            : "bg-green-500 text-white border-2 border-white ring-4 ring-white"
                                          : "bg-white text-navy-300 border-2 border-navy-200"
                                      }`}
                                    >
                                      {isActive && !isCurrent && s !== 'Pending' ? <CheckCircle size={18} /> : <I size={18} />}
                                    </div>
                                    <span className={`mt-3 text-xs font-bold text-center ${
                                      isCurrent ? "text-navy-900" : isActive ? "text-navy-700" : "text-navy-400"
                                    }`}>
                                      {s}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
