let config = {
    useSemicolons: true
};

function setConfigOptions(configOptions) {
    Object.keys(configOptions).forEach((key) => {
        config[key] = configOptions[key];
    });
}

function getConfig() {
    return config;
}

module.exports = {
    setConfigOptions,
    getConfig
};