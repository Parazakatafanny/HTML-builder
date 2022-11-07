const fs = require('fs');
const path = require('path');

const bundlePath = path.join(__dirname, 'project-dist/bundle.css');
const dirPath = path.join(__dirname, 'styles');

fs.rm(bundlePath, {force: true}, () => {
  fs.open(bundlePath, 'w', (err) => {
    if (err) throw err;
  
    fs.readdir(dirPath, { withFileTypes: true }, (err, files) => {
      if (err) throw err;
  
      files.forEach(file => {
        const ext = path.extname(file.name);
        const name = file.name;
        const filePath = path.join(__dirname, `styles/${name}`);
        
        if (ext == '.css') {
          fs.readFile(filePath, 'utf8', (err, data) => {
            if(err) throw err;
      
            fs.appendFile(bundlePath, data, (err) => {
              if(err) throw err;
            });
      
          });
        }
      });
    });
  });
});




  

