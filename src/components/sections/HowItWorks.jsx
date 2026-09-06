import { useRef, useEffect } from "react";
import gsap from "gsap";
import { Camera, Brain, Network, CheckCircle2 } from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";

export function HowItWorks() {
  const { t } = useLanguage();
  const sectionRef = useRef(null);

  const steps = [
    {
      number: "01",
      title: t("hiw.s1.title"),
      description: t("hiw.s1.desc"),
      icon: Camera,
      color: "bg-navy-900",
    },
    {
      number: "02",
      title: t("hiw.s2.title"),
      description: t("hiw.s2.desc"),
      icon: Brain,
      color: "bg-saffron-500",
    },
    {
      number: "03",
      title: t("hiw.s3.title"),
      description: t("hiw.s3.desc"),
      icon: Network,
      color: "bg-navy-700",
    },
    {
      number: "04",
      title: t("hiw.s4.title"),
      description: t("hiw.s4.desc"),
      icon: CheckCircle2,
      color: "bg-green-600",
    },
  ];

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from(".how-step-card", {
        y: 30,
        opacity: 0,
        stagger: 0.15,
        duration: 0.7,
        ease: "power3.out",
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="how-it-works" ref={sectionRef} className="section-padding bg-warm-50 relative">
      <div className="container-narrow mx-auto">
        <div className="text-center mb-12 md:mb-16">
          <p className="text-xs font-semibold tracking-[0.15em] text-navy-500 uppercase mb-3">
            {t("hiw.process")}
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-navy-900">
            {t("hiw.title")}
          </h2>
        </div>

        {/* Desktop connecting line */}
        <div className="hidden lg:block relative mb-0">
          <div className="absolute top-[52px] left-[12.5%] right-[12.5%] h-0.5 bg-navy-100">
            <div className="h-full bg-gradient-to-r from-navy-900 via-saffron-500 to-green-600 origin-left w-full" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-4">
          {steps.map((step) => (
            <div
              key={step.number}
              className="how-step-card relative group"
            >
              <div className="bg-white rounded-2xl border border-navy-100 p-6 h-full hover:shadow-lg hover:shadow-navy-900/5 hover:border-navy-200 transition-all duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className={`w-10 h-10 rounded-xl ${step.color} flex items-center justify-center shadow-md`}
                  >
                    <step.icon size={20} className="text-white" />
                  </div>
                  <span className="text-3xl font-extrabold text-navy-100 group-hover:text-navy-200 transition-colors">
                    {step.number}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-navy-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-navy-600 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;
