const fs = require('fs');
const path = require('path');

function readFileSource(basePath, filePath) {
    const fullPath = path.join(basePath, filePath);

    return fs.readFileSync(fullPath, { encoding: 'utf8' });
}

module.exports = {
    readFileSource
}