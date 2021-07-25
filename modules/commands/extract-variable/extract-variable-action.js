// 1. [x] get the scope for extraction (window.showQuickPick)
// 2. [x] get the variable name (window.showInputBox)
// 3. [ ] get variable type (const, let, var -- in that order -- window.showQuickPick)
// 4. [ ] replace original selection with variable name
// 5. [ ] insert variable declaration

const { prepareActionSetup } = require('../../action-setup');

const { buildExtractionPath } = require('./ExtractionPathBuilder');

const {
    buildExtractionScopeList,
    selectExtractionScopes,
    acceptableNodeTypes,
    variableTypeList,
    buildVariableDeclaration,
    getSourceSelection
} = require('./extract-variable');

function extractVariable(vscode) {
    const {
        showInputBox,
        showQuickPick
    } = vscode.window;

    const actionSetup = prepareActionSetup(vscode);
    const sourceSelection = getSourceSelection(actionSetup.source, actionSetup.location)

    const extractionPath = buildExtractionPath(actionSetup.selectionPath, acceptableNodeTypes);
    const extractionScopeList = buildExtractionScopeList(extractionPath);

    let extractionScopes = null;
    let newVariableName = null;
    let newVariableType = null;

    let variableDeclaration = null;

    showQuickPick(extractionScopeList, { 
        title: 'Extract variable to where?',
        ignoreFocusOut: true
    })
        .then(function (selectedScope) {

            if (typeof selectedScope === 'undefined') {
                throw new Error('Scope not selected; cannot extract variable');
            }

            extractionScopes = selectExtractionScopes(extractionPath, selectedScope);

            return showInputBox({ 
                title: 'New variable name',
                ignoreFocusOut: true
            })
        })
        .then(function (variableName) {
            if(typeof variableName === 'undefined') {
                throw new Error('No variable name entered; cannot extract variable');
            }

            newVariableName = variableName;

            return showQuickPick(variableTypeList, {
                title: 'Select variable type',
                ignoreFocusOut: true
            })
        })
        .then(function (variableType) {
            if(typeof variableType === 'undefined') {
                throw new Error('No variable type selected; cannot extract variable');
            }

            newVariableType = variableType;
        })
        .then(function () {
            variableDeclaration = buildVariableDeclaration({
                variableType: newVariableType,
                variableName: newVariableName,
                source: sourceSelection
            })
        })
        .catch(function (error) {
            vscode.window.showErrorMessage(error.message);
        });
}

module.exports = {
    extractVariable
}