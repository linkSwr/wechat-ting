const fs = require('fs');

function saveIO(path, data) {
    fs.appendFileSync(path, data, 'utf8');
}

module.exports = saveIO;