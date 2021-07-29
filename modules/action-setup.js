const parser = require('./parser/parser');
const nodePath = require('./node-path');
const { transformSelectionToLocation } = require('./code-range-transforms');

const vscode = require('./vscodeService').getVscode();

function prepareActionSetup() {
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