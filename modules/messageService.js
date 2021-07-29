const { window } = require('./vscodeService').getVscode();

function showErrorMessage(message) {
    return window.showErrorMessage(message);
}

module.exports = {
    showErrorMessage
};