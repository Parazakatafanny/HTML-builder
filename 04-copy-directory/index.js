const fs = require('fs');
const path = require('path');
const fsPromises = fs.promises;

const dirPath = path.join(__dirname, 'files')
const copyDirPath = path.join(__dirname, 'files-copy');

fsPromises.rm(copyDirPath, { recursive: true, force: true }).then(() => {
    fsPromises.mkdir(copyDirPath, { recursive: true }).then(function() {
        fs.readdir(dirPath, {withFileTypes: true}, (err, files) => {
            if (err) throw err;
          
            files.forEach(file => {
              const name = file.name;
              fsPromises.copyFile(path.join(__dirname, `./files/${name}`)
                                , path.join(__dirname, `./files-copy/${name}`));
            });
          });
    }).catch(function(err) {
        console.log('Failed to create directory: ', err);
    });
});

