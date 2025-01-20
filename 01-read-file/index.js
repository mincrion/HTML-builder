const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, 'text.txt');
const dataStream = fs.createReadStream(filePath, 'utf-8');
dataStream.on('data', (chunk) => {
  process.stdout.write(chunk);
});
dataStream.on('error', (err) => {
  console.error('Error reading the file:', err.message);
});