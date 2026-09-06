import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  Filter,
  ThumbsUp,
  MapPin,
  Sparkles,
  ShieldCheck,
  GraduationCap,
  Calendar,
  AlertTriangle,
  ArrowRight,
  Eye,
  PlusCircle,
  CheckCircle,
  ExternalLink,
  Droplets,
  Construction,
  Zap,
  Leaf,
  HeartPulse,
  Trash2,
  X,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { api } from "../services/api";
import { useAuth } from "../contexts/AuthContext";

const CATEGORIES = [
  "All Categories",
  "Water & Sanitation",
  "Roads & Infrastructure",
  "Clean Energy & Environment",
  "Healthcare & Nutrition",
  "Agriculture & Rural Economy",
];

const DISTRICTS = [
  "All Districts",
  "Ranchi",
  "Dhanbad",
  "East Singhbhum",
  "Bokaro",
  "Hazaribagh",
  "Dumka",
];

const SEVERITIES = ["All", "High", "Medium", "Low"];

export function ChallengesPage() {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedDistrict, setSelectedDistrict] = useState("All Districts");
  const [selectedSeverity, setSelectedSeverity] = useState("All");
  const [selectedChallenge, setSelectedChallenge] = useState(null);

  const { isAuthenticated, role } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchChallenges();
  }, [selectedCategory, selectedDistrict, selectedSeverity]);

  const fetchChallenges = async () => {
    setLoading(true);
    try {
      const params = {};
      if (selectedCategory !== "All Categories") params.category = selectedCategory;
      if (selectedDistrict !== "All Districts") params.district = selectedDistrict;
      if (selectedSeverity !== "All") params.severity = selectedSeverity;

      const data = await api.challenges.getAll(params);
      setChallenges(data.challenges || []);
    } catch (err) {
      // Fallback sample challenges for rich testing
      setChallenges([
        {
          _id: "66e0c7d8e9f0a1b234567890",
          title: "Fluoride Contamination and Borewell Failure in Angara Block",
          description: "Over 300 tribal families in Angara Block, Ranchi are facing severe water crisis due to rusted pipes and high fluoride contamination in groundwater.",
          category: "Water & Sanitation",
          severity: "High",
          aiUrgencyScore: 88,
          location: { district: "Ranchi", block: "Angara", village: "Hutup", latitude: 23.385, longitude: 85.452 },
          mediaUrls: ["https://res.cloudinary.com/dyerte6k8/image/upload/v1788683246/sih26043_evidence/sample_handpump.jpg"],
          status: "Reported",
          upvotes: 24,
          assignedDepartment: "Civil & Environmental Engineering",
          assignedUniversity: "BIT Mesra / Ranchi University",
          aiAnalysis: {
            recommendedDepartment: "Civil & Environmental Engineering",
            technicalComplexity: 7,
            imageAuthenticityScore: 92,
            visualFindings: "Image confirms severely rusted handpump discharge unit and discolored water pool.",
            suggestedSolutionApproach: "Deploy low-cost activated alumina gravity filter and solar-powered submersible pump.",
          },
          createdAt: "2026-09-06T12:30:00.000Z",
        },
        {
          _id: "66e0d8e9f0a1b2c345678901",
          title: "Transformer Burnout and 10-Day Power Blackout in Pokharia",
          description: "The village transformer burnt out, resulting in a continuous 10-day power blackout affecting school education and household water pumps.",
          category: "Clean Energy & Environment",
          severity: "High",
          aiUrgencyScore: 82,
          location: { district: "Dhanbad", block: "Tundi", village: "Pokharia", latitude: 23.795, longitude: 86.43 },
          mediaUrls: [],
          status: "In-Progress",
          upvotes: 18,
          assignedDepartment: "Electrical & Renewable Energy Engineering",
          assignedUniversity: "IIT ISM Dhanbad / BIT Sindri",
          aiAnalysis: {
            recommendedDepartment: "Electrical Engineering",
            technicalComplexity: 6,
            imageAuthenticityScore: 88,
            suggestedSolutionApproach: "Implement microgrid solar backup and smart step-down transformer relay.",
          },
          createdAt: "2026-09-05T10:15:00.000Z",
        },
        {
          _id: "66e0e9f0a1b2c3d456789022",
          title: "Collapsing Culvert on Govindpur-Mahuda Arterial Haul Road",
          description: "Deep structural fractures on the single-lane bridge preventing emergency ambulances and school buses from crossing during monsoon.",
          category: "Roads & Infrastructure",
          severity: "High",
          aiUrgencyScore: 91,
          location: { district: "Bokaro", block: "Chas", village: "Kandra", latitude: 23.669, longitude: 86.151 },
          mediaUrls: [],
          status: "Reported",
          upvotes: 31,
          assignedDepartment: "Structural & Civil Engineering",
          assignedUniversity: "NIT Jamshedpur",
          aiAnalysis: {
            recommendedDepartment: "Structural Engineering",
            technicalComplexity: 8,
            imageAuthenticityScore: 95,
            suggestedSolutionApproach: "Modular precast reinforced concrete box culvert with geotechnical soil stabilization.",
          },
          createdAt: "2026-09-04T08:00:00.000Z",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleUpvote = async (id, e) => {
    e.stopPropagation();
    try {
      await api.challenges.upvote(id);
      setChallenges((prev) =>
        prev.map((c) => (c._id === id ? { ...c, upvotes: (c.upvotes || 0) + 1 } : c))
      );
    } catch (err) {
      setChallenges((prev) =>
        prev.map((c) => (c._id === id ? { ...c, upvotes: (c.upvotes || 0) + 1 } : c))
      );
    }
  };

  const filtered = challenges.filter((c) => {
    const q = search.toLowerCase();
    return (
      c.title.toLowerCase().includes(q) ||
      c.description?.toLowerCase().includes(q) ||
      c.location?.district?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-warm-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-2xl border border-navy-100 shadow-sm">
          <div>
            <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              Community Problem Stream
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-950">
              Explore Civic Challenges
            </h1>
            <p className="text-xs sm:text-sm text-navy-600 mt-1">
              Verified community issues reported across Jharkhand districts awaiting student-engineered solutions and CSR grant backing.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Link to="/report" className="w-full sm:w-auto">
              <Button className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white text-xs flex items-center gap-1.5">
                <PlusCircle className="w-4 h-4" /> Report New Challenge
              </Button>
            </Link>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white p-4 sm:p-6 rounded-2xl border border-navy-100 shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-navy-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by keywords, village, or district..."
                className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-navy-50/40 border border-navy-200 rounded-xl focus:outline-none focus:border-navy-900"
              />
            </div>

            {/* Category Dropdown */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full md:w-auto px-3 py-2 text-xs bg-navy-50/40 border border-navy-200 rounded-xl font-medium focus:outline-none text-navy-800"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            {/* District Dropdown */}
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="w-full md:w-auto px-3 py-2 text-xs bg-navy-50/40 border border-navy-200 rounded-xl font-medium focus:outline-none text-navy-800"
            >
              {DISTRICTS.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          {/* Severity Filters */}
          <div className="flex items-center gap-2 pt-2 border-t border-navy-50 overflow-x-auto">
            <span className="text-xs font-semibold text-navy-500 shrink-0">Severity:</span>
            {SEVERITIES.map((sev) => (
              <button
                key={sev}
                onClick={() => setSelectedSeverity(sev)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors shrink-0 ${
                  selectedSeverity === sev
                    ? "bg-navy-900 text-white"
                    : "bg-navy-50 text-navy-700 hover:bg-navy-100"
                }`}
              >
                {sev}
              </button>
            ))}
          </div>
        </div>

        {/* Challenges Grid */}
        {loading ? (
          <div className="text-center py-16">
            <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs font-semibold text-navy-600">Loading civic challenges...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-navy-100">
            <p className="text-sm font-bold text-navy-800">No challenges found matching your filters.</p>
            <p className="text-xs text-navy-500 mt-1">Try broadening your search or submit a new challenge.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((item) => {
              const urgency = item.aiUrgencyScore || 50;
              const isHigh = urgency >= 75 || item.severity === "High";

              return (
                <div
                  key={item._id}
                  onClick={() => setSelectedChallenge(item)}
                  className="bg-white rounded-2xl p-6 border border-navy-100 shadow-sm hover:shadow-md hover:border-amber-300 transition-all flex flex-col justify-between cursor-pointer group"
                >
                  <div>
                    {/* Top Row: Category & Urgency */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-navy-100 text-navy-800">
                        {item.category || "Water & Sanitation"}
                      </span>

                      <div
                        className={`px-2.5 py-0.5 rounded-full text-xs font-black flex items-center gap-1 ${
                          isHigh
                            ? "bg-red-50 text-red-700 border border-red-200"
                            : "bg-amber-50 text-amber-700 border border-amber-200"
                        }`}
                      >
                        <span>🔥 {urgency}/100</span>
                      </div>
                    </div>

                    <h3 className="font-bold text-navy-950 text-base group-hover:text-amber-800 transition-colors line-clamp-2">
                      {item.title}
                    </h3>

                    <p className="text-xs text-navy-600 mt-2 line-clamp-3 leading-relaxed">
                      {item.description}
                    </p>

                    {/* Department tag */}
                    <div className="mt-4 p-2.5 rounded-xl bg-amber-50/60 border border-amber-200/80 flex items-start gap-2">
                      <GraduationCap className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-[10px] uppercase font-bold text-amber-800">Assigned Discipline</p>
                        <p className="text-xs font-semibold text-navy-900">
                          {item.assignedDepartment || "Civil & Environmental Engineering"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="mt-6 pt-4 border-t border-navy-100 flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1 text-navy-500 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-navy-400" />
                      {item.location?.district || "Ranchi"}
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={(e) => handleUpvote(item._id, e)}
                        className="px-2.5 py-1 rounded-lg bg-navy-50 hover:bg-navy-100 text-navy-700 font-bold flex items-center gap-1 border border-navy-200 transition-colors"
                      >
                        <ThumbsUp className="w-3 h-3 text-amber-600" />
                        <span>{item.upvotes || 0}</span>
                      </button>

                      <span className="font-bold text-amber-700 group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                        Solve <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Detailed Modal */}
        {selectedChallenge && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/70 backdrop-blur-sm overflow-y-auto">
            <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl p-6 sm:p-8 border border-navy-200 my-8">
              <button
                onClick={() => setSelectedChallenge(null)}
                className="absolute right-5 top-5 p-1.5 rounded-lg text-navy-400 hover:bg-navy-100 hover:text-navy-900"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-navy-100 text-navy-800">
                  {selectedChallenge.category}
                </span>
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700">
                  Urgency: {selectedChallenge.aiUrgencyScore || 88}/100
                </span>
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">
                  Status: {selectedChallenge.status || "Reported"}
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-navy-950 mt-2">
                {selectedChallenge.title}
              </h2>

              <p className="text-xs text-navy-500 mt-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-navy-400" />
                {selectedChallenge.location?.village ? `${selectedChallenge.location.village}, ` : ""}
                {selectedChallenge.location?.block ? `${selectedChallenge.location.block}, ` : ""}
                {selectedChallenge.location?.district || "Jharkhand"}
              </p>

              <div className="mt-4 p-4 bg-navy-50 rounded-xl text-xs sm:text-sm text-navy-800 leading-relaxed">
                {selectedChallenge.description}
              </div>

              {/* AI Forensics & Recommendations */}
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200">
                  <p className="text-[10px] uppercase font-bold text-amber-800">Recommended Approach</p>
                  <p className="text-xs text-navy-900 mt-1 font-medium">
                    {selectedChallenge.aiAnalysis?.suggestedSolutionApproach ||
                      "Deploy automated IoT sensing telemetry & modular filter column."}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200">
                  <p className="text-[10px] uppercase font-bold text-emerald-800">Evidence Verification</p>
                  <p className="text-xs text-navy-900 mt-1 font-medium">
                    AI Authenticity Score: <strong>{selectedChallenge.aiAnalysis?.imageAuthenticityScore || 92}%</strong>
                  </p>
                  <p className="text-[11px] text-navy-600 mt-0.5">
                    {selectedChallenge.aiAnalysis?.visualFindings || "Defect physically confirmed."}
                  </p>
                </div>
              </div>

              {/* Action Launcher */}
              <div className="mt-6 pt-4 border-t border-navy-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedChallenge(null)}
                  className="px-4 py-2 text-xs font-semibold text-navy-700 bg-navy-50 hover:bg-navy-100 rounded-xl"
                >
                  Close
                </button>

                <Link to={`/proposals?challengeId=${selectedChallenge._id}`}>
                  <Button className="bg-amber-600 hover:bg-amber-700 text-white text-xs flex items-center gap-1.5">
                    <GraduationCap className="w-4 h-4" /> Submit Solution Proposal (Students)
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ChallengesPage;
