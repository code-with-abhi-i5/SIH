import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { LandingPage } from "@/pages/LandingPage";
import { AuthPage } from "@/pages/AuthPage";
import { ReportPage } from "@/pages/ReportPage";
import { DashboardPage } from "@/pages/DashboardPage";
import { Chatbot } from "@/components/ui/Chatbot";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/report" element={<ReportPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
      </Routes>
      <Chatbot />
    </Router>
  );
}

export default App;
