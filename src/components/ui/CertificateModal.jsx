import { useRef } from "react";
import { X, Award, ShieldCheck, Download, Printer, CheckCircle, QrCode } from "lucide-react";
import { Button } from "./button";

export function CertificateModal({ certificate, isOpen, onClose }) {
  const certRef = useRef(null);

  if (!isOpen || !certificate) return null;

  const handlePrint = () => {
    window.print();
  };

  const verifyUrl = `${window.location.origin}/verify/${certificate.certificateNumber || certificate.verificationHash}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(
    verifyUrl
  )}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/70 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-amber-200/80 my-8">
        {/* Header Actions */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-200/60 print:hidden">
          <div className="flex items-center gap-2">
            <Award className="w-6 h-6 text-amber-600" />
            <span className="font-bold text-navy-900 text-sm md:text-base">
              NEP 2020 Experiential Learning Credit Certificate
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handlePrint} className="flex items-center gap-1.5 text-xs">
              <Printer className="w-3.5 h-3.5" />
              Print / Save PDF
            </Button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-navy-500 hover:bg-navy-100 hover:text-navy-900 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Certificate Printable Area */}
        <div ref={certRef} className="p-8 md:p-12 bg-[#fdfbf7] relative">
          {/* Ornate Golden Borders */}
          <div className="border-4 border-double border-amber-500/60 p-6 md:p-8 rounded-xl relative bg-white shadow-inner">
            {/* Watermark Emblem */}
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
              <Award className="w-96 h-96 text-navy-900" />
            </div>

            {/* Top Seal & Govt Header */}
            <div className="text-center border-b border-amber-200/80 pb-6 mb-6">
              <div className="flex items-center justify-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white font-black text-xl shadow-md border-2 border-white">
                  🏛️
                </div>
              </div>
              <p className="text-xs uppercase tracking-widest text-amber-800 font-bold">
                Govt. of Jharkhand • Dept. of Higher & Technical Education
              </p>
              <h2 className="text-2xl md:text-3xl font-serif font-black text-navy-900 tracking-tight mt-1">
                Certificate of Academic Credits
              </h2>
              <p className="text-xs text-navy-500 font-medium mt-1">
                National Education Policy (NEP 2020) — Community Problem Solving & Experiential Track
              </p>
            </div>

            {/* Recipient Details */}
            <div className="text-center my-6 space-y-3">
              <p className="text-xs uppercase tracking-wider text-navy-500 font-semibold">
                This is proudly conferred to
              </p>
              <h3 className="text-2xl md:text-3xl font-serif font-extrabold text-navy-950 underline decoration-amber-400/60 underline-offset-8">
                {certificate.studentName || "Aman Kumar"}
              </h3>
              <p className="text-sm text-navy-700 font-medium">
                from <strong className="text-navy-900">{certificate.universityName || "BIT Mesra / Ranchi University"}</strong>, Department of{" "}
                <strong className="text-navy-900">{certificate.department || "Civil & Environmental Engineering"}</strong>
              </p>
              <p className="text-xs md:text-sm text-navy-600 max-w-xl mx-auto italic">
                for demonstrating technical excellence and civic impact in solving the real-world civic challenge:
              </p>
              <div className="bg-amber-50/80 border border-amber-200/60 rounded-lg p-3 max-w-xl mx-auto">
                <p className="font-semibold text-xs md:text-sm text-amber-950">
                  "{certificate.challengeTitle || "Fluoride Contamination and Water Infrastructure in Angara"}"
                </p>
              </div>
            </div>

            {/* Credit Badge & Hash Details */}
            <div className="my-8 flex flex-col md:flex-row items-center justify-between gap-6 border-t border-b border-amber-200/80 py-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 text-white flex flex-col items-center justify-center shadow-lg border-2 border-amber-200">
                  <span className="text-2xl font-black leading-none">{certificate.nepCreditsAwarded || certificate.nepCredits || 4}</span>
                  <span className="text-[9px] uppercase font-bold tracking-wider mt-0.5">Credits</span>
                </div>
                <div>
                  <h4 className="font-bold text-navy-900 text-sm">NEP 2020 Academic Credits</h4>
                  <p className="text-xs text-navy-500">Transferred to Academic Bank of Credits (ABC-ID)</p>
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-green-700 mt-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> Official Verified Transcript
                  </span>
                </div>
              </div>

              {/* QR Code */}
              <div className="flex items-center gap-3 bg-white p-2.5 rounded-xl border border-navy-100 shadow-sm">
                <img
                  src={qrCodeUrl}
                  alt="Certificate Verification QR Code"
                  className="w-20 h-20 rounded-lg border border-navy-100"
                />
                <div className="text-left">
                  <p className="text-[10px] uppercase font-bold text-navy-400">Tamper-Proof QR</p>
                  <p className="text-[11px] font-bold text-navy-800">Scan to Verify</p>
                  <p className="text-[9px] text-navy-500 max-w-[120px] font-mono truncate">
                    {certificate.certificateNumber || "JH-NEP-2026-9812"}
                  </p>
                </div>
              </div>
            </div>

            {/* Footer Signatures */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-4 text-center items-end">
              <div>
                <div className="font-serif italic font-bold text-navy-800 text-sm">Dr. S. K. Verma</div>
                <div className="border-t border-navy-300 pt-1 mt-1 text-[11px] text-navy-600 font-medium">
                  Faculty Mentor / Dean
                </div>
              </div>

              <div className="hidden md:block">
                <div className="w-12 h-12 mx-auto rounded-full border-2 border-amber-400 bg-amber-50 flex items-center justify-center text-amber-600 mb-1">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <div className="text-[10px] text-navy-400 font-mono">SHA-256 HASH VERIFIED</div>
              </div>

              <div>
                <div className="font-serif italic font-bold text-navy-800 text-sm">Govt. of Jharkhand</div>
                <div className="border-t border-navy-300 pt-1 mt-1 text-[11px] text-navy-600 font-medium">
                  State Higher Education Council
                </div>
              </div>
            </div>

            {/* SHA Hash footnote */}
            <div className="mt-6 pt-3 border-t border-navy-100 text-[9px] font-mono text-navy-400 text-center truncate">
              Verification Hash: {certificate.verificationHash || "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CertificateModal;
