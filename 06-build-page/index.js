const fs = require("fs");
const fsPromises = require('fs/promises');
const path = require("path");

fsPromises.rm(path.join(__dirname, 'project-dist'),{recursive: true, force: true}).finally(function() {
  fsPromises.mkdir(path.join(__dirname, 'project-dist'), { recursive: true }, err => {
  if (err) throw err; // не удалось создать папку
});
console.log('Папка project-dist успешно создана');
fsPromises.mkdir(path.join(__dirname, 'project-dist','assets'), { recursive: true }, err => {
  if (err) throw err; // не удалось создать папку
});
console.log('Папка assets успешно создана');

function copyDirectory(assets, assetsNew) {
fsPromises.mkdir(assetsNew, { recursive: true }).then(() => {
  fsPromises.readdir(assets).then((files) => {
    files.forEach(file => {
      let assetsChild = path.join(assets, file);
      let assetsNewChild = path.join(assetsNew, file);
      fs.stat(assetsChild, (err, stats) => {
        if (err) throw err;
        if (stats.isDirectory()) {
          copyDirectory(assetsChild, assetsNewChild);
        } else {
          fs.createReadStream(assetsChild).pipe(fs.createWriteStream(assetsNewChild));
        }
      });
    });
  });
});
};
copyDirectory(path.join(__dirname, 'assets'), path.join(path.join(__dirname, 'project-dist'), 'assets'), function(err) {
  if (err) throw err;
});
console.log('Копия файлов в assets успешно создана');

const style = path.join(__dirname, 'styles');
const styleNew = path.join(__dirname, 'project-dist/style.css');
const writeStream = fs.createWriteStream(styleNew);

fs.readdir(style, { withFileTypes: true }, function(err, files) {
  if (err) throw err;

  files.forEach(function(file) {
      if (file.isFile() === true && path.parse(file.name).ext === '.css')  {
        const readStream = fs.createReadStream(path.join(style, file.name));
        readStream.on('data', data => writeStream.write(data));
      }
    });
});
console.log('Создан общий файл style.css');

function buildPage(template, index) {
  let html = '';
  let templateReadStream = fs.createReadStream(template, {encoding: 'utf8'});
    templateReadStream.on('data', chunk => {
    html = chunk.toString();
  });
  templateReadStream.on('end', () => {
    addHtmlContent(html, index);
  });
}

buildPage(path.join(__dirname, 'template.html'), path.join(path.join(__dirname, 'project-dist'), 'index.html'));

function addHtmlContent(html, index) {
  let obj = {};
  let count = 0;
  fsPromises.readdir(path.join(__dirname, 'components')).then((files) => {
    files.forEach(file => {
      let filePath = path.join(path.join(__dirname, 'components'), file);
      let fileCont = file.replace(path.extname(file), '');
      obj[fileCont] = '';
      fs.createReadStream(
        path.join(filePath)).on('data', (a) => {obj[fileCont] += a.toString();}).on('end', () => {
          count++;
          if (count >= files.length) {
            for (let i in obj) {
              html = html.replace('{{'+ i + '}}', obj[i]);
            }
            let htmlStream = fs.createWriteStream(index, {encoding: 'utf8'});
            htmlStream.write(html);
          }
        });
    });
  });
}
console.log('Создан и записан HTML');
});




