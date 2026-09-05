import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { JharkhandMap } from "@/components/visuals/JharkhandMap";
import { useLanguage } from "../../contexts/LanguageContext";

export function CTA() {
  const { t } = useLanguage();
  return (
    <section className="relative overflow-hidden">
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
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight text-balance max-w-2xl mx-auto"
          >
            {t("cta.title")}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-4 text-base sm:text-lg text-navy-300 max-w-lg mx-auto"
          >
            {t("cta.desc")}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center"
          >
            <Button variant="saffron" size="lg" className="group">
              {t("hero.btn.report")}
              <ArrowRight
                size={18}
                className="transition-transform group-hover:translate-x-0.5"
              />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-white/30 text-white hover:bg-white hover:text-navy-900"
            >
              {t("hero.btn.explore")}
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
