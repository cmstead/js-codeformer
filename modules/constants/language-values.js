const config = require('../config-service').getConfig();

module.exports = {
    get terminator() {
        return config.useSemicolons ? ';' : '';
    }
}