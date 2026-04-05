const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

const colorMap = {
  // Backgrounds - Dark to Light
  'rgba(15,22,36,': 'rgba(255,255,255,',
  'rgba(20,28,46,': 'rgba(248,250,252,',
  'rgba(20,32,62,': 'rgba(255,255,255,',
  'rgba(13,18,32,': 'rgba(255,255,255,',
  'rgba(15, 23, 42,': 'rgba(255, 255, 255,',
  'rgba(2, 6, 23,': 'rgba(241, 245, 249,',
  '#0d1220': '#f8fafc',
  '#050810': '#ffffff',
  '#0a0f1c': '#f8fafc',
  '#1e2d4a': '#ffffff',
  '#2d3f60': '#e2e8f0',
  '#1f2937': '#f1f5f9',
  '#1a2236': '#ffffff',
  '#080c18': '#f8fafc',

  // Primary text - White to Slate 900
  '#f1f5fd': '#0f172a',
  '#f9fafb': '#0f172a',
  '#ffffff': '#0f172a',
  '"#ffffff"': '"#ffffff"', // (Keep white strings as white for some SVG/lucide icons where context dictates... wait, let's just do case by case, or use a function)
  "'#ffffff'": "'#ffffff'",

  // Secondary text - Muted/Grays to darker slates for contrast in light mode
  '#64748b': '#475569',
  '#94a3b8': '#334155',
  '#6b7280': '#475569',
  '#4b5563': '#64748b',
  '#475569': '#334155',

  // Borders that were dark
  'rgba(45,63,96,0.8)': 'rgba(203,213,225,0.8)',
};

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.css')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // We don't want to replace #ffffff in lucide icon props like color="#ffffff", 
      // but we do want it in background: '#ffffff'.
      // For safety, let's just use string replacement on exact substrings
      
      for (const [dark, light] of Object.entries(colorMap)) {
        if (dark === '#ffffff') continue; // Handle white separately
        content = content.split(dark).join(light);
      }

      // Handle white specifically: only replace if part of color or background inline styles
      content = content.replace(/color:\s*['"]#ffffff['"]/g, "color: '#0f172a'");
      content = content.replace(/color:\s*['"]#f9fafb['"]/g, "color: '#0f172a'");
      
      fs.writeFileSync(fullPath, content, 'utf8');
    }
  }
}

// Special fixes for components that need explicit white
// For button/icon colors that MUST stay white:
// We skip global #ffffff replacement but explicitly replace text colors that were #f1f5fd

processDirectory(srcDir);
console.log("Done refactoring theme colors.");
