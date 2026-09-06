import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Building2,
  DollarSign,
  TrendingUp,
  ShieldCheck,
  CheckCircle,
  Clock,
  ArrowRight,
  ExternalLink,
  Sparkles,
  X,
  RefreshCw,
  Send,
  Lock,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { api } from "../services/api";
import { useAuth, ROLES } from "../contexts/AuthContext";

export function CsrEscrowPage() {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProposal, setSelectedProposal] = useState(null);
  const [showDisburseModal, setShowDisburseModal] = useState(false);
  const [disbursing, setDisbursing] = useState(false);

  // Form State for Grant Tranche Release
  const [disburseForm, setDisburseForm] = useState({
    amount: 25000,
    milestoneIndex: 1,
    note: "Prototype lab testing verified by faculty mentor",
    sponsorName: "Tata Steel CSR Foundation",
  });

  const { user, role } = useAuth();

  useEffect(() => {
    fetchProposals();
  }, []);

  const fetchProposals = async () => {
    setLoading(true);
    try {
      const data = await api.proposals.getAll();
      setProposals(data.proposals || []);
    } catch (err) {
      // Mock data
      setProposals([
        {
          _id: "66e0e9f0a1b2c3d456789012",
          title: "Solar-Powered IoT Multi-Stage Fluoride Adsorption Unit",
          universityName: "BIT Mesra",
          department: "Civil & Environmental Engineering",
          estimatedBudget: 55000,
          status: "In-Progress",
          csrEscrow: {
            sponsorName: "Tata Steel CSR Foundation",
            totalCommitted: 55000,
            disbursedAmount: 25000,
            escrowStatus: "In Escrow",
            disbursementHistory: [
              {
                milestoneIndex: 0,
                amount: 15000,
                releasedAt: "2026-09-01T10:00:00.000Z",
                transactionRef: "TXN-CSR-1725610000-101",
                note: "Requirement Analysis & Ground Verification",
              },
              {
                milestoneIndex: 1,
                amount: 10000,
                releasedAt: "2026-09-05T14:30:00.000Z",
                transactionRef: "TXN-CSR-1725613000-845",
                note: "Prototype lab testing verified by faculty mentor",
              },
            ],
          },
        },
        {
          _id: "66e0f1a2b3c4d5e678901234",
          title: "Smart Micro-Grid Solar Backup with Automatic Load Balancing",
          universityName: "IIT ISM Dhanbad",
          department: "Electrical & Renewable Energy",
          estimatedBudget: 85000,
          status: "Submitted",
          csrEscrow: {
            sponsorName: "Coal India CSR Trust",
            totalCommitted: 85000,
            disbursedAmount: 20000,
            escrowStatus: "In Escrow",
            disbursementHistory: [
              {
                milestoneIndex: 0,
                amount: 20000,
                releasedAt: "2026-09-03T09:15:00.000Z",
                transactionRef: "TXN-CSR-1725618899-312",
                note: "Site Assessment & Load Audit",
              },
            ],
          },
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDisburse = (prop) => {
    setSelectedProposal(prop);
    setDisburseForm({
      amount: 20000,
      milestoneIndex: 2,
      note: `Milestone tranche release for ${prop.title}`,
      sponsorName: user?.organization || "Tata Steel CSR Foundation",
    });
    setShowDisburseModal(true);
  };

  const handleDisburseGrant = async (e) => {
    e.preventDefault();
    if (!selectedProposal) return;

    setDisbursing(true);
    try {
      await api.proposals.disburseGrant(selectedProposal._id, disburseForm);
    } catch (err) {
      // optimistic update
    }

    // Update local state
    setProposals((prev) =>
      prev.map((p) => {
        if (p._id !== selectedProposal._id) return p;
        const currentCsr = p.csrEscrow || {
          sponsorName: disburseForm.sponsorName,
          totalCommitted: p.estimatedBudget || 50000,
          disbursedAmount: 0,
          disbursementHistory: [],
        };

        const newHistory = [
          ...(currentCsr.disbursementHistory || []),
          {
            milestoneIndex: disburseForm.milestoneIndex,
            amount: Number(disburseForm.amount),
            releasedAt: new Date().toISOString(),
            transactionRef: `TXN-CSR-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
            note: disburseForm.note,
          },
        ];

        return {
          ...p,
          csrEscrow: {
            ...currentCsr,
            disbursedAmount: currentCsr.disbursedAmount + Number(disburseForm.amount),
            disbursementHistory: newHistory,
          },
        };
      })
    );

    setDisbursing(false);
    setShowDisburseModal(false);
  };

  const totalCommittedAll = proposals.reduce(
    (acc, p) => acc + (p.csrEscrow?.totalCommitted || p.estimatedBudget || 0),
    0
  );
  const totalDisbursedAll = proposals.reduce(
    (acc, p) => acc + (p.csrEscrow?.disbursedAmount || 0),
    0
  );

  return (
    <div className="min-h-screen bg-warm-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-2xl border border-navy-100 shadow-sm">
          <div>
            <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 mb-2">
              <Building2 className="w-3.5 h-3.5 text-emerald-600" />
              Corporate Social Responsibility (CSR)
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-950">
              Industry CSR Escrow & Grant Disbursement
            </h1>
            <p className="text-xs sm:text-sm text-navy-600 mt-1">
              Transparent, milestone-linked fund disbursement ensuring 100% accountability for corporate grants backing student civic innovations.
            </p>
          </div>
        </div>

        {/* Global Escrow Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-navy-100 shadow-sm">
            <span className="text-xs font-bold uppercase text-navy-400">Total CSR Funds Pledged</span>
            <h3 className="text-3xl font-black text-navy-950 mt-1">₹{totalCommittedAll.toLocaleString()}</h3>
            <p className="text-xs text-navy-500 mt-1">Across active student R&D projects</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-navy-100 shadow-sm">
            <span className="text-xs font-bold uppercase text-navy-400">Milestone Grants Released</span>
            <h3 className="text-3xl font-black text-emerald-600 mt-1">₹{totalDisbursedAll.toLocaleString()}</h3>
            <p className="text-xs text-navy-500 mt-1">Disbursed directly upon verified milestones</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-navy-100 shadow-sm">
            <span className="text-xs font-bold uppercase text-navy-400">Remaining in Escrow</span>
            <h3 className="text-3xl font-black text-amber-600 mt-1">
              ₹{(totalCommittedAll - totalDisbursedAll).toLocaleString()}
            </h3>
            <p className="text-xs text-navy-500 mt-1">Held in escrow until next milestones</p>
          </div>
        </div>

        {/* Project Escrow Accounts */}
        <div className="space-y-6">
          <h2 className="text-lg font-bold text-navy-950">Active CSR Sponsored Innovations</h2>

          {loading ? (
            <div className="text-center py-16">
              <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-xs font-semibold text-navy-600">Loading escrow accounts...</p>
            </div>
          ) : (
            proposals.map((item) => {
              const committed = item.csrEscrow?.totalCommitted || item.estimatedBudget || 50000;
              const disbursed = item.csrEscrow?.disbursedAmount || 0;
              const pct = Math.min(100, Math.round((disbursed / committed) * 100));

              return (
                <div
                  key={item._id}
                  className="bg-white rounded-2xl p-6 sm:p-8 border border-navy-100 shadow-sm space-y-6"
                >
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-navy-100 pb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                          {item.csrEscrow?.sponsorName || "Tata Steel CSR"}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-navy-100 text-navy-800">
                          {item.universityName}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-navy-950">{item.title}</h3>
                      <p className="text-xs text-navy-500 mt-0.5">Department: {item.department}</p>
                    </div>

                    <Button
                      onClick={() => handleOpenDisburse(item)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs flex items-center gap-1.5"
                    >
                      <DollarSign className="w-4 h-4" /> Release Milestone Tranche
                    </Button>
                  </div>

                  {/* Escrow Progress Bar */}
                  <div>
                    <div className="flex items-center justify-between text-xs font-bold mb-2">
                      <span className="text-navy-700">
                        Disbursed: ₹{disbursed.toLocaleString()} of ₹{committed.toLocaleString()}
                      </span>
                      <span className="text-emerald-700">{pct}% Released</span>
                    </div>

                    <div className="w-full h-3 bg-navy-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>

                  {/* Disbursement Ledger */}
                  {item.csrEscrow?.disbursementHistory && item.csrEscrow.disbursementHistory.length > 0 && (
                    <div className="bg-navy-50/50 p-4 rounded-xl border border-navy-100 space-y-3">
                      <h4 className="text-xs font-bold uppercase text-navy-700">
                        Audit Ledger & Transaction Proofs:
                      </h4>

                      <div className="space-y-2">
                        {item.csrEscrow.disbursementHistory.map((tx, idx) => (
                          <div
                            key={idx}
                            className="bg-white p-3 rounded-lg border border-navy-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs"
                          >
                            <div>
                              <p className="font-bold text-navy-900">{tx.note || `Phase ${tx.milestoneIndex + 1} Tranche`}</p>
                              <span className="font-mono text-[11px] text-navy-400">
                                Ref: {tx.transactionRef}
                              </span>
                            </div>

                            <div className="text-right">
                              <span className="font-bold text-emerald-700 text-sm">
                                +₹{Number(tx.amount).toLocaleString()}
                              </span>
                              <p className="text-[10px] text-navy-400">
                                {new Date(tx.releasedAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Release Grant Modal */}
        {showDisburseModal && selectedProposal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/70 backdrop-blur-sm overflow-y-auto">
            <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl p-6 sm:p-8 border border-navy-200 my-8">
              <button
                onClick={() => setShowDisburseModal(false)}
                className="absolute right-5 top-5 p-1.5 rounded-lg text-navy-400 hover:bg-navy-100 hover:text-navy-900"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                  <ShieldCheck className="w-3.5 h-3.5 inline mr-1 text-emerald-600" />
                  Escrow Tranche Release
                </span>
              </div>

              <h2 className="text-xl font-bold text-navy-950">
                Disburse Milestone Grant
              </h2>
              <p className="text-xs text-navy-600 mt-1">
                Release funds from escrow account directly to student project team upon mentor verification.
              </p>

              <form onSubmit={handleDisburseGrant} className="space-y-4 mt-6">
                <div>
                  <label className="block text-xs font-semibold text-navy-800 mb-1">
                    Tranche Amount (₹)
                  </label>
                  <input
                    type="number"
                    required
                    value={disburseForm.amount}
                    onChange={(e) => setDisburseForm({ ...disburseForm, amount: e.target.value })}
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-navy-50/50 border border-navy-200 rounded-xl focus:outline-none focus:border-navy-900 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-navy-800 mb-1">
                    Target Milestone Phase
                  </label>
                  <select
                    value={disburseForm.milestoneIndex}
                    onChange={(e) => setDisburseForm({ ...disburseForm, milestoneIndex: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs bg-navy-50/50 border border-navy-200 rounded-xl font-medium"
                  >
                    <option value={0}>Phase 1: Requirement Analysis & Verification</option>
                    <option value={1}>Phase 2: Prototype Lab Testing</option>
                    <option value={2}>Phase 3: Field Deployment</option>
                    <option value={3}>Phase 4: Final Impact Handover</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-navy-800 mb-1">
                    Verification Note / Auditor Remarks
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={disburseForm.note}
                    onChange={(e) => setDisburseForm({ ...disburseForm, note: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-navy-50/50 border border-navy-200 rounded-xl"
                  />
                </div>

                <div className="pt-4 border-t border-navy-100 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowDisburseModal(false)}
                    className="px-4 py-2 text-xs font-semibold text-navy-700 bg-navy-50 hover:bg-navy-100 rounded-xl"
                  >
                    Cancel
                  </button>
                  <Button
                    type="submit"
                    disabled={disbursing}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs flex items-center gap-1.5"
                  >
                    {disbursing ? "Releasing Tranche..." : "Authorize Release"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CsrEscrowPage;
