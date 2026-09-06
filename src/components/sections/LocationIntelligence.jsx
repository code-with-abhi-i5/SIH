import { useEffect, useRef } from "react";
import gsap from "gsap";
import { MapPin, Layers } from "lucide-react";
import { JharkhandMap } from "@/components/visuals/JharkhandMap";
import { useLanguage } from "../../contexts/LanguageContext";

export function LocationIntelligence() {
  const { t } = useLanguage();
  const sectionRef = useRef(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from(".loc-anim-item", {
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
    <section ref={sectionRef} className="section-padding bg-white relative overflow-hidden">
      <div className="container-narrow mx-auto">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div className="order-2 lg:order-1">
            <div className="relative rounded-3xl bg-navy-50 border border-navy-100 p-6 md:p-8 overflow-hidden shadow-inner">
              <div className="absolute top-4 left-4 flex items-center gap-2 z-10">
                <Layers size={14} className="text-navy-500" />
                <span className="text-[10px] font-bold tracking-widest text-navy-500 uppercase">
                  Spatial Intelligence View
                </span>
              </div>
              <JharkhandMap
                variant="location"
                className="w-full h-auto max-h-[360px]"
                showNodes
                showConnections={false}
                showHeatmap
              />

              {/* Legend */}
              <div className="mt-4 flex flex-wrap gap-4 text-xs text-navy-600">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-saffron-500 opacity-60" />
                  Problem clusters
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-green-500 opacity-60" />
                  Resolution areas
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin size={12} className="text-navy-500" />
                  Location markers
                </div>
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <p className="loc-anim-item text-xs font-semibold tracking-[0.15em] text-navy-500 uppercase mb-3">
              {t("loc.label")}
            </p>
            <h2 className="loc-anim-item text-3xl sm:text-4xl font-extrabold text-navy-900 leading-tight">
              {t("loc.title")}
            </h2>
            <p className="loc-anim-item mt-4 text-base text-navy-600 leading-relaxed">
              GIS-backed spatial analytics identify critical crisis hotspots, evaluate district cluster density, and guide university teams to highest-impact rural interventions.
            </p>

            <div className="loc-anim-item mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-navy-50 border border-navy-100 text-xs text-navy-600 font-medium">
              <Layers size={14} className="text-amber-600" />
              Real-time synchronization with State Disaster & Municipal hotlines
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default LocationIntelligence;
