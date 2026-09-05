import { Logo } from "./Logo";
import { useLanguage } from "../../contexts/LanguageContext";

export function Footer() {
  const { t } = useLanguage();

  const platformLinks = [
    { label: t("nav.home"), href: "#home" },
    { label: t("link.how"), href: "#how-it-works" },
    { label: t("nav.challenges"), href: "#challenges" },
    { label: t("nav.impact"), href: "#impact" },
  ];

  const resourceLinks = [
    { label: t("link.help"), href: "#" },
    { label: t("link.faqs"), href: "#" },
    { label: t("link.access"), href: "#" },
    { label: t("link.privacy"), href: "#" },
  ];

  const connectLinks = [
    { label: t("link.contact"), href: "#" },
    { label: t("link.support"), href: "#" },
  ];

  return (
    <footer id="about" className="bg-navy-950 text-navy-300">
      <div className="container-narrow mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
          <div className="lg:col-span-2">
            <Logo variant="light" size="lg" />
            <p className="mt-4 text-sm text-navy-400 max-w-sm leading-relaxed">
              {t("footer.tagline")}
            </p>
            <p className="mt-2 text-xs text-navy-500">
              {t("footer.sub")}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white mb-4">{t("footer.col1")}</h3>
            <ul className="space-y-3">
              {platformLinks.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-sm hover:text-white transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white mb-4">{t("footer.col2")}</h3>
            <ul className="space-y-3">
              {resourceLinks.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-sm hover:text-white transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white mb-4">{t("footer.col3")}</h3>
            <ul className="space-y-3">
              {connectLinks.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-sm hover:text-white transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-navy-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-navy-500">{t("footer.cpr")}</p>
          <p className="text-xs text-navy-500 text-center">
            {t("footer.proto")}
          </p>
        </div>
      </div>
    </footer>
  );
}
