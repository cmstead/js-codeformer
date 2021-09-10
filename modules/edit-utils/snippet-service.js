const vscode = require('../vscodeService').getVscode();

function buildSnippetString(snippetText) {
    return new vscode.SnippetString(snippetText);
}

function insertSnippet(snippetText, insertionRange) {
    const snippetString = buildSnippetString(snippetText);

    return vscode.window.activeTextEditor
        .insertSnippet(snippetString, insertionRange);

}

module.exports = {
    insertSnippet
};