import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  GraduationCap,
  Lightbulb,
  PlusCircle,
  CheckCircle2,
  Clock,
  ExternalLink,
  GitBranch,
  Award,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  TrendingUp,
  FileCode,
  DollarSign,
  Calendar,
  X,
  RefreshCw,
  Building,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { api } from "../services/api";
import { useAuth, ROLES } from "../contexts/AuthContext";
import { CertificateModal } from "../components/ui/CertificateModal";

export function ProposalsPage() {
  const [searchParams] = useSearchParams();
  const preselectedChallengeId = searchParams.get("challengeId");

  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Certificate Modal State
  const [activeCert, setActiveCert] = useState(null);
  const [showCertModal, setShowCertModal] = useState(false);
  const [generatingCert, setGeneratingCert] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    challengeId: preselectedChallengeId || "66e0c7d8e9f0a1b234567890",
    title: "Solar-Powered IoT Multi-Stage Fluoride Adsorption Unit",
    abstract: "Developing an automated nano-composite alumina gravity filtration unit coupled with IoT water quality telemetry for Angara village.",
    methodology: "1. Field water sampling; 2. Filter chamber fabrication in university lab; 3. IoT sensor telemetry calibration; 4. Pilot deployment in Hutup village.",
    universityName: "BIT Mesra",
    department: "Civil & Environmental Engineering",
    facultyMentor: "Dr. S. K. Verma",
    teamMembers: "Aman Kumar (Lead), Sneha Roy (Embedded IoT), Rahul Mahato (Field Tech)",
    estimatedBudget: 55000,
    timelineWeeks: 12,
    githubRepo: "https://github.com/team-sih/jh-clean-water",
    demoUrl: "https://jh-water-iot.vercel.app",
  });

  const { user, role, isAuthenticated } = useAuth();

  useEffect(() => {
    fetchProposals();
    if (preselectedChallengeId) {
      setShowSubmitModal(true);
    }
  }, [preselectedChallengeId]);

  const fetchProposals = async () => {
    setLoading(true);
    try {
      const data = await api.proposals.getAll();
      setProposals(data.proposals || []);
    } catch (err) {
      // Mock proposal data
      setProposals([
        {
          _id: "66e0e9f0a1b2c3d456789012",
          challengeId: "66e0c7d8e9f0a1b234567890",
          challengeTitle: "Fluoride Contamination and Borewell Failure in Angara",
          title: "Solar-Powered IoT Multi-Stage Fluoride Adsorption Unit",
          abstract: "Developing an automated nano-composite alumina gravity filtration unit coupled with IoT water quality telemetry.",
          universityName: "BIT Mesra",
          department: "Civil & Environmental Engineering",
          facultyMentor: "Dr. S. K. Verma",
          teamMembers: ["Aman Kumar (Lead)", "Sneha Roy (Embedded IoT)", "Rahul Mahato (Field Tech)"],
          estimatedBudget: 55000,
          timelineWeeks: 12,
          aiFeasibilityScore: 89,
          aiReviewFeedback: "Technically viable approach utilizing proven adsorption methodology with practical telemetry.",
          status: "In-Progress",
          milestones: [
            { title: "Requirement Analysis & Ground Verification", targetWeeks: 2, status: "completed", proofUrl: "https://github.com/team-sih/survey-report" },
            { title: "Prototype Development & Lab Testing", targetWeeks: 6, status: "completed", proofUrl: "https://github.com/team-sih/lab-test" },
            { title: "Pilot Field Deployment & Feedback", targetWeeks: 10, status: "in-progress" },
            { title: "Final Handover & Impact Report", targetWeeks: 12, status: "pending" },
          ],
          csrEscrow: {
            sponsorName: "Tata Steel CSR Foundation",
            totalCommitted: 55000,
            disbursedAmount: 25000,
            escrowStatus: "In Escrow",
          },
        },
        {
          _id: "66e0f1a2b3c4d5e678901234",
          challengeTitle: "Transformer Burnout and 10-Day Power Blackout in Pokharia",
          title: "Smart Micro-Grid Solar Backup with Automatic Load Balancing",
          abstract: "Deploying rapid-switch lithium ferro-phosphate solar backup units for village schools and water pumps.",
          universityName: "IIT ISM Dhanbad",
          department: "Electrical & Renewable Energy",
          facultyMentor: "Prof. P. K. Mishra",
          teamMembers: ["Priya Sharma (Lead)", "Vikas Mandal (Power Electronics)"],
          estimatedBudget: 85000,
          timelineWeeks: 10,
          aiFeasibilityScore: 92,
          aiReviewFeedback: "Strong technical feasibility with high direct social impact on village rural lighting.",
          status: "Submitted",
          milestones: [
            { title: "Site Assessment & Load Audit", targetWeeks: 2, status: "completed" },
            { title: "Inverter & Battery Assembly", targetWeeks: 5, status: "in-progress" },
            { title: "Field Interfacing & Grid Test", targetWeeks: 8, status: "pending" },
            { title: "Gram Panchayat Handover", targetWeeks: 10, status: "pending" },
          ],
          csrEscrow: {
            sponsorName: "Coal India CSR Trust",
            totalCommitted: 85000,
            disbursedAmount: 0,
            escrowStatus: "Pledged",
          },
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmitProposal = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const payload = {
        ...formData,
        teamMembers: formData.teamMembers.split(",").map((m) => m.trim()),
        estimatedBudget: Number(formData.estimatedBudget),
        timelineWeeks: Number(formData.timelineWeeks),
      };

      const res = await api.proposals.create(payload);
      if (res && res.proposal) {
        setProposals([res.proposal, ...proposals]);
      }
      setShowSubmitModal(false);
    } catch (err) {
      // Mock fallback proposal addition
      const newMock = {
        _id: "prop_" + Date.now().toString(36),
        challengeId: formData.challengeId,
        challengeTitle: "Fluoride Contamination and Borewell Failure",
        title: formData.title,
        abstract: formData.abstract,
        universityName: formData.universityName,
        department: formData.department,
        facultyMentor: formData.facultyMentor,
        teamMembers: formData.teamMembers.split(",").map((m) => m.trim()),
        estimatedBudget: Number(formData.estimatedBudget),
        timelineWeeks: Number(formData.timelineWeeks),
        aiFeasibilityScore: 89,
        aiReviewFeedback: "Technically viable approach utilizing proven methodology with practical telemetry.",
        status: "Submitted",
        milestones: [
          { title: "Requirement Analysis & Ground Verification", targetWeeks: 2, status: "pending" },
          { title: "Prototype Development & Lab Testing", targetWeeks: 6, status: "pending" },
          { title: "Pilot Field Deployment & Feedback", targetWeeks: 10, status: "pending" },
          { title: "Final Handover & Impact Report", targetWeeks: 12, status: "pending" },
        ],
      };
      setProposals([newMock, ...proposals]);
      setShowSubmitModal(false);
    } finally {
      setSubmitting(false);
    }
  };

  // Update Milestone Step
  const handleUpdateMilestone = async (propId, milestoneIdx) => {
    try {
      await api.proposals.updateMilestone(propId, {
        milestoneIndex: milestoneIdx,
        status: "completed",
        proofUrl: "https://github.com/team-sih/milestone-proof",
      });
    } catch (err) {
      // update state optimistically
    }

    setProposals((prev) =>
      prev.map((p) => {
        if (p._id !== propId) return p;
        const updatedMs = [...p.milestones];
        updatedMs[milestoneIdx] = {
          ...updatedMs[milestoneIdx],
          status: "completed",
          proofUrl: "https://github.com/team-sih/milestone-proof",
        };
        return { ...p, milestones: updatedMs };
      })
    );
  };

  // Issue NEP 2020 Certificate
  const handleGenerateCertificate = async (proposal) => {
    setGeneratingCert(true);
    try {
      const res = await api.certificates.generate({
        proposalId: proposal._id,
        nepCredits: 4,
      });

      if (res && res.certificate) {
        setActiveCert(res.certificate);
        setShowCertModal(true);
      }
    } catch (err) {
      // Mock certificate
      const mockCert = {
        certificateNumber: `JH-NEP-${Math.floor(100000 + Math.random() * 900000)}-4892`,
        studentName: Array.isArray(proposal.teamMembers) ? proposal.teamMembers[0] : "Aman Kumar",
        universityName: proposal.universityName || "BIT Mesra",
        department: proposal.department || "Civil & Environmental Engineering",
        challengeTitle: proposal.challengeTitle || proposal.title,
        nepCreditsAwarded: 4,
        courseCategory: "NEP 2020 Experiential & Community Learning",
        verificationHash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
        issueDate: new Date().toISOString(),
      };
      setActiveCert(mockCert);
      setShowCertModal(true);
    } finally {
      setGeneratingCert(false);
    }
  };

  return (
    <div className="min-h-screen bg-warm-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-2xl border border-navy-100 shadow-sm">
          <div>
            <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200 mb-2">
              <GraduationCap className="w-3.5 h-3.5 text-amber-600" />
              University & Student Innovation Hub
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-950">
              Solution Proposals & Milestones
            </h1>
            <p className="text-xs sm:text-sm text-navy-600 mt-1">
              Engineering students build prototypes for real community challenges, earn NEP 2020 Academic Credits, and receive CSR milestone funding.
            </p>
          </div>

          <Button
            onClick={() => setShowSubmitModal(true)}
            className="bg-navy-900 hover:bg-navy-800 text-white text-xs flex items-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4 text-amber-400" /> Submit Solution Proposal
          </Button>
        </div>

        {/* Proposals List */}
        {loading ? (
          <div className="text-center py-16">
            <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs font-semibold text-navy-600">Loading university solution proposals...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {proposals.map((item) => {
              const completedMilestones = (item.milestones || []).filter((m) => m.status === "completed").length;
              const totalMilestones = item.milestones?.length || 4;
              const progressPct = Math.round((completedMilestones / totalMilestones) * 100);

              return (
                <div
                  key={item._id}
                  className="bg-white rounded-2xl p-6 sm:p-8 border border-navy-100 shadow-sm space-y-6"
                >
                  {/* Proposal Header */}
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-navy-100 pb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-navy-100 text-navy-800">
                          {item.universityName}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
                          {item.department}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-50 text-green-700 border border-green-200">
                          Status: {item.status || "In-Progress"}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-navy-950">{item.title}</h3>
                      <p className="text-xs text-navy-500 mt-0.5">
                        Challenge: <strong className="text-navy-800">{item.challengeTitle || "Water & Sanitation"}</strong> • Mentor: {item.facultyMentor}
                      </p>
                    </div>

                    {/* AI Feasibility Badge */}
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="text-[10px] uppercase font-bold text-navy-400 block">AI Feasibility</span>
                        <span className="text-2xl font-black text-amber-600 leading-none">
                          {item.aiFeasibilityScore || 89}/100
                        </span>
                      </div>

                      {/* NEP Certificate Button (For Faculty / Admin) */}
                      <Button
                        size="sm"
                        onClick={() => handleGenerateCertificate(item)}
                        disabled={generatingCert}
                        className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 text-white text-xs flex items-center gap-1.5 shadow-sm"
                      >
                        <Award className="w-4 h-4" /> Issue NEP 2020 Certificate
                      </Button>
                    </div>
                  </div>

                  {/* Abstract & Team */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2 bg-navy-50/50 p-4 rounded-xl text-xs text-navy-800 space-y-2">
                      <p className="font-semibold text-navy-900">Abstract & Technical Approach:</p>
                      <p className="leading-relaxed">{item.abstract}</p>
                      {item.aiReviewFeedback && (
                        <div className="mt-2 pt-2 border-t border-navy-200/60 flex items-start gap-1.5 text-blue-900 font-medium">
                          <Sparkles className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                          <span>AI Review: {item.aiReviewFeedback}</span>
                        </div>
                      )}
                    </div>

                    <div className="bg-amber-50/40 p-4 rounded-xl border border-amber-200/60 space-y-2 text-xs">
                      <p className="font-bold text-amber-900 uppercase text-[10px]">Team & Budget Info</p>
                      <p className="text-navy-800">
                        <strong>Budget:</strong> ₹{item.estimatedBudget?.toLocaleString()} (Timeline: {item.timelineWeeks} wks)
                      </p>
                      <p className="text-navy-800 line-clamp-2">
                        <strong>Members:</strong> {Array.isArray(item.teamMembers) ? item.teamMembers.join(", ") : item.teamMembers}
                      </p>
                      {item.githubRepo && (
                        <a
                          href={item.githubRepo}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-navy-800 hover:text-navy-950 font-bold mt-1"
                        >
                          <GitBranch className="w-3.5 h-3.5" /> GitHub Repository
                        </a>
                      )}
                    </div>
                  </div>

                  {/* 4-Stage Milestone Stepper */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-xs font-bold uppercase text-navy-700 flex items-center gap-1.5">
                        <TrendingUp className="w-4 h-4 text-amber-600" /> Milestone Execution Tracker ({progressPct}%)
                      </h4>
                      <span className="text-xs text-navy-500 font-medium">
                        {completedMilestones} of {totalMilestones} Completed
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      {(item.milestones || []).map((ms, idx) => {
                        const isDone = ms.status === "completed";
                        const isCurrent = ms.status === "in-progress";

                        return (
                          <div
                            key={idx}
                            className={`p-3.5 rounded-xl border transition-all ${
                              isDone
                                ? "bg-green-50/70 border-green-200"
                                : isCurrent
                                ? "bg-blue-50/70 border-blue-200"
                                : "bg-navy-50/40 border-navy-200/80"
                            }`}
                          >
                            <div className="flex items-center justify-between gap-1 mb-1.5">
                              <span className="text-[10px] font-bold uppercase text-navy-400">
                                Phase {idx + 1}
                              </span>
                              {isDone ? (
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-green-700 bg-green-100 px-1.5 py-0.2 rounded">
                                  <CheckCircle2 className="w-3 h-3" /> Done
                                </span>
                              ) : isCurrent ? (
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-700 bg-blue-100 px-1.5 py-0.2 rounded">
                                  <Clock className="w-3 h-3 animate-spin" /> In Progress
                                </span>
                              ) : (
                                <span className="text-[10px] font-bold text-navy-400">Pending</span>
                              )}
                            </div>

                            <p className="text-xs font-bold text-navy-900 line-clamp-2">{ms.title}</p>
                            <p className="text-[10px] text-navy-500 mt-1">Target: Week {ms.targetWeeks || (idx + 1) * 3}</p>

                            {!isDone && (
                              <button
                                type="button"
                                onClick={() => handleUpdateMilestone(item._id, idx)}
                                className="mt-2.5 w-full py-1 text-[10px] font-bold text-navy-700 bg-white hover:bg-navy-100 border border-navy-200 rounded-lg transition-colors"
                              >
                                Mark Completed
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Submit Proposal Modal */}
        {showSubmitModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/70 backdrop-blur-sm overflow-y-auto">
            <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl p-6 sm:p-8 border border-navy-200 my-8">
              <button
                onClick={() => setShowSubmitModal(false)}
                className="absolute right-5 top-5 p-1.5 rounded-lg text-navy-400 hover:bg-navy-100 hover:text-navy-900"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
                  <Sparkles className="w-3.5 h-3.5 inline mr-1 text-amber-600" />
                  Student Innovation Submission
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-navy-950">
                Submit Solution Proposal
              </h2>
              <p className="text-xs text-navy-600 mt-1">
                Your proposal will be automatically scored for AI feasibility and routed to faculty mentors and CSR sponsors.
              </p>

              <form onSubmit={handleSubmitProposal} className="space-y-4 mt-6">
                <div>
                  <label className="block text-xs font-semibold text-navy-800 mb-1">Proposal Title</label>
                  <input
                    type="text"
                    required
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-navy-50/50 border border-navy-200 rounded-xl focus:outline-none focus:border-navy-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-navy-800 mb-1">Technical Abstract</label>
                  <textarea
                    rows={3}
                    required
                    name="abstract"
                    value={formData.abstract}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-navy-50/50 border border-navy-200 rounded-xl focus:outline-none focus:border-navy-900"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-navy-800 mb-1">University / Institute</label>
                    <input
                      type="text"
                      required
                      name="universityName"
                      value={formData.universityName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 text-xs bg-navy-50/50 border border-navy-200 rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-navy-800 mb-1">Department</label>
                    <input
                      type="text"
                      required
                      name="department"
                      value={formData.department}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 text-xs bg-navy-50/50 border border-navy-200 rounded-xl"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-navy-800 mb-1">Faculty Mentor</label>
                    <input
                      type="text"
                      name="facultyMentor"
                      value={formData.facultyMentor}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 text-xs bg-navy-50/50 border border-navy-200 rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-navy-800 mb-1">Estimated Budget (₹)</label>
                    <input
                      type="number"
                      name="estimatedBudget"
                      value={formData.estimatedBudget}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 text-xs bg-navy-50/50 border border-navy-200 rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-navy-800 mb-1">Timeline (Weeks)</label>
                    <input
                      type="number"
                      name="timelineWeeks"
                      value={formData.timelineWeeks}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 text-xs bg-navy-50/50 border border-navy-200 rounded-xl"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-navy-800 mb-1">Team Members (comma separated)</label>
                  <input
                    type="text"
                    name="teamMembers"
                    value={formData.teamMembers}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 text-xs bg-navy-50/50 border border-navy-200 rounded-xl"
                  />
                </div>

                <div className="pt-4 border-t border-navy-100 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowSubmitModal(false)}
                    className="px-4 py-2 text-xs font-semibold text-navy-700 bg-navy-50 hover:bg-navy-100 rounded-xl"
                  >
                    Cancel
                  </button>
                  <Button
                    type="submit"
                    disabled={submitting}
                    className="bg-navy-900 hover:bg-navy-800 text-white text-xs flex items-center gap-1.5"
                  >
                    {submitting ? "Scoring with AI..." : "Submit Proposal"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Golden Certificate Modal */}
        <CertificateModal
          certificate={activeCert}
          isOpen={showCertModal}
          onClose={() => setShowCertModal(false)}
        />
      </div>
    </div>
  );
}

export default ProposalsPage;
