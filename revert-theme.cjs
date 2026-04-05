const fs = require('fs');
const path = require('path');
const srcDir = path.join(__dirname, 'src');

const colorMap = {
  // Light to Dark (approximating my earlier mapping)
  'rgba(255,255,255,': 'rgba(15,22,36,',
  'rgba(248,250,252,': 'rgba(20,28,46,',
  'rgba(255, 255, 255,': 'rgba(15, 23, 42,',
  'rgba(241, 245, 249,': 'rgba(2, 6, 23,',
  '#f8fafc': '#0d1220',
  '#f1f5f9': '#1f2937',
  '#e2e8f0': '#2d3f60',
  
  // Primary text - Slate 900 back to almost white
  '#0f172a': '#f1f5fd',

  // Secondary text - Slate back to Grays
  '#334155': '#94a3b8',
  '#475569': '#64748b',

  // Borders that were lightened
  'rgba(203,213,225,0.8)': 'rgba(45,63,96,0.8)'
};

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.jsx')) { // Only touch JSX since index.css was user-reverted
      let content = fs.readFileSync(fullPath, 'utf8');
      
      for (const [light, dark] of Object.entries(colorMap)) {
        content = content.split(light).join(dark);
      }
      
      fs.writeFileSync(fullPath, content, 'utf8');
    }
  }
}

processDirectory(srcDir);
console.log("Reverted JSX inline styles to dark theme.");
