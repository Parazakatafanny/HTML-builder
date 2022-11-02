const fs = require('fs');
const path = require('path');
const process = require('process');

const filePath = path.join(__dirname, 'text.txt')
const reader = fs.createReadStream(filePath);
reader.pipe(process.stdout);