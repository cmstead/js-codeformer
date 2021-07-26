const vscodeService = require('../../vscodeService');

const { prepareActionSetup } = require('../../action-setup');

const { buildExtractionPath } = require('./ExtractionPathBuilder');

const {
    window: {
        activeTextEditor,
        showErrorMessage,
        showInputBox,
        showQuickPick
    },
    workspace: {
        applyEdit
    },
    Position,
    Range,
    WorkspaceEdit
 } = vscodeService.getVscode();

const {
    buildExtractionScopeList,
    selectExtractionScopes,
    selectExtractionLocation,
    acceptableNodeTypes,
    variableTypeList,
    buildVariableDeclaration,
    getSourceSelection
} = require('./extract-variable');

function transformLocationPartToPosition({ line, column }) {
    return new Position(line - 1, column);
}

function transformLocationToRange({ start, end }) {
    return new Range(
        transformLocationPartToPosition(start),
        transformLocationPartToPosition(end)
    );
}

function extractVariable(vscode) {
    const actionSetup = prepareActionSetup(vscode);
    const sourceSelection = getSourceSelection(actionSetup.source, actionSetup.location)

    const nodePath = actionSetup.selectionPath;
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
            if (typeof variableName === 'undefined') {
                throw new Error('No variable name entered; cannot extract variable');
            }

            newVariableName = variableName;

            return showQuickPick(variableTypeList, {
                title: 'Select variable type',
                ignoreFocusOut: true
            })
        })
        .then(function (variableType) {
            if (typeof variableType === 'undefined') {
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
        .then(function () {
            const uri = activeTextEditor.document.uri;

            const extractionBlock = extractionScopes.extractionScope[0];
            const extractionLocation = selectExtractionLocation(nodePath, extractionBlock);

            const extractionPosition = transformLocationPartToPosition(extractionLocation.start);
            const replacementRange = transformLocationToRange(actionSetup.location);

            const workspaceEdit = new WorkspaceEdit();

            workspaceEdit.replace(uri, replacementRange, newVariableName);
            workspaceEdit.insert(uri, extractionPosition, variableDeclaration + '\n');

            applyEdit(workspaceEdit);
        })
        .catch(function (error) {
            showErrorMessage(error.message);
        });
}

module.exports = {
    extractVariable
}