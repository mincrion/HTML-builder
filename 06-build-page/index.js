const fs = require('fs');
const path = require('path');

// Create 'project-dist' folder
fs.mkdir(path.join(__dirname, 'project-dist'), { recursive: true }, (err) => {
  if (err) throw err;
  // Call the function to process the template file
  buildHtml();
  // Call the function to merge styles
  mergeStyles();
  // Call the function to copy the assets folder
  copyAssets();
});

function buildHtml() {
  const templatePath = path.join(__dirname, 'template.html');
  const componentsPath = path.join(__dirname, 'components');
  const outputHtmlPath = path.join(__dirname, 'project-dist', 'index.html');

  fs.readFile(templatePath, 'utf-8', (err, template) => {
    if (err) throw err;

    const componentTags = template.match(/{{\w+}}/g);

    let promises = componentTags.map(tag => {
      const componentName = tag.slice(2, -2);
      const componentPath = path.join(componentsPath, `${componentName}.html`);

      return new Promise((resolve, reject) => {
        fs.readFile(componentPath, 'utf-8', (err, content) => {
          if (err) reject(err);
          else resolve({ tag, content });
        });
      });
    });

    Promise.all(promises)
      .then(components => {
        let result = template;
        components.forEach(({ tag, content }) => {
          result = result.replace(tag, content);
        });

        fs.writeFile(outputHtmlPath, result, (err) => {
          if (err) throw err;
        });
      })
      .catch(err => console.error(err));
  });
}

function mergeStyles() {
  const stylesPath = path.join(__dirname, 'styles');
  const outputCssPath = path.join(__dirname, 'project-dist', 'style.css');

  fs.readdir(stylesPath, { withFileTypes: true }, (err, files) => {
    if (err) throw err;

    let stylesContent = '';

    files.forEach(file => {
      if (file.isFile() && path.extname(file.name) === '.css') {
        const filePath = path.join(stylesPath, file.name);
        const content = fs.readFileSync(filePath, 'utf-8');
        stylesContent += content;
      }
    });

    fs.writeFile(outputCssPath, stylesContent, (err) => {
      if (err) throw err;
    });
  });
}

function copyAssets() {
  const assetsPath = path.join(__dirname, 'assets');
  const outputAssetsPath = path.join(__dirname, 'project-dist', 'assets');

  function copyDirectory(src, dest) {
    fs.mkdir(dest, { recursive: true }, (err) => {
      if (err) throw err;

      fs.readdir(src, { withFileTypes: true }, (err, files) => {
        if (err) throw err;

        files.forEach(file => {
          const srcPath = path.join(src, file.name);
          const destPath = path.join(dest, file.name);

          if (file.isDirectory()) {
            copyDirectory(srcPath, destPath);
          } else {
            fs.copyFile(srcPath, destPath, (err) => {
              if (err) throw err;
            });
          }
        });
      });
    });
  }

  copyDirectory(assetsPath, outputAssetsPath);
}
