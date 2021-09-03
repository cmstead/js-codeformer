const { window } = require('../vscodeService').getVscode();

function buildInfoMessage(message) {
    return `info: ${message}`;
}

function showInfoMessage(message) {
    return window.showInformationMessage(message);
}

function showErrorMessage(message) {
    return window.showErrorMessage(message);
}

function parseAndShowMessage(messagingObject) {
    const message = messagingObject.message;

    if(message.toLowerCase().startsWith('info:')) {
        showInfoMessage(message.replace(/^info\:\s/i, ''));
    } else {
        console.log(messagingObject);

        showErrorMessage(message);
    }
}

module.exports = {
    buildInfoMessage,
    parseAndShowMessage,
    showErrorMessage,
    showInfoMessage
};