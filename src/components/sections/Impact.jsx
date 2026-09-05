import { motion } from "framer-motion";
import { FileText, Link2, Loader, Users } from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";

export function Impact() {
  const { t } = useLanguage();

  const metrics = [
    {
      icon: FileText,
      label: t("imp.m1"),
      value: "—",
      status: t("imp.status"),
      description: t("imp.desc"),
    },
    {
      icon: Link2,
      label: t("imp.m2"),
      value: "—",
      status: t("imp.status"),
      description: t("imp.desc"),
    },
    {
      icon: Loader,
      label: t("imp.m3"),
      value: "—",
      status: t("imp.status"),
      description: t("imp.desc"),
    },
    {
      icon: Users,
      label: t("imp.m4"),
      value: "—",
      status: t("imp.status"),
      description: t("imp.desc"),
    },
  ];

  return (
    <section id="impact" className="section-padding bg-warm-50 relative">
      <div className="container-narrow mx-auto">
        <div className="text-center mb-12 md:mb-16">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xs font-semibold tracking-[0.15em] text-navy-500 uppercase mb-3"
          >
            {t("imp.label")}
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl font-extrabold text-navy-900"
          >
            {t("imp.title")}
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {metrics.map((metric, i) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ delay: i * 0.08 }}
              className="bg-white rounded-2xl border border-navy-100 p-6 hover:shadow-md hover:shadow-navy-900/5 transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-navy-50 flex items-center justify-center">
                  <metric.icon size={20} className="text-navy-600" />
                </div>
                <span className="text-[10px] font-bold tracking-widest uppercase px-2 py-1 rounded-md bg-saffron-100 text-saffron-600">
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
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
