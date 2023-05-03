const fs = require('fs');
const path = require('path');

fs.readdir(path.join(__dirname, 'secret-folder'), (err, files) => {
  if (err) throw err;
  files.forEach((file) => {
    const info = path.parse(file);
    fs.stat(path.join(path.join(__dirname, 'secret-folder'), file), (err, stats) => {
      if (err) throw err;
      if (stats.isFile()) 
      console.log(`${info.name} - ${info.ext.replace(".", "")} - ${stats.size}b`);
      // По ТЗ округлять не нужно, конвертация в кб по желанию, поэтому оставляю в байтах
    })
  })  
})
