import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Award,
  ShieldCheck,
  QrCode,
  Download,
  Eye,
  Search,
  ExternalLink,
  GraduationCap,
  Sparkles,
  CheckCircle,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { CertificateModal } from "../components/ui/CertificateModal";

export function CertificatesPage() {
  const [activeCert, setActiveCert] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchHash, setSearchHash] = useState("");

  const sampleCertificates = [
    {
      certificateNumber: "JH-NEP-1725612345-4892",
      studentName: "Aman Kumar",
      universityName: "BIT Mesra",
      department: "Civil & Environmental Engineering",
      challengeTitle: "Fluoride Contamination and Borewell Failure in Angara Block",
      nepCreditsAwarded: 4,
      courseCategory: "NEP 2020 Experiential & Community Problem Solving",
      verificationHash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
      issueDate: "2026-09-06T13:15:00.000Z",
    },
    {
      certificateNumber: "JH-NEP-1725619988-1024",
      studentName: "Sneha Roy",
      universityName: "Ranchi University",
      department: "Computer Science & Embedded Systems",
      challengeTitle: "Automated Water Quality Telemetry & Solar Adsorption Unit",
      nepCreditsAwarded: 4,
      courseCategory: "NEP 2020 Experiential & Community Problem Solving",
      verificationHash: "8f4803227a84e9f44141c65dc42cbc822585cc3008fa074780ff32431b5c93b5",
      issueDate: "2026-09-05T11:00:00.000Z",
    },
    {
      certificateNumber: "JH-NEP-1725621456-7832",
      studentName: "Priya Sharma",
      universityName: "IIT ISM Dhanbad",
      department: "Electrical & Renewable Energy",
      challengeTitle: "Smart Micro-Grid Solar Backup for Pokharia Village",
      nepCreditsAwarded: 4,
      courseCategory: "NEP 2020 Experiential & Community Problem Solving",
      verificationHash: "b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9",
      issueDate: "2026-09-04T16:30:00.000Z",
    },
  ];

  const handleOpenCert = (cert) => {
    setActiveCert(cert);
    setShowModal(true);
  };

  return (
    <div className="min-h-screen bg-warm-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-2xl border border-navy-100 shadow-sm">
          <div>
            <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200 mb-2">
              <Award className="w-3.5 h-3.5 text-amber-600" />
              National Education Policy (NEP 2020) Credits
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-950">
              Academic Credit Certificates & Verification
            </h1>
            <p className="text-xs sm:text-sm text-navy-600 mt-1">
              Tamper-proof, digitally signed certificates conferring 4 NEP experiential credits for students solving real-world civic challenges.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link to="/verify">
              <Button variant="outline" className="text-xs flex items-center gap-1.5 border-navy-300">
                <QrCode className="w-4 h-4 text-navy-700" /> Public QR Verifier
              </Button>
            </Link>
          </div>
        </div>

        {/* Certificate Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sampleCertificates.map((cert) => (
            <div
              key={cert.certificateNumber}
              className="bg-white rounded-2xl p-6 border-2 border-amber-100 shadow-sm hover:shadow-md hover:border-amber-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-300 text-amber-700 flex items-center justify-center font-bold">
                    <Award className="w-5 h-5 text-amber-600" />
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-amber-500 text-white shadow-sm">
                    {cert.nepCreditsAwarded} NEP Credits
                  </span>
                </div>

                <h3 className="font-bold text-navy-950 text-lg">{cert.studentName}</h3>
                <p className="text-xs font-semibold text-amber-800 mt-0.5">
                  {cert.universityName} • {cert.department}
                </p>

                <div className="mt-4 p-3 bg-amber-50/60 rounded-xl border border-amber-200/80">
                  <p className="text-[10px] uppercase font-bold text-navy-500">Solved Challenge</p>
                  <p className="text-xs font-medium text-navy-900 line-clamp-2 mt-0.5">
                    {cert.challengeTitle}
                  </p>
                </div>

                <div className="mt-3 flex items-center gap-1.5 text-[11px] text-green-700 font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5" /> SHA-256 Tamper-Proof Cryptographic Seal
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-navy-100 flex items-center justify-between">
                <span className="text-[10px] font-mono text-navy-400">
                  {cert.certificateNumber}
                </span>

                <Button
                  size="sm"
                  onClick={() => handleOpenCert(cert)}
                  className="bg-navy-900 hover:bg-navy-800 text-white text-xs flex items-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5" /> View Certificate
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Certificate Modal */}
        <CertificateModal
          certificate={activeCert}
          isOpen={showModal}
          onClose={() => setShowModal(false)}
        />
      </div>
    </div>
  );
}

export default CertificatesPage;
