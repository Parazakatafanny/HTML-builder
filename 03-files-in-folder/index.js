const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, './secret-folder');

fs.readdir(filePath, {withFileTypes: true}, (err, files) => {
  if (err) throw err;

  files.forEach(file => {
    const ext = path.extname(file.name);
    const name = file.name.replace(ext, '')

    fs.stat(path.join(filePath, file.name), (err, stats) => {
      if (stats.isDirectory()) {
        return;
      }

      console.log(`${name} - ${ext.replace('.', '')} - ${stats.size / 1000}Kb`);
    });
  });
});