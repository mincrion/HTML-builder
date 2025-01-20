const fs = require('fs');
const path = require('path');

function mergeStyles() {
  const stylesFolder = path.join(__dirname, 'styles');
  const outputFilePath = path.join(__dirname, 'project-dist', 'bundle.css');

  fs.readdir(stylesFolder, (err, files) => {
    if (err) {
      return console.error('Error reading the styles directory:', err);
    }

    const cssFiles = files.filter(file => path.extname(file) === '.css');
    let combinedStyles = '';

    cssFiles.forEach((file, index) => {
      const filePath = path.join(stylesFolder, file);

      fs.readFile(filePath, 'utf-8', (err, data) => {
        if (err) {
          return console.error('Error reading the CSS file:', err);
        }

        combinedStyles += data + '\n';

        if (index === cssFiles.length - 1) {
          fs.writeFile(outputFilePath, combinedStyles, (err) => {
            if (err) {
              return console.error('Error writing the bundle.css file:', err);
            }
            console.log('bundle.css has been created successfully.');
          });
        }
      });
    });
  });
}

mergeStyles();
