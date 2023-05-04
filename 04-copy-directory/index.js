const fs = require('fs/promises');
const path = require('path');

(function copyDir() {
fs.rm(path.join(__dirname, 'files-copy'),{recursive: true, force: true}).finally(function() {
fs.mkdir(path.join(__dirname, 'files-copy'), { recursive: true }, err => {
  if (err) throw err; // не удалось создать папку
});
console.log('Папка успешно создана и содержит следующие файлы:');
fs.readdir(path.join(__dirname, 'files'), {withFileTypes: true }).then(files => {
      files.forEach(file => {
        if (file.isFile()) {
          fs.copyFile(path.join(path.join(__dirname, 'files'), file.name), path.join(path.join(__dirname, 'files-copy'), file.name));
          console.log(file.name);
        }
      });
    });
});
})();
