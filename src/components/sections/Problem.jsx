import { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import { ArrowDown } from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";

export function Problem() {
  const [showConnected, setShowConnected] = useState(false);
  const { t } = useLanguage();
  const flowContainerRef = useRef(null);

  const disconnectedFlow = [
    t("prob.old.step1"),
    t("prob.old.step2"),
    t("prob.old.step3"),
    t("prob.old.step4"),
  ];

  const connectedFlow = [
    t("prob.new.step1"),
    t("prob.new.step2"),
    t("prob.new.step3"),
    t("prob.new.step4"),
    t("prob.new.step5"),
  ];

  useEffect(() => {
    if (!flowContainerRef.current) return;
    gsap.fromTo(
      flowContainerRef.current.children,
      { opacity: 0, y: 15, scale: 0.95 },
      { opacity: 1, y: 0, scale: 1, stagger: 0.1, duration: 0.4, ease: "power2.out" }
    );
  }, [showConnected]);

  return (
    <section className="section-padding bg-white relative overflow-hidden">
      <div className="container-narrow mx-auto">
        <div className="max-w-3xl mx-auto text-center mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-[2.75rem] font-extrabold text-navy-900 leading-tight text-balance">
            {t("prob.title")}
          </h2>
          <p className="mt-4 text-base sm:text-lg text-navy-600 leading-relaxed">
            {t("prob.desc")}
          </p>
        </div>

        <div className="max-w-md mx-auto">
          <div ref={flowContainerRef} className="space-y-0">
            {!showConnected ? (
              <>
                {disconnectedFlow.map((step, i) => (
                  <div key={step} className="flex flex-col items-center">
                    <div
                      className={`w-full max-w-xs px-6 py-4 rounded-2xl text-center font-semibold text-sm sm:text-base transition-transform hover:scale-102 ${
                        i === disconnectedFlow.length - 1
                          ? "bg-red-50 text-red-700 border border-red-100"
                          : i === 0
                          ? "bg-navy-900 text-white"
                          : "bg-navy-50 text-navy-700 border border-navy-100"
                      }`}
                    >
                      {step}
                    </div>
                    {i < disconnectedFlow.length - 1 && (
                      <ArrowDown className="w-5 h-5 text-navy-300 my-2" aria-hidden="true" />
                    )}
                  </div>
                ))}
              </>
            ) : (
              <>
                {connectedFlow.map((step, i) => (
                  <div key={step} className="flex flex-col items-center">
                    <div
                      className={`w-full max-w-xs px-6 py-4 rounded-2xl text-center font-semibold text-sm sm:text-base transition-transform hover:scale-102 ${
                        i === connectedFlow.length - 1
                          ? "bg-green-50 text-green-700 border border-green-100"
                          : i === 1
                          ? "bg-navy-900 text-white"
                          : i === 2
                          ? "bg-saffron-100 text-saffron-600 border border-saffron-100"
                          : "bg-navy-50 text-navy-700 border border-navy-100"
                      }`}
                    >
                      {step}
                    </div>
                    {i < connectedFlow.length - 1 && (
                      <ArrowDown className="w-5 h-5 text-green-500 my-2" aria-hidden="true" />
                    )}
                  </div>
                ))}
              </>
            )}
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={() => setShowConnected(!showConnected)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-navy-900 text-white text-sm font-semibold hover:bg-navy-800 transition-colors"
              aria-pressed={showConnected}
            >
              {showConnected ? t("prob.btn.old") : t("prob.btn.new")}
              <ArrowDown
                size={16}
                className={`transition-transform ${showConnected ? "rotate-180" : ""}`}
              />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Problem;
