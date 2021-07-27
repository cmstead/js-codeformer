const vscodeService = require('../../vscodeService');

const { prepareActionSetup } = require('../../action-setup');

const { buildExtractionPath } = require('./ExtractionPathBuilder');

const {
    transformLocationPartToPosition,
    transformLocationToRange
} = require('../../textEditTransforms');

const vscode = vscodeService.getVscode();
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

    WorkspaceEdit
} = vscode;

const {
    buildExtractionScopeList,
    selectExtractionScopes,
    selectExtractionLocation,
    acceptableNodeTypes,
    variableTypeList,
    buildVariableDeclaration,
    getSourceSelection
} = require('./extract-variable');

function openSelectList({ values, title }) {
    return showQuickPick(values, {
        title: title,
        ignoreFocusOut: true
    });
}

function openInputBox(title) {
    return showInputBox({
        title: title,
        ignoreFocusOut: true
    })
}

function selectExtractionPoint(
    extractionScopeList,
    extractionPath
) {
    const values = extractionScopeList;
    const title = 'Extract variable to where?';

    return openSelectList({ values, title })

        .then(function (selectedScope) {

            if (typeof selectedScope === 'undefined') {
                throw new Error('Scope not selected; cannot extract variable');
            }

            return selectExtractionScopes(extractionPath, selectedScope);
        });
}

function selectVariableType() {
    return openSelectList({
        values: variableTypeList,
        title: 'Select variable type'
    })
        .then(function (variableType) {
            if (typeof variableType === 'undefined') {
                throw new Error('No variable type selected; cannot extract variable');
            }

            return variableType;
        })
}

function getVariableName() {
    return openInputBox('New variable name')
        .then(function (variableName) {
            if (typeof variableName === 'undefined') {
                throw new Error('No variable name entered; cannot extract variable');
            }

            return variableName;
        });
}

function buildEditLocations({
    extractionScopes,
    nodePath,
    actionSetup
}) {
    const extractionBlock = extractionScopes.extractionScope[0];
    const extractionLocation = selectExtractionLocation(nodePath, extractionBlock);

    return {
        extractionPosition: transformLocationPartToPosition(extractionLocation.start),
        replacementRange: transformLocationToRange(actionSetup.location)
    }

}

function applyCodeEdits({
    newVariableName,
    variableDeclaration,
    extractionPosition,
    replacementRange
}) {
    const uri = activeTextEditor.document.uri;

    const workspaceEdit = new WorkspaceEdit();

    workspaceEdit.replace(uri, replacementRange, newVariableName);
    workspaceEdit.insert(uri, extractionPosition, variableDeclaration + '\n');

    applyEdit(workspaceEdit);
}

function extractVariable() {
    const actionSetup = prepareActionSetup(vscode);
    const sourceSelection = getSourceSelection(actionSetup.source, actionSetup.location)

    const nodePath = actionSetup.selectionPath;
    const extractionPath = buildExtractionPath(actionSetup.selectionPath, acceptableNodeTypes);
    const extractionScopeList = buildExtractionScopeList(extractionPath);

    let extractionScopes = null;
    let newVariableName = null;
    let newVariableType = null;

    let variableDeclaration = null;

    return selectExtractionPoint(
        extractionScopeList,
        extractionPath
    )
        .then((extractionPoint) =>
            extractionScopes = extractionPoint)

        .then(() => selectVariableType())
        .then((variableType) =>
            newVariableType = variableType)

        .then(() => getVariableName())
        .then((variableName) =>
            newVariableName = variableName)

        .then(() => buildVariableDeclaration({
                variableType: newVariableType,
                variableName: newVariableName,
                source: sourceSelection
            }))
        .then((newVariableDeclaration) =>
            variableDeclaration = newVariableDeclaration)

        .then(() =>
            buildEditLocations({
                extractionScopes,
                nodePath,
                actionSetup
            }))

        .then(({ extractionPosition, replacementRange }) =>
            applyCodeEdits({
                newVariableName,
                variableDeclaration,
                extractionPosition,
                replacementRange
            }))

        .catch(function (error) {
            showErrorMessage(error.message);
        });
}

module.exports = {
    extractVariable
}