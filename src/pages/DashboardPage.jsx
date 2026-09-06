import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  User,
  GraduationCap,
  ShieldCheck,
  Building,
  Briefcase,
  Sparkles,
  TrendingUp,
  Award,
  AlertTriangle,
  CheckCircle,
  Clock,
  MapPin,
  ExternalLink,
  PlusCircle,
  Flame,
  Building2,
  DollarSign,
  ChevronRight,
  RefreshCw,
  LogOut,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { useAuth, ROLES, ROLE_LABELS } from "../contexts/AuthContext";
import { api } from "../services/api";
import { CertificateModal } from "../components/ui/CertificateModal";

export function DashboardPage() {
  const { user, role, switchDemoRole, logout } = useAuth();
  const navigate = useNavigate();

  const [metrics, setMetrics] = useState({
    totalChallenges: 142,
    resolvedChallenges: 38,
    inProgressChallenges: 64,
    activeProposals: 51,
    participatingInstitutions: 14,
    resolutionRate: "26.8",
  });
  const [categoryStats, setCategoryStats] = useState([]);
  const [districtStats, setDistrictStats] = useState([]);
  const [myChallenges, setMyChallenges] = useState([]);
  const [myProposals, setMyProposals] = useState([]);
  const [hotspots, setHotspots] = useState([]);
  const [loading, setLoading] = useState(true);

  // Certificate Modal State
  const [activeCert, setActiveCert] = useState(null);
  const [showCertModal, setShowCertModal] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, [role]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [dashRes, chalRes, propRes, hotRes] = await Promise.all([
        api.analytics.getDashboard().catch(() => ({})),
        api.challenges.getAll().catch(() => ({ challenges: [] })),
        api.proposals.getAll().catch(() => ({ proposals: [] })),
        api.analytics.getHotspots().catch(() => ({ hotspots: [] })),
      ]);

      if (dashRes && dashRes.metrics) {
        setMetrics(dashRes.metrics);
        setCategoryStats(dashRes.categoryStats || []);
        setDistrictStats(dashRes.districtStats || []);
      }

      setMyChallenges(chalRes.challenges || []);
      setMyProposals(propRes.proposals || []);
      setHotspots(hotRes.hotspots || []);
    } catch (err) {
      console.warn("Using local dashboard state:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCert = (cert) => {
    setActiveCert(cert);
    setShowCertModal(true);
  };

  return (
    <div className="min-h-screen bg-warm-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Top Switch Persona Bar for Live Evaluation / Demo */}
        <div className="bg-gradient-to-r from-navy-950 via-navy-900 to-navy-800 rounded-2xl p-6 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400 font-bold text-xl">
              {(user?.name || "User")[0].toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold">{user?.name || "Aman Kumar"}</h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-400 text-navy-950 uppercase">
                  {role}
                </span>
              </div>
              <p className="text-xs text-navy-300 mt-0.5">
                {user?.organization || "Ranchi University / Hub"} • District: {user?.district || "Ranchi"}
              </p>
            </div>
          </div>

          {/* Quick Demo Persona Switcher */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full md:w-auto">
            <span className="text-[11px] uppercase font-bold text-navy-300">Switch Persona:</span>
            <div className="flex items-center gap-1 bg-navy-800/80 p-1 rounded-xl border border-navy-700 overflow-x-auto max-w-full">
              {[
                { id: ROLES.CITIZEN, label: "Citizen" },
                { id: ROLES.STUDENT, label: "Student" },
                { id: ROLES.FACULTY, label: "Faculty" },
                { id: ROLES.INDUSTRY, label: "CSR Partner" },
                { id: ROLES.ADMIN, label: "Govt Admin" },
              ].map((r) => (
                <button
                  key={r.id}
                  onClick={() => switchDemoRole(r.id)}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                    role === r.id ? "bg-amber-400 text-navy-950 shadow-sm" : "text-navy-300 hover:text-white"
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Global State KPI Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="bg-white p-4 rounded-xl border border-navy-100 shadow-sm">
            <span className="text-[10px] uppercase font-bold text-navy-400">Total Reported</span>
            <h4 className="text-xl font-black text-navy-950 mt-1">{metrics.totalChallenges}</h4>
          </div>
          <div className="bg-white p-4 rounded-xl border border-navy-100 shadow-sm">
            <span className="text-[10px] uppercase font-bold text-green-600">Resolved Issues</span>
            <h4 className="text-xl font-black text-green-600 mt-1">{metrics.resolvedChallenges}</h4>
          </div>
          <div className="bg-white p-4 rounded-xl border border-navy-100 shadow-sm">
            <span className="text-[10px] uppercase font-bold text-amber-600">In-Progress</span>
            <h4 className="text-xl font-black text-amber-600 mt-1">{metrics.inProgressChallenges}</h4>
          </div>
          <div className="bg-white p-4 rounded-xl border border-navy-100 shadow-sm">
            <span className="text-[10px] uppercase font-bold text-navy-400">Student Proposals</span>
            <h4 className="text-xl font-black text-navy-950 mt-1">{metrics.activeProposals}</h4>
          </div>
          <div className="bg-white p-4 rounded-xl border border-navy-100 shadow-sm">
            <span className="text-[10px] uppercase font-bold text-navy-400">Universities Active</span>
            <h4 className="text-xl font-black text-navy-950 mt-1">{metrics.participatingInstitutions}</h4>
          </div>
          <div className="bg-white p-4 rounded-xl border border-navy-100 shadow-sm">
            <span className="text-[10px] uppercase font-bold text-navy-400">Resolution Rate</span>
            <h4 className="text-xl font-black text-blue-600 mt-1">{metrics.resolutionRate}%</h4>
          </div>
        </div>

        {/* ──────────────────────────────────────────────────────────
            ROLE-ADAPTIVE VIEWS
        ────────────────────────────────────────────────────────── */}

        {/* 1. CITIZEN / PANCHAYAT VIEW */}
        {role === ROLES.CITIZEN && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-navy-950 flex items-center gap-2">
                <User className="w-5 h-5 text-amber-600" /> My Reported Challenges & Resolutions
              </h2>
              <Link to="/report">
                <Button size="sm" className="bg-amber-600 hover:bg-amber-700 text-white text-xs">
                  <PlusCircle className="w-4 h-4 mr-1" /> Report New Issue
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {myChallenges.slice(0, 4).map((c) => (
                <div key={c._id} className="bg-white rounded-2xl p-6 border border-navy-100 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-navy-100 text-navy-800">
                      {c.category}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
                      Urgency: {c.aiUrgencyScore || 88}/100
                    </span>
                  </div>

                  <h3 className="font-bold text-navy-950 text-base">{c.title}</h3>
                  <p className="text-xs text-navy-600 line-clamp-2">{c.description}</p>

                  <div className="pt-3 border-t border-navy-100 flex items-center justify-between text-xs">
                    <span className="text-navy-500 font-medium">📍 {c.location?.district || "Ranchi"}</span>
                    <span className="font-bold text-green-700">Status: {c.status || "Reported"}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 2. STUDENT INNOVATOR VIEW */}
        {role === ROLES.STUDENT && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-navy-950 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-amber-600" /> My Active Solution Proposals & NEP Credits
              </h2>
              <Link to="/proposals">
                <Button size="sm" className="bg-navy-900 hover:bg-navy-800 text-white text-xs">
                  <PlusCircle className="w-4 h-4 mr-1" /> Submit New Proposal
                </Button>
              </Link>
            </div>

            <div className="space-y-4">
              {myProposals.map((p) => (
                <div key={p._id} className="bg-white rounded-2xl p-6 border border-navy-100 shadow-sm space-y-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-navy-100 pb-3">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-amber-800">
                        {p.universityName} • {p.department}
                      </span>
                      <h3 className="text-base font-bold text-navy-950 mt-0.5">{p.title}</h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-full text-xs font-black bg-amber-500 text-white">
                        4 NEP Credits
                      </span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          handleOpenCert({
                            certificateNumber: "JH-NEP-1725612345-4892",
                            studentName: user?.name || "Aman Kumar",
                            universityName: p.universityName,
                            department: p.department,
                            challengeTitle: p.title,
                            nepCreditsAwarded: 4,
                            verificationHash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
                          })
                        }
                        className="text-xs flex items-center gap-1"
                      >
                        <Award className="w-3.5 h-3.5 text-amber-600" /> View QR Certificate
                      </Button>
                    </div>
                  </div>

                  {/* Milestones bar */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    {(p.milestones || []).map((ms, idx) => (
                      <div
                        key={idx}
                        className={`p-2.5 rounded-lg border text-left ${
                          ms.status === "completed"
                            ? "bg-green-50 border-green-200 text-green-900"
                            : "bg-navy-50/50 border-navy-200 text-navy-700"
                        }`}
                      >
                        <p className="font-bold text-[11px] truncate">Phase {idx + 1}: {ms.title}</p>
                        <p className="text-[10px] mt-0.5">{ms.status === "completed" ? "✓ Completed" : "Pending"}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. FACULTY / EVALUATOR VIEW */}
        {role === ROLES.FACULTY && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-navy-950 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-purple-600" /> Faculty Review & NEP Credit Issuance
              </h2>
              <Link to="/certificates">
                <Button size="sm" className="bg-purple-700 hover:bg-purple-800 text-white text-xs">
                  <Award className="w-4 h-4 mr-1" /> Certificate Registry
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {myProposals.map((p) => (
                <div key={p._id} className="bg-white rounded-2xl p-6 border border-navy-100 shadow-sm space-y-4">
                  <div>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-800">
                      Mentoring Project
                    </span>
                    <h3 className="font-bold text-navy-950 text-base mt-2">{p.title}</h3>
                    <p className="text-xs text-navy-600 mt-1">Lead Student: Aman Kumar • Budget: ₹{p.estimatedBudget?.toLocaleString()}</p>
                  </div>

                  <div className="p-3 bg-purple-50 rounded-xl border border-purple-200 text-xs">
                    <p className="font-bold text-purple-900">AI Feasibility Score: {p.aiFeasibilityScore || 89}/100</p>
                    <p className="text-purple-950 mt-0.5">{p.aiReviewFeedback}</p>
                  </div>

                  <div className="pt-2 flex items-center justify-end">
                    <Button
                      size="sm"
                      onClick={() =>
                        handleOpenCert({
                          certificateNumber: "JH-NEP-1725612345-4892",
                          studentName: "Aman Kumar",
                          universityName: p.universityName,
                          department: p.department,
                          challengeTitle: p.title,
                          nepCreditsAwarded: 4,
                          verificationHash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
                        })
                      }
                      className="bg-amber-600 hover:bg-amber-700 text-white text-xs flex items-center gap-1.5"
                    >
                      <Award className="w-4 h-4" /> Issue NEP 2020 Credit Certificate
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. INDUSTRY CSR PARTNER VIEW */}
        {role === ROLES.INDUSTRY && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-navy-950 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-emerald-600" /> CSR Escrow Portfolio & Milestone Tranches
              </h2>
              <Link to="/csr">
                <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs">
                  <DollarSign className="w-4 h-4 mr-1" /> Manage Escrow Funds
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {myProposals.map((p) => (
                <div key={p._id} className="bg-white rounded-2xl p-6 border border-navy-100 shadow-sm space-y-4">
                  <div>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                      Escrow Active: {p.csrEscrow?.sponsorName || "Tata Steel CSR"}
                    </span>
                    <h3 className="font-bold text-navy-950 text-base mt-2">{p.title}</h3>
                    <p className="text-xs text-navy-600 mt-1">
                      Pledged: ₹{(p.csrEscrow?.totalCommitted || 55000).toLocaleString()} • Disbursed: ₹{(p.csrEscrow?.disbursedAmount || 25000).toLocaleString()}
                    </p>
                  </div>

                  <Link to="/csr" className="block">
                    <Button variant="outline" size="sm" className="w-full text-xs flex items-center justify-center gap-1.5 border-emerald-300 text-emerald-800">
                      <DollarSign className="w-3.5 h-3.5" /> Release Next Milestone Tranche
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. GOVT / ADMIN DISTRICT VIEW */}
        {role === ROLES.ADMIN && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-navy-950 flex items-center gap-2">
                <Flame className="w-5 h-5 text-red-600" /> District Crisis Hotspots & Emergency Dispatch
              </h2>
              <Link to="/gis">
                <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white text-xs">
                  <MapPin className="w-4 h-4 mr-1" /> Open Full GIS Heatmap
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {hotspots.map((hs, idx) => (
                <div key={idx} className="bg-red-50 border-2 border-red-300 rounded-2xl p-5 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-red-950">{hs.district} District</h4>
                    <span className="px-2 py-0.5 rounded text-xs font-bold bg-red-600 text-white">
                      Avg Urgency: {hs.averageUrgencyScore}/100
                    </span>
                  </div>
                  <p className="text-xs text-red-900 font-medium">Category: {hs.category} ({hs.incidentCount} incidents)</p>
                  <p className="text-xs text-navy-800 bg-white/80 p-2.5 rounded-lg border border-red-200">
                    <strong>Action:</strong> {hs.recommendedAction}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Certificate Modal */}
        <CertificateModal
          certificate={activeCert}
          isOpen={showCertModal}
          onClose={() => setShowCertModal(false)}
        />
      </div>
    </div>
  );
}

export default DashboardPage;
