let config = {
    useSemicolons: true
};

function setConfigOptions(configOptions) {
    config = configOptions;
}

function getConfig() {
    return config;
}

module.exports = {
    setConfigOptions,
    getConfig
};