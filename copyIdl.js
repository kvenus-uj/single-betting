const fs = require('fs');
const idl = require('./simple_betting.json');

fs.writeFileSync('./src/idl.json', JSON.stringify(idl));