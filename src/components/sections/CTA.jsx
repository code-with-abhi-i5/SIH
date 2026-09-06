import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { JharkhandMap } from "@/components/visuals/JharkhandMap";
import { useLanguage } from "../../contexts/LanguageContext";

export function CTA() {
  const { t } = useLanguage();
  const ctaRef = useRef(null);

  useEffect(() => {
    if (!ctaRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from(".cta-anim-item", {
        y: 20,
        opacity: 0,
        stagger: 0.12,
        duration: 0.6,
        ease: "power2.out",
      });
    }, ctaRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={ctaRef} className="relative overflow-hidden">
      <div className="bg-navy-950 text-white section-padding relative">
        <div className="absolute inset-0 opacity-20" aria-hidden="true">
          <JharkhandMap
            variant="cta"
            className="w-full h-full absolute inset-0 scale-150 opacity-30"
            showNodes
            showConnections={false}
          />
        </div>
        <div className="absolute inset-0 grid-texture opacity-5" aria-hidden="true" />

        <div className="container-narrow mx-auto relative text-center">
          <h2 className="cta-anim-item text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight text-balance max-w-2xl mx-auto">
            {t("cta.title")}
          </h2>
          <p className="cta-anim-item mt-4 text-base sm:text-lg text-navy-300 max-w-lg mx-auto">
            {t("cta.desc")}
          </p>

          <div className="cta-anim-item mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Link to="/report">
              <Button size="lg" className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 text-white group shadow-xl">
                {t("hero.btn.report")}
                <ArrowRight
                  size={18}
                  className="transition-transform group-hover:translate-x-0.5 ml-1.5"
                />
              </Button>
            </Link>
            <Link to="/challenges">
              <Button
                variant="outline"
                size="lg"
                className="border-white/30 text-white hover:bg-white hover:text-navy-900"
              >
                {t("hero.btn.explore")}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CTA;
