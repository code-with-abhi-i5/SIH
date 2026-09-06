import { useEffect, useRef } from "react";
import gsap from "gsap";
import { FileText, Link2, Loader, Users, CheckCircle } from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";

export function Impact() {
  const { t } = useLanguage();
  const sectionRef = useRef(null);

  const metrics = [
    {
      icon: FileText,
      label: "Reported Issues",
      value: "142+",
      status: "Verified",
      description: "Across 24 Jharkhand districts",
    },
    {
      icon: Link2,
      label: "Active Proposals",
      value: "51",
      status: "In Development",
      description: "Student prototypes solving civic pain points",
    },
    {
      icon: Loader,
      label: "Resolved Challenges",
      value: "38",
      status: "Deployed",
      description: "Field tested with community impact",
    },
    {
      icon: Users,
      label: "Participating HEIs",
      value: "14",
      status: "Accredited",
      description: "Universities granting NEP 2020 credits",
    },
  ];

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from(".impact-card", {
        y: 20,
        opacity: 0,
        stagger: 0.1,
        duration: 0.6,
        ease: "power2.out",
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="impact" ref={sectionRef} className="section-padding bg-warm-50 relative">
      <div className="container-narrow mx-auto">
        <div className="text-center mb-12 md:mb-16">
          <p className="text-xs font-semibold tracking-[0.15em] text-navy-500 uppercase mb-3">
            {t("imp.label")}
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-navy-900">
            {t("imp.title")}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {metrics.map((metric) => (
            <div
              key={metric.label}
              className="impact-card bg-white rounded-2xl border border-navy-100 p-6 hover:shadow-md hover:shadow-navy-900/5 transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-navy-50 flex items-center justify-center shadow-sm">
                  <metric.icon size={20} className="text-navy-600" />
                </div>
                <span className="text-[10px] font-bold tracking-widest uppercase px-2 py-1 rounded-md bg-amber-50 text-amber-800 border border-amber-200">
                  {metric.status}
                </span>
              </div>
              <p className="text-3xl font-extrabold text-navy-900 mb-1">
                {metric.value}
              </p>
              <p className="text-sm font-semibold text-navy-700 mb-1">
                {metric.label}
              </p>
              <p className="text-xs text-navy-400">{metric.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Impact;
