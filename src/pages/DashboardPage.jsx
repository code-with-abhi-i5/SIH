import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
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
    color: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
    icon: Clock,
    dotColor: "bg-yellow-400",
  },
  "In Progress": {
    color: "bg-blue-500/10 text-blue-400 border-blue-500/30",
    icon: Loader,
    dotColor: "bg-blue-400",
  },
  Resolved: {
    color: "bg-green-500/10 text-green-400 border-green-500/30",
    icon: CheckCircle,
    dotColor: "bg-green-400",
  },
};

const SEVERITY_COLORS = {
  Low: "text-green-400",
  Medium: "text-yellow-400",
  High: "text-red-400",
};

export function DashboardPage() {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, inProgress: 0, resolved: 0 });
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null);
  const [filter, setFilter] = useState("All");

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

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    navigate("/");
  };

  const filteredReports =
    filter === "All" ? reports : reports.filter((r) => r.status === filter);

  const statCards = [
    { label: "Total", value: stats.total, icon: FileText, color: "from-navy-600 to-navy-800", border: "border-navy-600/30" },
    { label: "Pending", value: stats.pending, icon: Clock, color: "from-yellow-600 to-yellow-800", border: "border-yellow-600/30" },
    { label: "In Progress", value: stats.inProgress, icon: Loader, color: "from-blue-600 to-blue-800", border: "border-blue-600/30" },
    { label: "Resolved", value: stats.resolved, icon: CheckCircle, color: "from-green-600 to-green-800", border: "border-green-600/30" },
  ];

  return (
    <div className="min-h-screen bg-navy-950 text-white relative">
      {/* Background */}
      <div className="absolute inset-0 grid-texture opacity-[0.02]" />

      {/* Header */}
      <header className="relative z-10 bg-navy-900/50 backdrop-blur-lg border-b border-navy-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="text-navy-400 hover:text-white transition-colors"
            >
              <ArrowLeft size={20} />
            </Link>
            <div>
              <h1 className="text-lg font-extrabold">Dashboard</h1>
              <p className="text-xs text-navy-400">Welcome, {userName}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/report"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-saffron-500 to-saffron-600 text-white text-sm font-bold shadow-lg shadow-saffron-500/20 hover:shadow-saffron-500/40 transition-all"
            >
              <Plus size={16} />
              <span className="hidden sm:inline">New Report</span>
            </Link>
            <button
              onClick={handleLogout}
              className="p-2.5 rounded-xl bg-navy-800 text-navy-400 hover:text-red-400 hover:bg-navy-700 transition-all border border-navy-700"
              title="Logout"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {statCards.map((card, i) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`relative overflow-hidden rounded-2xl border ${card.border} bg-navy-900/40 backdrop-blur-sm p-5`}
              >
                <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${card.color} opacity-10 blur-2xl rounded-full -translate-y-4 translate-x-4`} />
                <div className="relative">
                  <Icon size={18} className="text-navy-400 mb-3" />
                  <p className="text-3xl font-extrabold text-white">{card.value}</p>
                  <p className="text-xs text-navy-400 font-semibold uppercase tracking-wider mt-1">{card.label}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {["All", "Pending", "In Progress", "Resolved"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                filter === f
                  ? "bg-saffron-500 text-white shadow-lg shadow-saffron-500/20"
                  : "bg-navy-800 text-navy-400 hover:text-white hover:bg-navy-700 border border-navy-700"
              }`}
            >
              {f}
            </button>
          ))}
          <div className="ml-auto text-xs text-navy-500">
            {filteredReports.length} report{filteredReports.length !== 1 ? "s" : ""}
          </div>
        </div>

        {/* Reports List */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader size={32} className="text-saffron-400 animate-spin" />
          </div>
        ) : filteredReports.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 space-y-4"
          >
            <div className="w-16 h-16 bg-navy-800 rounded-2xl flex items-center justify-center mx-auto border border-navy-700">
              <BarChart3 size={28} className="text-navy-500" />
            </div>
            <h3 className="text-xl font-bold text-navy-300">No Reports Yet</h3>
            <p className="text-sm text-navy-500 max-w-sm mx-auto">
              Start by reporting a problem in your community. Your voice can make a difference!
            </p>
            <Link
              to="/report"
              className="inline-flex items-center gap-2 mt-4 px-6 py-3 rounded-xl bg-saffron-500 text-white font-bold hover:bg-saffron-600 transition-colors"
            >
              <Plus size={16} />
              Report First Problem
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-3">
            {filteredReports.map((report, i) => {
              const statusConf = STATUS_CONFIG[report.status] || STATUS_CONFIG.Pending;
              const StatusIcon = statusConf.icon;
              const CatIcon = CATEGORY_ICONS[report.category] || FileText;
              const expanded = selectedReport === report._id;

              return (
                <motion.div
                  key={report._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-navy-900/40 backdrop-blur-sm border border-navy-800 rounded-2xl overflow-hidden hover:border-navy-700 transition-all"
                >
                  {/* Main Row */}
                  <button
                    onClick={() => setSelectedReport(expanded ? null : report._id)}
                    className="w-full px-5 py-4 flex items-center gap-4 text-left"
                  >
                    {/* Category Icon */}
                    <div className="w-10 h-10 rounded-xl bg-navy-800 border border-navy-700 flex items-center justify-center shrink-0">
                      <CatIcon size={18} className="text-saffron-400" />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-white text-sm truncate">{report.title}</h3>
                      <div className="flex items-center gap-3 mt-1 text-xs text-navy-400">
                        <span className="flex items-center gap-1">
                          <Calendar size={10} />
                          {new Date(report.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                        <span className={SEVERITY_COLORS[report.severity] || ""}>
                          <AlertTriangle size={10} className="inline mr-0.5" />
                          {report.severity}
                        </span>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold shrink-0 ${statusConf.color}`}
                    >
                      <div className={`w-1.5 h-1.5 rounded-full ${statusConf.dotColor}`} />
                      {report.status}
                    </div>

                    <ChevronRight
                      size={16}
                      className={`text-navy-600 transition-transform ${expanded ? "rotate-90" : ""}`}
                    />
                  </button>

                  {/* Expanded Details */}
                  {expanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="px-5 pb-5 border-t border-navy-800"
                    >
                      <div className="pt-4 space-y-4">
                        <div>
                          <p className="text-[10px] font-bold text-navy-500 uppercase tracking-widest mb-1">Description</p>
                          <p className="text-sm text-navy-200 leading-relaxed">{report.description}</p>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                          <div className="bg-navy-800/50 rounded-xl p-3">
                            <p className="text-[10px] font-bold text-navy-500 uppercase tracking-widest">Category</p>
                            <p className="text-sm font-semibold text-white mt-1">{report.category}</p>
                          </div>
                          <div className="bg-navy-800/50 rounded-xl p-3">
                            <p className="text-[10px] font-bold text-navy-500 uppercase tracking-widest">Location</p>
                            <p className="text-sm font-semibold text-white mt-1 flex items-center gap-1">
                              <MapPin size={12} />
                              {report.location?.address || "Not provided"}
                            </p>
                          </div>
                          <div className="bg-navy-800/50 rounded-xl p-3">
                            <p className="text-[10px] font-bold text-navy-500 uppercase tracking-widest">Pincode</p>
                            <p className="text-sm font-semibold text-white mt-1">
                              {report.location?.pincode || "—"}
                            </p>
                          </div>
                        </div>

                        {/* Status Timeline */}
                        <div>
                          <p className="text-[10px] font-bold text-navy-500 uppercase tracking-widest mb-3">Status Timeline</p>
                          <div className="flex items-center gap-2">
                            {["Pending", "In Progress", "Resolved"].map((s, idx) => {
                              const isActive =
                                s === "Pending" ||
                                (s === "In Progress" && (report.status === "In Progress" || report.status === "Resolved")) ||
                                (s === "Resolved" && report.status === "Resolved");
                              const conf = STATUS_CONFIG[s];
                              return (
                                <div key={s} className="flex items-center gap-2 flex-1">
                                  <div
                                    className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${
                                      isActive
                                        ? `${conf.color} border-current`
                                        : "border-navy-700 text-navy-700"
                                    }`}
                                  >
                                    {(() => {
                                      const I = conf.icon;
                                      return <I size={14} />;
                                    })()}
                                  </div>
                                  {idx < 2 && (
                                    <div
                                      className={`flex-1 h-0.5 rounded-full ${
                                        isActive ? "bg-gradient-to-r from-current to-navy-700" : "bg-navy-800"
                                      }`}
                                    />
                                  )}
                                </div>
                              );
                            })}
                          </div>
                          <div className="flex justify-between mt-2 text-[9px] uppercase tracking-widest font-semibold text-navy-500">
                            <span>Pending</span>
                            <span>In Progress</span>
                            <span>Resolved</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
