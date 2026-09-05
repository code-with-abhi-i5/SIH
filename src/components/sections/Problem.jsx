import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";

export function Problem() {
  const [showConnected, setShowConnected] = useState(false);
  const { t } = useLanguage();

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

  return (
    <section className="section-padding bg-white relative overflow-hidden">
      <div className="container-narrow mx-auto">
        <div className="max-w-3xl mx-auto text-center mb-12 md:mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-3xl sm:text-4xl md:text-[2.75rem] font-extrabold text-navy-900 leading-tight text-balance"
          >
            {t("prob.title")}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-4 text-base sm:text-lg text-navy-600 leading-relaxed"
          >
            {t("prob.desc")}
          </motion.p>
        </div>

        <div className="max-w-md mx-auto">
          <AnimatePresence mode="wait">
            {!showConnected ? (
              <motion.div
                key="disconnected"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="space-y-0"
              >
                {disconnectedFlow.map((step, i) => (
                  <div key={step} className="flex flex-col items-center">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.15 }}
                      className={`w-full max-w-xs px-6 py-4 rounded-2xl text-center font-semibold text-sm sm:text-base ${
                        i === disconnectedFlow.length - 1
                          ? "bg-red-50 text-red-700 border border-red-100"
                          : i === 0
                          ? "bg-navy-900 text-white"
                          : "bg-navy-50 text-navy-700 border border-navy-100"
                      }`}
                    >
                      {step}
                    </motion.div>
                    {i < disconnectedFlow.length - 1 && (
                      <ArrowDown className="w-5 h-5 text-navy-300 my-2" aria-hidden="true" />
                    )}
                  </div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="connected"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="space-y-0"
              >
                {connectedFlow.map((step, i) => (
                  <div key={step} className="flex flex-col items-center">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.12 }}
                      className={`w-full max-w-xs px-6 py-4 rounded-2xl text-center font-semibold text-sm sm:text-base ${
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
                    </motion.div>
                    {i < connectedFlow.length - 1 && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.12 + 0.05 }}
                      >
                        <ArrowDown className="w-5 h-5 text-green-400 my-2" aria-hidden="true" />
                      </motion.div>
                    )}
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-8 text-center"
          >
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
          </motion.div>
        </div>
      </div>
    </section>
  );
}
