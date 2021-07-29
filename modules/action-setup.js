const parser = require('./parser/parser');
const nodePath = require('./node-path');
const { transformSelectionToLocation } = require('./code-range-transforms');

function getVscodeInstance() {
    return require('./vscodeService').getVscode();
}

function prepareActionSetup(vscode = null) {
    vscode = vscode === null ? getVscodeInstance() : vscode;

    const activeTextEditor = vscode.window.activeTextEditor;

    const location = transformSelectionToLocation(activeTextEditor.selection);
    const source = activeTextEditor.document.getText()
    const ast = parser.parse(source);
    const selectionPath = nodePath.buildNodePath(ast, location);

    return {
        activeTextEditor,
        source,
        
        location,
        ast,
        selectionPath
    };
}

module.exports = {
    prepareActionSetup
};