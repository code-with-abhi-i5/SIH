import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useLanguage } from "../../contexts/LanguageContext";

const nodes = [
  { id: "citizens", label: "Citizens", angle: 270, color: "#e8850c" },
  { id: "universities", label: "Universities", angle: 330, color: "#3d5a80" },
  { id: "students", label: "Students", angle: 30, color: "#5a7a9e" },
  { id: "researchers", label: "Researchers", angle: 70, color: "#2a4068" },
  { id: "industry", label: "Industry", angle: 120, color: "#1e3050" },
  { id: "startups", label: "Startups", angle: 170, color: "#16a34a" },
  { id: "experts", label: "Experts", angle: 210, color: "#15803d" },
  { id: "government", label: "Government", angle: 250, color: "#0f1729" },
];

function polarToCartesian(angle, radius, cx, cy) {
  const rad = ((angle - 90) * Math.PI) / 180;
  return {
    x: cx + radius * Math.cos(rad),
    y: cy + radius * Math.sin(rad),
  };
}

export function Ecosystem() {
  const { t } = useLanguage();
  const reducedMotion = useReducedMotion();
  const cx = 200;
  const cy = 200;
  const radius = 140;

  return (
    <section className="section-padding bg-white relative overflow-hidden">
      <div className="container-narrow mx-auto">
        <div className="text-center mb-10 md:mb-14">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xs font-semibold tracking-[0.15em] text-navy-500 uppercase mb-3"
          >
            {t("eco.label")}
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl font-extrabold text-navy-900 max-w-2xl mx-auto text-balance"
          >
            {t("eco.title")}
          </motion.h2>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative max-w-[440px] mx-auto aspect-square"
        >
          <svg viewBox="0 0 400 400" className="w-full h-full" aria-hidden="true">
            {/* Connection lines */}
            {nodes.map((node, i) => {
              const pos = polarToCartesian(node.angle, radius, cx, cy);
              return (
                <motion.line
                  key={`line-${node.id}`}
                  x1={cx}
                  y1={cy}
                  x2={pos.x}
                  y2={pos.y}
                  stroke="#c4d4e8"
                  strokeWidth="1"
                  initial={{ pathLength: 0, opacity: 0 }}
                  whileInView={{ pathLength: 1, opacity: 0.6 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.8 }}
                />
              );
            })}

            {/* Animated pulse ring */}
            {!reducedMotion && (
              <motion.circle
                cx={cx}
                cy={cy}
                r="50"
                fill="none"
                stroke="#e8850c"
                strokeWidth="1"
                opacity="0.2"
                animate={{ r: [50, 70, 50], opacity: [0.2, 0, 0.2] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
            )}

            {/* Center hub */}
            <circle cx={cx} cy={cy} r="48" fill="#0f1729" />
            <text
              x={cx}
              y={cy - 6}
              textAnchor="middle"
              fill="white"
              style={{ fontSize: "11px", fontWeight: 700 }}
            >
              Jan
            </text>
            <text
              x={cx}
              y={cy + 10}
              textAnchor="middle"
              fill="white"
              style={{ fontSize: "11px", fontWeight: 700 }}
            >
              Samadhan
            </text>

            {/* Outer nodes */}
            {nodes.map((node, i) => {
              const pos = polarToCartesian(node.angle, radius, cx, cy);
              return (
                <g key={node.id}>
                  <motion.circle
                    cx={pos.x}
                    cy={pos.y}
                    r="28"
                    fill="white"
                    stroke="#e8eef5"
                    strokeWidth="1.5"
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + i * 0.06, type: "spring" }}
                  />
                  <text
                    x={pos.x}
                    y={pos.y + 4}
                    textAnchor="middle"
                    fill="#1e3050"
                    style={{ fontSize: "8px", fontWeight: 600 }}
                  >
                    {node.label}
                  </text>
                </g>
              );
            })}
          </svg>
        </motion.div>

        {/* Mobile-friendly list fallback */}
        <div className="mt-8 flex flex-wrap justify-center gap-2 md:hidden">
          {nodes.map((node) => (
            <span
              key={node.id}
              className="px-3 py-1.5 rounded-full bg-navy-50 border border-navy-100 text-xs font-medium text-navy-700"
            >
              {node.label}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
