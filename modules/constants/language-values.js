const configService = require('../config-service');

module.exports = {
    get terminator() {
        const config = configService.getConfig();

        return config.useSemicolons ? ';' : '';
    }
}