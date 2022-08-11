const fs = require('fs');
const idl = require('./single_betting.json');

fs.writeFileSync('./src/idl.json', JSON.stringify(idl));