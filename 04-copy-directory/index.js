const fs = require('fs');
const path = require('path');

function copyDir(srcDir, destDir) {
  fs.mkdir(destDir, { recursive: true }, (err) => {
    if (err) {
      return console.error('Error creating directory:', err);
    }

    fs.readdir(srcDir, { withFileTypes: true }, (err, items) => {
      if (err) {
        return console.error('Error reading directory:', err);
      }

      items.forEach(item => {
        const srcPath = path.join(srcDir, item.name);
        const destPath = path.join(destDir, item.name);

        if (item.isFile()) {
          fs.copyFile(srcPath, destPath, (err) => {
            if (err) {
              console.error('Error copying file:', err);
            }
          });
        } else if (item.isDirectory()) {
          copyDir(srcPath, destPath);
        }
      });
    });
  });
}

const srcDir = path.join(__dirname, 'files');
const destDir = path.join(__dirname, 'files-copy');

copyDir(srcDir, destDir);
