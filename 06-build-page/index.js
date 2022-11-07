const fs = require('fs');
const path = require('path');
const fsPromises = fs.promises;

const dirPath = path.join(__dirname, 'assets');
const copyDirPath = path.join(__dirname, 'project-dist/assets');

function parseDirectory(lookingPath) {
  fs.readdir(lookingPath, { withFileTypes: true }, (err, files) => {
    if (err) throw err;

    files.forEach(file => {
      const newLookingPath = path.join(lookingPath, file.name);

      fs.stat(newLookingPath, (err, stats) => {
        if (err) throw err;

        if (stats.isDirectory()) {
          fs.mkdir(newLookingPath.replace(dirPath, copyDirPath), { recursive: true }, () => {
            parseDirectory(newLookingPath);
          })
        } else {
          fsPromises.copyFile(
            newLookingPath,
            newLookingPath.replace(dirPath, copyDirPath)
          );
        }
      });

    });
  });
}

const styleCopyPath = path.join(__dirname, 'project-dist/style.css');
const stylePath = path.join(__dirname, 'styles');

function processCss() {
  fs.open(styleCopyPath, 'w', (err) => {
    if (err) throw err;

    fs.readdir(stylePath, { withFileTypes: true }, (err, files) => {
      if (err) throw err;

      files.forEach(file => {
        const ext = path.extname(file.name);
        const name = file.name;
        const filePath = path.join(__dirname, `styles/${name}`);

        if (ext == '.css') {
          fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) throw err;

            fs.appendFile(styleCopyPath, data, (err) => {
              if (err) throw err;
            });

          });
        }
      });
    });
  });
}

const htmlCopyPath = path.join(__dirname, 'project-dist/index.html');
const htmlPath = path.join(__dirname, 'components');

function processHtml() {
  fs.readFile(path.join(__dirname, 'template.html'), 'utf8', (err, data) => {
    if (err) throw err;

    fs.readdir(htmlPath, { withFileTypes: true }, async (err, files) => {
      if (err) throw err;
      let result = data;

      await Promise.all(files.map(async (file) => {
        const ext = path.extname(file.name);
        const name = file.name.replace(ext, '');
        const filePath = path.join(htmlPath, file.name);

        if (ext == '.html') {
          const _data = await fsPromises.readFile(filePath, 'utf8');
          result = result.replace(`{{${name}}}`, _data);
        }
      }))

      await fsPromises.writeFile(htmlCopyPath, result);
    });
  });
}

fsPromises.rm(path.join(__dirname, 'project-dist'), { recursive: true, force: true }).then(() => {
  fs.mkdir(copyDirPath, { recursive: true }, () => {
    parseDirectory(dirPath);
    processCss();
    processHtml();
  });
});

