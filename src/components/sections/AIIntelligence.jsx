import { motion } from "framer-motion";
import { Tags, Copy, Route, ArrowDown } from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";

const capabilities = [
  {
    icon: Tags,
    title: "Smart Classification",
    description:
      "AI understands the submitted problem and identifies its category.",
  },
  {
    icon: Copy,
    title: "Duplicate Detection",
    description:
      "Similar reports can be detected to prevent duplicate problem records.",
  },
  {
    icon: Route,
    title: "Intelligent Routing",
    description:
      "Problems can be matched with institutions based on expertise.",
  },
];

export function AIIntelligence() {
  const { t } = useLanguage();
  return (
    <section className="section-padding bg-navy-950 text-white relative overflow-hidden">
      <div className="absolute inset-0 grid-texture opacity-10" aria-hidden="true" />
      <div className="container-narrow mx-auto relative">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-xs font-semibold tracking-[0.15em] text-saffron-400 uppercase mb-3"
            >
              {t("ai.label")}
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl sm:text-4xl font-extrabold leading-tight"
            >
              {t("ai.title")}
            </motion.h2>

            <div className="mt-8 space-y-6">
              {capabilities.map((cap, i) => (
                <motion.div
                  key={cap.title}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex gap-4"
                >
                  <div className="w-10 h-10 rounded-xl bg-navy-800 border border-navy-700 flex items-center justify-center shrink-0">
                    <cap.icon size={18} className="text-saffron-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white mb-1">{cap.title}</h3>
                    <p className="text-sm text-navy-300 leading-relaxed">
                      {cap.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* AI Pipeline Visual */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            {/* Citizen Input */}
            <div className="glass-card-dark rounded-2xl p-5 border border-navy-700/50">
              <p className="text-[10px] font-bold tracking-widest text-navy-400 uppercase mb-3">
                Citizen Input
              </p>
              <p className="text-sm text-navy-200 leading-relaxed italic">
                &ldquo;Road near our locality has a large pothole and becomes
                dangerous during rain.&rdquo;
              </p>
            </div>

            <div className="flex justify-center">
              <motion.div
                animate={{ y: [0, 4, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <ArrowDown size={20} className="text-saffron-400" />
              </motion.div>
            </div>

            {/* AI Analysis */}
            <div className="rounded-2xl p-5 border border-saffron-500/30 bg-gradient-to-br from-navy-800/80 to-navy-900/80">
              <p className="text-[10px] font-bold tracking-widest text-saffron-400 uppercase mb-4">
                AI Analysis
              </p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Category", value: "Infrastructure" },
                  { label: "Issue", value: "Road Damage" },
                  { label: "Priority", value: "High" },
                  { label: "Location", value: "Jamshedpur" },
                ].map((item) => (
                  <div key={item.label} className="bg-navy-900/60 rounded-xl px-3 py-2.5">
                    <p className="text-[10px] text-navy-400 uppercase tracking-wide">
                      {item.label}
                    </p>
                    <p className="text-sm font-semibold text-white mt-0.5">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-center">
              <motion.div
                animate={{ y: [0, 4, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
              >
                <ArrowDown size={20} className="text-green-400" />
              </motion.div>
            </div>

            {/* Recommended Domain */}
            <div className="glass-card-dark rounded-2xl p-5 border border-green-500/20">
              <p className="text-[10px] font-bold tracking-widest text-navy-400 uppercase mb-2">
                Recommended Domain
              </p>
              <p className="text-lg font-bold text-green-400">
                Civil Engineering
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
