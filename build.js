const fs = require('fs');
const path = require('path');

// Helper to copy directory recursively
function copyDirSync(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  let entries = fs.readdirSync(src, { withFileTypes: true });

  for (let entry of entries) {
    let srcPath = path.join(src, entry.name);
    let destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDirSync(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// Clean and create dist
const distPath = path.join(__dirname, 'dist');
if (fs.existsSync(distPath)) {
  console.log('Cleaning old dist folder...');
  fs.rmSync(distPath, { recursive: true, force: true });
}
fs.mkdirSync(distPath, { recursive: true });

// Copy files
console.log('Copying index.html, styles.css, app.js...');
fs.copyFileSync(path.join(__dirname, 'index.html'), path.join(distPath, 'index.html'));
fs.copyFileSync(path.join(__dirname, 'styles.css'), path.join(distPath, 'styles.css'));
fs.copyFileSync(path.join(__dirname, 'app.js'), path.join(distPath, 'app.js'));

// Copy assets folder
const assetsSrc = path.join(__dirname, 'assets');
const assetsDest = path.join(distPath, 'assets');
if (fs.existsSync(assetsSrc)) {
  console.log('Copying assets recursively...');
  copyDirSync(assetsSrc, assetsDest);
}

console.log('Build completed successfully! All files copied to dist/');
