const fs = require('fs');
const path = require('path');
const srcDir = path.join(__dirname, 'src');

const classMap = {
  'md-flex': 'md:flex',
  'md-hidden': 'md:hidden',
  'sm-hidden': 'sm:hidden',
  'md-grid-2': 'md:grid-cols-2',
  'md-grid-3': 'md:grid-cols-3',
  'md-grid-4': 'md:grid-cols-4',
  'lg-grid-2': 'lg:grid-cols-2',
  'lg-grid-3': 'lg:grid-cols-3',
  'lg-grid-4': 'lg:grid-cols-4',
  'sm-grid-2': 'sm:grid-cols-2',
};

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.jsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      for (const [oldClass, newClass] of Object.entries(classMap)) {
        content = content.split(oldClass).join(newClass);
      }
      
      fs.writeFileSync(fullPath, content, 'utf8');
    }
  }
}

processDirectory(srcDir);
console.log("Updated custom responsive classes to Tailwind-style syntaxes to match the updated index.css");
