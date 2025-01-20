const fs = require('fs');
const path = require('path');

function displayFilesInfo() {
  const folderPath = path.join(__dirname, 'secret-folder');

  fs.readdir(folderPath, { withFileTypes: true }, (err, items) => {
    if (err) {
      return console.error('Error reading the directory:', err);
    }

    items.forEach(item => {
      if (item.isFile()) {
        const filePath = path.join(folderPath, item.name);
        
        fs.stat(filePath, (err, stats) => {
          if (err) {
            return console.error('Error getting file stats:', err);
          }

          const fileName = path.basename(item.name, path.extname(item.name));
          const fileExtension = path.extname(item.name).slice(1);
          const fileSize = (stats.size / 1024).toFixed(3);
          
          console.log(`${fileName} - ${fileExtension} - ${fileSize}kb`);
        });
      }
    });
  });
}

displayFilesInfo();
