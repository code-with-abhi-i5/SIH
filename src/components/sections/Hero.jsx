import { motion } from "framer-motion";
import { ArrowRight, MapPin, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { JharkhandMap } from "@/components/visuals/JharkhandMap";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useLanguage } from "../../contexts/LanguageContext";

function LiveReportCard() {
  const reducedMotion = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.6 }}
      className="absolute bottom-4 left-0 md:bottom-8 md:left-4 lg:left-8 z-10 w-[280px] sm:w-[300px]"
    >
      <motion.div
        animate={reducedMotion ? {} : { y: [0, -4, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="glass-card rounded-2xl p-4 sm:p-5"
      >
        <div className="flex items-center gap-2 mb-3">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
          </span>
          <span className="text-[10px] font-bold tracking-widest text-navy-500 uppercase">
            Live Civic Signal
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-navy-500 mb-2">
          <MapPin size={12} className="text-saffron-500" />
          Jamshedpur
        </div>

        <h3 className="text-base font-bold text-navy-900 mb-3">
          Large Road Pothole
        </h3>

        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs text-navy-500">AI Classification</span>
            <span className="text-xs font-semibold text-navy-800">
              Infrastructure → Road Damage
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-navy-500">Confidence</span>
            <div className="flex items-center gap-2">
              <div className="w-16 h-1.5 bg-navy-100 rounded-full overflow-hidden">
                <div className="h-full w-[94%] bg-green-500 rounded-full" />
              </div>
              <span className="text-xs font-bold text-green-600">94%</span>
            </div>
          </div>
          <div className="flex items-center justify-between pt-1 border-t border-navy-100">
            <span className="text-xs text-navy-500">Status</span>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-saffron-500">
              <Sparkles size={12} />
              Being Reviewed
            </span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function LocationCard() {
  const reducedMotion = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8, duration: 0.6 }}
      className="absolute top-4 right-0 md:top-8 md:right-4 lg:right-8 z-10 w-[220px] sm:w-[240px]"
    >
      <motion.div
        animate={reducedMotion ? {} : { y: [0, -3, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="glass-card rounded-2xl p-4"
      >
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-lg bg-navy-900 flex items-center justify-center">
            <MapPin size={16} className="text-saffron-400" />
          </div>
          <div>
            <p className="text-[10px] font-semibold text-navy-500 uppercase tracking-wide">
              Your Location
            </p>
            <p className="text-sm font-bold text-navy-900">Jamshedpur</p>
          </div>
        </div>
        <p className="text-xs text-navy-500 mb-2">Jharkhand</p>
        <div className="flex items-center gap-2 pt-2 border-t border-navy-100">
          <div className="flex -space-x-1">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="w-4 h-4 rounded-full bg-saffron-400 border-2 border-white"
                style={{ opacity: 1 - i * 0.2 }}
              />
            ))}
          </div>
          <span className="text-xs font-medium text-navy-700">
            3 nearby challenges
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function Hero() {
  const { t } = useLanguage();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: "spring", stiffness: 100, damping: 15 }
    },
  };

  return (
    <section
      id="home"
      className="relative min-h-screen hero-gradient overflow-hidden pt-24 md:pt-28 lg:pt-32 bg-warm-50"
    >
      {/* Animated Grid Background */}
      <div className="absolute inset-0 grid-texture animate-grid opacity-60" />

      {/* Floating Animated Blobs for depth */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-saffron-400/20 rounded-full blur-[100px] animate-blob mix-blend-multiply" />
      <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] bg-navy-400/20 rounded-full blur-[100px] animate-blob mix-blend-multiply" style={{ animationDelay: "2s" }} />
      <div className="absolute bottom-[-20%] left-[20%] w-[400px] h-[400px] bg-green-400/10 rounded-full blur-[100px] animate-blob mix-blend-multiply" style={{ animationDelay: "4s" }} />

      <div className="container-narrow relative mx-auto px-4 sm:px-6 lg:px-8 pb-8 md:pb-12 z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[calc(100vh-8rem)]"
        >
          {/* Left: Copy */}
          <div className="relative z-10">
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-navy-50/80 backdrop-blur-sm border border-navy-100 shadow-sm mb-6"
            >
              <Sparkles size={14} className="text-saffron-500 animate-pulse" />
              <span className="text-[11px] sm:text-xs font-bold tracking-[0.1em] text-navy-600 uppercase">
                {t("hero.badge")}
              </span>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-[3.5rem] xl:text-6xl font-extrabold text-navy-900 leading-[1.08] tracking-tight text-balance"
            >
              {t("hero.title.pt1")}
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-saffron-500 to-orange-600 inline-block drop-shadow-sm">
                {t("hero.title.pt2")}
              </span>{" "}
              {t("hero.title.pt3")}
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="mt-5 md:mt-6 text-base sm:text-lg text-navy-600 leading-relaxed max-w-lg text-balance"
            >
              {t("hero.desc")}
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4"
            >
              <Link to="/report">
                <Button
                  variant="primary"
                  size="lg"
                  className="group relative shadow-[0_0_40px_-10px_rgba(232,133,12,0.4)] hover:shadow-[0_0_60px_-15px_rgba(232,133,12,0.6)] overflow-hidden transition-shadow duration-500"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 -translate-x-full group-hover:translate-x-[200%] transition-transform duration-1000 ease-in-out" />
                  <span className="relative flex items-center gap-2">
                    {t("hero.btn.report")}
                    <ArrowRight
                      size={18}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </span>
                </Button>
              </Link>
              <Button variant="secondary" size="lg" className="hover:bg-white/60 transition-colors">
                {t("hero.btn.explore")}
              </Button>
            </motion.div>

            <motion.p
              variants={itemVariants}
              className="mt-6 text-xs sm:text-sm text-navy-400 font-medium flex flex-wrap items-center gap-x-3 gap-y-1"
            >
              <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-saffron-400 animate-ping" /> {t("hero.tag.ai")}</span>
              <span className="text-navy-300" aria-hidden="true">•</span>
              <span>{t("hero.tag.location")}</span>
              <span className="text-navy-300" aria-hidden="true">•</span>
              <span>{t("hero.tag.community")}</span>
            </motion.p>
          </div>

          {/* Right: Map Visual */}
          <div className="relative h-[400px] sm:h-[420px] md:h-[460px] lg:h-[500px] -mx-4 sm:mx-0">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1, y: [0, -8, 0] }}
              transition={{ 
                duration: 0.8, 
                delay: 0.2,
                y: { duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }
              }}
              className="relative w-full h-full scale-110 sm:scale-100"
            >
              {/* Ambient Map Glow */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-saffron-400/20 via-transparent to-navy-400/20 blur-3xl rounded-full opacity-60" />
              
              <div className="absolute inset-0 z-10 flex items-center justify-center">
                <JharkhandMap
                  variant="hero"
                  className="w-full h-full p-0 sm:p-4 drop-shadow-xl"
                  showNodes
                  showConnections
                />
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Trust Strip */}
      <TrustStrip />
    </section>
  );
}

function TrustStrip() {
  const { t } = useLanguage();

  const metrics = [
    { value: t("trust.m1.val"), label: t("trust.m1.label"), sub: true },
    { value: t("trust.m2.val"), label: t("trust.m2.label"), sub: false },
    { value: t("trust.m3.val"), label: t("trust.m3.label"), sub: false },
    { value: t("trust.m4.val"), label: t("trust.m4.label"), sub: false },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8, duration: 0.8, type: "spring", stiffness: 100 }}
      className="relative border-t border-navy-100/80 bg-white/70 backdrop-blur-md overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-navy-50/50 to-white/0" />
      <div className="container-narrow relative mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8">
          <p className="text-sm font-bold text-navy-900 whitespace-nowrap">
            {t("trust.title")}
          </p>
          <div className="hidden sm:block w-px h-8 bg-navy-200" aria-hidden="true" />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-8 w-full">
            {metrics.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1 + i * 0.1, duration: 0.5, type: "spring" }}
                className="text-center sm:text-left group"
              >
                <p className="text-lg sm:text-xl font-bold text-navy-900 transition-transform group-hover:scale-105 group-hover:text-saffron-600 inline-block transform origin-left">
                  {m.value}{" "}
                  <span className="text-sm font-semibold text-navy-600">{m.label}</span>
                </p>
                {m.sub && (
                  <p className="text-[10px] text-navy-400 uppercase tracking-wide mt-0.5">
                    {t("trust.sub")}
                  </p>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export { TrustStrip };
