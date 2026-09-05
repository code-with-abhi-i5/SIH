import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Logo } from "./Logo";
import { Button } from "@/components/ui/button";
import { useScrollPosition } from "@/hooks/useScrollPosition";
import { cn } from "@/lib/utils";
import { useLanguage } from "../../contexts/LanguageContext";

export function Navbar() {
  const { isScrolled } = useScrollPosition();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { language: lang, setLanguage: setLang, t } = useLanguage();

  const navLinks = [
    { label: t("nav.home"), href: "/#home" },
    { label: "How It Works", href: "/#how-it-works" },
    { label: t("nav.challenges"), href: "/#challenges" },
    { label: t("nav.impact"), href: "/#impact" },
    { label: "About", href: "/#about" },
  ];

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-white/90 backdrop-blur-lg shadow-sm shadow-navy-900/5 border-b border-navy-100/80 py-3"
          : "bg-transparent py-4 md:py-5"
      )}
    >
      <nav className="container-narrow mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between" aria-label="Main navigation">
        <Link to="/" className="shrink-0">
          <Logo size="md" />
        </Link>

        {/* Desktop nav */}
        <ul className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="px-4 py-2 text-sm font-medium text-navy-600 hover:text-navy-900 rounded-lg hover:bg-navy-50 transition-colors"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden lg:flex items-center gap-3">
          <div
            className="flex items-center rounded-lg border border-navy-200 bg-white p-0.5"
            role="group"
            aria-label="Language selector"
          >
            <button
              onClick={() => setLang("en")}
              className={cn(
                "px-3 py-1.5 text-xs font-semibold rounded-md transition-colors",
                lang === "en" ? "bg-navy-900 text-white" : "text-navy-600 hover:text-navy-900"
              )}
              aria-pressed={lang === "en"}
            >
              EN
            </button>
            <button
              onClick={() => setLang("hi")}
              className={cn(
                "px-3 py-1.5 text-xs font-semibold rounded-md transition-colors font-[family-name:var(--font-sans)]",
                lang === "hi" ? "bg-navy-900 text-white" : "text-navy-600 hover:text-navy-900"
              )}
              aria-pressed={lang === "hi"}
            >
              हिं
            </button>
          </div>

          {localStorage.getItem("token") ? (
            <Link to="/dashboard">
              <Button variant="ghost" size="sm">
                Dashboard
              </Button>
            </Link>
          ) : (
            <Link to="/auth">
              <Button variant="ghost" size="sm">
                {t("nav.login")}
              </Button>
            </Link>
          )}
          <Link to="/report">
            <Button variant="primary" size="md">
              {t("hero.btn.report")}
            </Button>
          </Link>
        </div>

        {/* Mobile controls */}
        <div className="flex lg:hidden items-center gap-2">
          <div className="flex items-center rounded-lg border border-navy-200 bg-white p-0.5">
            <button
              onClick={() => setLang("en")}
              className={cn(
                "px-2 py-1 text-xs font-semibold rounded-md",
                lang === "en" ? "bg-navy-900 text-white" : "text-navy-600"
              )}
              aria-pressed={lang === "en"}
            >
              EN
            </button>
            <button
              onClick={() => setLang("hi")}
              className={cn(
                "px-2 py-1 text-xs font-semibold rounded-md",
                lang === "hi" ? "bg-navy-900 text-white" : "text-navy-600"
              )}
              aria-pressed={lang === "hi"}
            >
              हिं
            </button>
          </div>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 rounded-lg text-navy-700 hover:bg-navy-100 transition-colors"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 top-[60px] bg-navy-900/20 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden absolute top-full left-0 right-0 bg-white border-b border-navy-100 shadow-xl"
            >
              <ul className="px-4 py-4 space-y-1">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className="block px-4 py-3 text-base font-medium text-navy-700 hover:text-navy-900 hover:bg-navy-50 rounded-xl transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
              <div className="px-4 pb-6 pt-2 space-y-3 border-t border-navy-100">
                {localStorage.getItem("token") ? (
                  <Link to="/dashboard" className="w-full" onClick={() => setMobileOpen(false)}>
                    <Button variant="ghost" className="w-full" size="lg">
                      Dashboard
                    </Button>
                  </Link>
                ) : (
                  <Link to="/auth" className="w-full" onClick={() => setMobileOpen(false)}>
                    <Button variant="ghost" className="w-full" size="lg">
                      {t("nav.login")}
                    </Button>
                  </Link>
                )}
                <Link to="/report" className="w-full" onClick={() => setMobileOpen(false)}>
                  <Button variant="primary" className="w-full" size="lg">
                    {t("hero.btn.report")}
                  </Button>
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
