const { window } = require('../vscodeService').getVscode();

function showErrorMessage(message) {
    console.log(message);

    return window.showErrorMessage(message);
}

module.exports = {
    showErrorMessage
};