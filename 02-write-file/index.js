const fs = require('fs');
const path = require('path');
const { stdin, stdout, exit } = require('process');
const writeStream = fs.createWriteStream(path.join(__dirname, 'text.txt'));

stdout.write('Hello\nNext enter your text...\n')
stdin.on('data', (data) => {
  if (data.toString().trim() === 'exit') {stdout.write('Bye, bye'); exit();}
  writeStream.write(data);
});
process.on("SIGINT", ()=> {stdout.write('Bye, bye'); exit();})