const path = require('path');

function loadModule(modulePath) {
    const fullModulePath = path.join(process.cwd(), 'modules', modulePath);

    return require(fullModulePath);
}

module.exports = {
    loadModule
};