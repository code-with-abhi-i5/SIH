import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import gsap from "gsap";
import {
  Menu,
  X,
  PlusCircle,
  LayoutDashboard,
  Compass,
  Lightbulb,
  Building2,
  MapPin,
  Award,
  LogOut,
  User,
  ShieldCheck,
  ChevronDown,
} from "lucide-react";
import { Logo } from "./Logo";
import { Button } from "@/components/ui/button";
import { useScrollPosition } from "@/hooks/useScrollPosition";
import { cn } from "@/lib/utils";
import { useLanguage } from "../../contexts/LanguageContext";
import { useAuth, ROLE_LABELS } from "../../contexts/AuthContext";

export function Navbar() {
  const { isScrolled } = useScrollPosition();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userDropdown, setUserDropdown] = useState(false);
  const { language: lang, setLanguage: setLang, t } = useLanguage();
  const { user, role, logout, isAuthenticated, switchDemoRole } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const navLinks = [
    { label: "Home", href: "/", icon: null },
    { label: "Challenges", href: "/challenges", icon: Compass },
    { label: "University Hub", href: "/proposals", icon: Lightbulb },
    { label: "CSR Escrow", href: "/csr", icon: Building2 },
    { label: "GIS Heatmap", href: "/gis", icon: MapPin },
    { label: "NEP Credits", href: "/certificates", icon: Award },
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  ];

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const handleLogout = async () => {
    await logout();
    setUserDropdown(false);
    navigate("/");
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-white/95 backdrop-blur-lg shadow-sm shadow-navy-900/5 border-b border-navy-100/80 py-2.5"
          : "bg-white/80 backdrop-blur-md border-b border-navy-100/50 py-3.5"
      )}
    >
      <nav className="container-narrow mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between" aria-label="Main navigation">
        <Link to="/" className="shrink-0 flex items-center gap-2">
          <Logo size="md" />
        </Link>

        {/* Desktop Nav Links */}
        <ul className="hidden xl:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.href;
            return (
              <li key={link.href}>
                <Link
                  to={link.href}
                  className={cn(
                    "px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5",
                    isActive
                      ? "bg-navy-900 text-white shadow-sm"
                      : "text-navy-700 hover:text-navy-950 hover:bg-navy-50"
                  )}
                >
                  {link.icon && <link.icon className="w-3.5 h-3.5 opacity-80" />}
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Right Action Items */}
        <div className="hidden lg:flex items-center gap-2.5">
          {/* Language Switcher */}
          <div
            className="flex items-center rounded-lg border border-navy-200 bg-white p-0.5"
            role="group"
            aria-label="Language selector"
          >
            <button
              onClick={() => setLang("en")}
              className={cn(
                "px-2.5 py-1 text-xs font-semibold rounded-md transition-colors",
                lang === "en" ? "bg-navy-900 text-white" : "text-navy-600 hover:text-navy-900"
              )}
            >
              EN
            </button>
            <button
              onClick={() => setLang("hi")}
              className={cn(
                "px-2.5 py-1 text-xs font-semibold rounded-md transition-colors",
                lang === "hi" ? "bg-navy-900 text-white" : "text-navy-600 hover:text-navy-900"
              )}
            >
              हिं
            </button>
          </div>

          {/* Quick Report Challenge Button */}
          <Link to="/report">
            <Button size="sm" className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-sm flex items-center gap-1.5 text-xs px-3">
              <PlusCircle className="w-3.5 h-3.5" />
              Report Issue
            </Button>
          </Link>

          {/* Auth State / Profile Menu */}
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdown(!userDropdown)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-navy-200 bg-navy-50/50 hover:bg-navy-100/70 transition-colors text-left"
              >
                <div className="w-6 h-6 rounded-full bg-navy-900 text-white flex items-center justify-center text-xs font-bold">
                  {(user?.name || "U")[0].toUpperCase()}
                </div>
                <div className="text-left hidden sm:block">
                  <p className="text-xs font-bold text-navy-900 leading-none truncate max-w-[100px]">
                    {user?.name || "User"}
                  </p>
                  <p className="text-[10px] text-amber-700 font-semibold uppercase leading-tight mt-0.5">
                    {role}
                  </p>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-navy-500" />
              </button>

              {/* Dropdown Menu */}
              {userDropdown && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-navy-100 py-2 z-50">
                  <div className="px-3.5 py-2 border-b border-navy-100">
                    <p className="text-xs font-bold text-navy-900">{user?.name || "User"}</p>
                    <p className="text-[11px] text-navy-500 truncate">{user?.email || "user@jansamadhan.gov.in"}</p>
                    <div className="mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                      <ShieldCheck className="w-3 h-3" /> {ROLE_LABELS[role] || role}
                    </div>
                  </div>

                  {/* Switch Persona for Demo */}
                  <div className="px-3.5 py-2 border-b border-navy-100">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-navy-400 mb-1.5">
                      Switch Demo Role
                    </p>
                    <div className="grid grid-cols-2 gap-1">
                      {["citizen", "student", "faculty", "industry", "admin"].map((r) => (
                        <button
                          key={r}
                          onClick={() => {
                            switchDemoRole(r);
                            setUserDropdown(false);
                          }}
                          className={cn(
                            "px-2 py-1 text-[10px] font-semibold rounded capitalize text-left transition-colors",
                            role === r ? "bg-navy-900 text-white" : "text-navy-600 hover:bg-navy-50"
                          )}
                        >
                          {r}
                        </button>
                      ))}
                    </div>
                  </div>

                  <Link
                    to="/dashboard"
                    onClick={() => setUserDropdown(false)}
                    className="flex items-center gap-2 px-3.5 py-2 text-xs text-navy-700 hover:bg-navy-50"
                  >
                    <LayoutDashboard className="w-4 h-4 text-navy-500" />
                    Role Dashboard
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3.5 py-2 text-xs text-red-600 hover:bg-red-50 text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/auth">
              <Button variant="outline" size="sm" className="text-xs px-3">
                Sign In
              </Button>
            </Link>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="xl:hidden p-2 rounded-lg text-navy-700 hover:bg-navy-100"
          aria-label="Toggle Menu"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6 text-navy-900" />}
        </button>
      </nav>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="xl:hidden bg-white border-b border-navy-200 px-4 py-4 space-y-2 shadow-lg animate-in fade-in slide-in-from-top-2 duration-200">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-navy-800 rounded-lg hover:bg-navy-50"
            >
              {link.icon && <link.icon className="w-4 h-4 text-navy-500" />}
              {link.label}
            </Link>
          ))}

          <div className="pt-3 border-t border-navy-100 flex items-center justify-between gap-3">
            <Link to="/report" onClick={() => setMobileOpen(false)} className="w-full">
              <Button size="sm" className="w-full bg-amber-500 hover:bg-amber-600 text-white">
                Report Civic Issue
              </Button>
            </Link>
            {isAuthenticated ? (
              <Button variant="outline" size="sm" onClick={handleLogout} className="text-red-600">
                Logout
              </Button>
            ) : (
              <Link to="/auth" onClick={() => setMobileOpen(false)} className="w-full">
                <Button variant="outline" size="sm" className="w-full">
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
