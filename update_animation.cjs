const fs = require('fs');

let content = fs.readFileSync('src/components/visuals/JharkhandMap.jsx', 'utf-8');

// The file has 24 instances of:
// <path
//   key="Bokaro"
//   d="..."
//   fill="url(#mapFill)"
//   stroke="#94a3b8"
//   strokeWidth="0.8"
//   className="transition-colors hover:fill-navy-50"
// />

let matchCount = 0;
content = content.replace(/<path\s+key="([^"]+)"([^>]+)\/>/g, (match, key, rest) => {
  const index = matchCount++;
  // We want to add initial and animate props
  return `<motion.path
            key="${key}"${rest}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.5, delay: ${index * 0.05}, ease: "easeOut" }}
          />`;
});

fs.writeFileSync('src/components/visuals/JharkhandMap.jsx', content);
console.log('Updated', matchCount, 'paths to motion.path!');
