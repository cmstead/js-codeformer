const configService = require('../config-service');

module.exports = {
    get terminator() {
        const config = configService.getConfig();

        console.log('use semicolons: ' + config.useSemicolons)

        return config.useSemicolons ? ';' : '';
    }
}