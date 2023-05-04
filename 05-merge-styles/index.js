const fs = require('fs');
const path = require('path');

const style = path.join(__dirname, 'styles');
const bundle = path.join(__dirname, 'project-dist/bundle.css');
const writeStream = fs.createWriteStream(bundle);

fs.readdir(style, { withFileTypes: true }, function(err, files) {
  if (err) throw err;

  files.forEach(function(file) {
      if (file.isFile() === true && path.parse(file.name).ext === '.css')  {
        const readStream = fs.createReadStream(path.join(style, file.name));
        readStream.on('data', data => writeStream.write(data));
      }
    });
});