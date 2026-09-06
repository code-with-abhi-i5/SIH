import { useEffect, useRef } from "react";
import gsap from "gsap";
import {
  Construction,
  Droplets,
  GraduationCap,
  Trash2,
  HeartPulse,
  Zap,
  Leaf,
  Wheat,
} from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";

const categories = [
  {
    icon: Construction,
    title: "Roads & Infrastructure",
    description: "Potholes, broken bridges, damaged public facilities.",
    accent: "from-navy-900/5 to-navy-900/10",
  },
  {
    icon: Droplets,
    title: "Water & Sanitation",
    description: "Supply shortages, fluoride contamination, pipeline leaks.",
    accent: "from-blue-500/5 to-blue-500/10",
  },
  {
    icon: GraduationCap,
    title: "Education",
    description: "School infrastructure, access, learning resources.",
    accent: "from-saffron-500/5 to-saffron-500/10",
  },
  {
    icon: Trash2,
    title: "Sanitation",
    description: "Waste management, drainage, public hygiene.",
    accent: "from-green-500/5 to-green-500/10",
  },
  {
    icon: HeartPulse,
    title: "Healthcare",
    description: "Medical access, facility gaps, health services.",
    accent: "from-red-500/5 to-red-500/10",
  },
  {
    icon: Zap,
    title: "Clean Energy",
    description: "Power outages, solar microgrids, grid issues.",
    accent: "from-yellow-500/5 to-yellow-500/10",
  },
  {
    icon: Leaf,
    title: "Environment",
    description: "Pollution, deforestation, ecological concerns.",
    accent: "from-emerald-500/5 to-emerald-500/10",
  },
  {
    icon: Wheat,
    title: "Agriculture & Rural",
    description: "Crop issues, irrigation, rural livelihood challenges.",
    accent: "from-amber-500/5 to-amber-500/10",
  },
];

export function ChallengeCategories() {
  const { t } = useLanguage();
  const sectionRef = useRef(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from(".cat-card-item", {
        y: 20,
        opacity: 0,
        stagger: 0.06,
        duration: 0.5,
        ease: "power2.out",
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="challenges" ref={sectionRef} className="section-padding bg-warm-50 relative">
      <div className="container-narrow mx-auto">
        <div className="text-center mb-12 md:mb-16">
          <p className="text-xs font-semibold tracking-[0.15em] text-navy-500 uppercase mb-3">
            {t("cat.label")}
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-navy-900">
            {t("cat.title")}
          </h2>
          <p className="mt-3 text-base text-navy-600 max-w-xl mx-auto">
            {t("cat.desc")}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {categories.map((cat) => (
            <div
              key={cat.title}
              className="cat-card-item group relative bg-white rounded-2xl border border-navy-100 p-5 hover:shadow-lg hover:shadow-navy-900/5 hover:border-navy-200 transition-all duration-300 cursor-default overflow-hidden"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${cat.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                aria-hidden="true"
              />
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-navy-50 border border-navy-100 flex items-center justify-center mb-4 group-hover:bg-white group-hover:border-navy-200 transition-colors shadow-sm">
                  <cat.icon size={20} className="text-navy-700" />
                </div>
                <h3 className="font-bold text-navy-900 mb-1.5 text-sm sm:text-base">
                  {cat.title}
                </h3>
                <p className="text-xs sm:text-sm text-navy-500 leading-relaxed">
                  {cat.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ChallengeCategories;
