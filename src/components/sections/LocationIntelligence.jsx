import { motion } from "framer-motion";
import { MapPin, Layers } from "lucide-react";
import { JharkhandMap } from "@/components/visuals/JharkhandMap";
import { useLanguage } from "../../contexts/LanguageContext";

export function LocationIntelligence() {
  const { t } = useLanguage();
  return (
    <section className="section-padding bg-white relative overflow-hidden">
      <div className="container-narrow mx-auto">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div className="order-2 lg:order-1">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative rounded-3xl bg-navy-50 border border-navy-100 p-6 md:p-8 overflow-hidden"
            >
              <div className="absolute top-4 left-4 flex items-center gap-2 z-10">
                <Layers size={14} className="text-navy-500" />
                <span className="text-[10px] font-bold tracking-widest text-navy-500 uppercase">
                  Demo Visualization
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
            </motion.div>
          </div>

          <div className="order-1 lg:order-2">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-xs font-semibold tracking-[0.15em] text-navy-500 uppercase mb-3"
            >
              {t("loc.label")}
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl sm:text-4xl font-extrabold text-navy-900 leading-tight"
            >
              {t("loc.title")}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="mt-4 text-base text-navy-600 leading-relaxed"
            >
              Location intelligence helps identify where challenges are emerging
              and enables better coordination of resources.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-navy-50 border border-navy-100 text-xs text-navy-500"
            >
              <Layers size={14} />
              Sample visualization — not connected to live government data
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
