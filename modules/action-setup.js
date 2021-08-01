const parser = require('./parser/parser');
const nodePath = require('./node-path');
const { transformSelectionToLocation } = require('./edit-utils/code-range-transforms');

function getVscodeInstance() {
    return require('./vscodeService').getVscode();
}

function prepareActionSetup(vscode = null) {
    vscode = vscode === null ? getVscodeInstance() : vscode;

    const activeTextEditor = vscode.window.activeTextEditor;

    const location = transformSelectionToLocation(activeTextEditor.selection);
    const source = activeTextEditor.document.getText()

    try {
        const ast = parser.parse(source);
        const selectionPath = nodePath.buildNodePath(ast, location);
    
        return {
            activeTextEditor,
            source,
            
            location,
            ast,
            selectionPath
        };
    
    } catch (_) {
        throw new Error('Unable to interpret source code; JS CodeFormer cannot start');
    }
}

function asyncPrepareActionSetup(vscode = null) {
    return new Promise(function (resolve, reject) {
        try{
            const actionSetup = prepareActionSetup(vscode);

            resolve(actionSetup);
        } catch (error) {
            reject(error);
        }
    })
}

module.exports = {
    prepareActionSetup,
    asyncPrepareActionSetup
};