let vscode = null;

function setVscodeInstance(vscodeInstance) {
    vscode = vscodeInstance;
}

function getVscode() {
    if(vscode === null) {
        vscode = require('vscode');
    }

    return vscode;
}

module.exports = {
    setVscodeInstance,
    getVscode
};