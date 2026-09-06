import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { LandingPage } from "@/pages/LandingPage";
import { AuthPage } from "@/pages/AuthPage";
import { ReportPage } from "@/pages/ReportPage";
import { ChallengesPage } from "@/pages/ChallengesPage";
import { ProposalsPage } from "@/pages/ProposalsPage";
import { CertificatesPage } from "@/pages/CertificatesPage";
import { CertificateVerifyPage } from "@/pages/CertificateVerifyPage";
import { CsrEscrowPage } from "@/pages/CsrEscrowPage";
import { GisMapPage } from "@/pages/GisMapPage";
import { DashboardPage } from "@/pages/DashboardPage";
import { Chatbot } from "@/components/ui/Chatbot";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/report" element={<ReportPage />} />
        <Route path="/challenges" element={<ChallengesPage />} />
        <Route path="/proposals" element={<ProposalsPage />} />
        <Route path="/certificates" element={<CertificatesPage />} />
        <Route path="/verify" element={<CertificateVerifyPage />} />
        <Route path="/verify/:certIdOrHash" element={<CertificateVerifyPage />} />
        <Route path="/csr" element={<CsrEscrowPage />} />
        <Route path="/gis" element={<GisMapPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
      </Routes>
      <Chatbot />
    </Router>
  );
}

export default App;
