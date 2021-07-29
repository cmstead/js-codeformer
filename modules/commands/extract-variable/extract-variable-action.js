const { prepareActionSetup } = require('../../action-setup');
const { buildExtractionPath } = require('../../ExtractionPathBuilder');
const { getNewSourceEdit } = require('../../SourceEdit');
const { showErrorMessage } = require('../../messageService');
const { validateUserInput } = require('../../validatorService');
const { openInputBox, openSelectList } = require('../../inputService');

const {
    transformLocationPartToPosition,
    transformLocationToRange
} = require('../../textEditTransforms');

const {
    buildExtractionScopeList,
    selectExtractionScopes,
    selectExtractionLocation,
    acceptableNodeTypes,
    variableTypeList,
    buildVariableDeclaration,
    getSourceSelection
} = require('./extract-variable');


function selectExtractionPoint(
    extractionScopeList,
    extractionPath
) {
    return openSelectList({
        values: extractionScopeList,
        title: 'Extract variable to where?'
    })

        .then(function (selectedScope) {
            validateUserInput({
                value: selectedScope,
                validator: (selectedScope) => selectedScope !== null,
                message: 'Scope not selected; cannot extract variable'
            });

            return selectExtractionScopes(extractionPath, selectedScope);
        });
}


function selectVariableType() {
    return openSelectList({
        values: variableTypeList,
        title: 'Select variable type'
    })
        .then((variableType) =>
            validateUserInput({
                value: variableType,
                validator: (variableType) => variableTypeList.includes(variableType),
                message: 'Invalid variable type, or no variable type selected; cannot extract variable'
            })
        )
}


function getVariableName() {
    return openInputBox('New variable name')
        .then((variableName) =>
            validateUserInput({
                value: variableName,
                validator: (variableName) => variableName !== '',
                message: 'No variable name entered; cannot extract variable'
            })
        );
}


function buildEditLocations({
    extractionBlock,
    nodePath,
    actionSetup: { location: selectionLocation }
}) {
    const { start: extractionLocationStart } = selectExtractionLocation(nodePath, extractionBlock);

    return {
        extractionPosition: transformLocationPartToPosition(extractionLocationStart),
        replacementRange: transformLocationToRange(selectionLocation)
    }

}

function retrieveExtractionBlock(extractionPoint) {
    return extractionPoint.extractionScope[0];
}

function extractVariable() {
    const actionSetup = prepareActionSetup();
    const sourceSelection = getSourceSelection(actionSetup.source, actionSetup.location);

    const nodePath = actionSetup.selectionPath;
    const extractionPath = buildExtractionPath(actionSetup.selectionPath, acceptableNodeTypes);
    const extractionScopeList = buildExtractionScopeList(extractionPath);

    let extractionBlock = null;
    let newVariableName = null;
    let newVariableType = null;

    let variableDeclaration = null;

    return selectExtractionPoint(
        extractionScopeList,
        extractionPath
    )
        .then((extractionPoint) =>
            extractionBlock = retrieveExtractionBlock(extractionPoint))

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
                extractionBlock,
                nodePath,
                actionSetup
            }))

        .then(({ extractionPosition, replacementRange }) =>
            getNewSourceEdit()
                .addReplacementEdit(replacementRange, newVariableName)
                .addInsertEdit(extractionPosition, variableDeclaration + '\n')
                .applyEdit())

        .catch(function (error) {
            showErrorMessage(error.message);
        });
}


module.exports = {
    extractVariable
}