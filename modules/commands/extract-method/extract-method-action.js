const { asyncPrepareActionSetup } = require('../../action-setup');
const { buildExtractionPath } = require('../../extraction-utils/ExtractionPathBuilder');
const { getNewSourceEdit } = require('../../edit-utils/SourceEdit');
const { buildInfoMessage, parseAndShowMessage } = require('../../ui-services/messageService');
const { validateUserInput } = require('../../validatorService');
const { openInputBox, openSelectList } = require('../../ui-services/inputService');
const { getSourceSelection } = require('../../source-utilities');
const { buildEditLocations } = require('../../edit-utils/textEditTransforms');

const {
    selectExtractionLocation,
    retrieveExtractionLocation
} = require('../../extraction-utils/extraction-location-service');

const {
    selectExtractionScopes,
    buildExtractionScopeList
} = require('../../extraction-utils/extractionScopeService');

const {
    acceptableNodeTypes,
    buildMethodText,
    buildMethodCallText,
    terminalNodes,
    findAppropriateParameters,
    parseSelectedText
} = require('./extract-method');
const { last, getNodeType } = require('../../core-utils');
const { wrapJsxElement } = require('../../react-service');

function selectExtractionPoint(
    extractionScopeList,
    extractionPath
) {
    return openSelectList({
        values: extractionScopeList,
        title: 'Extract method to where?'
    })

        .then(function (selectedScope) {
            validateUserInput({
                value: selectedScope,
                validator: (selectedScope) => selectedScope !== null,
                message: buildInfoMessage('Scope not selected; cannot extract method')
            });

            return selectExtractionScopes(extractionPath, selectedScope);
        });
}


function getMethodName() {
    return openInputBox({ title: 'New method name' })
        .then((methodName) =>
            validateUserInput({
                value: methodName,
                validator: (methodName) => methodName !== '',
                message: buildInfoMessage('No method name entered; cannot extract method')
            })
        );
}


function getEditedParameters(suggestedParameters) {
    return openInputBox({
        title: 'Edit method parameters',
        value: suggestedParameters.join(', ')
    })
        .then((parameterText) =>
            validateUserInput({
                value: parameterText,
                validator: () => true,
                message: buildInfoMessage('Parameter edit canceled; cannot extract method')
            })
        );
}

function extractMethod() {
    let actionSetup = null;
    let sourceSelection = null;

    let nodePath = null;
    let extractionPath = null;
    let extractionScopeList = null;

    let extractionLocation = null;
    let newMethodName = null;
    let parameterText = null;

    let methodText = null;
    let methodCallText = null;
    let selectedNode = null;

    return asyncPrepareActionSetup()
        .then(function (newActionSetup) {
            actionSetup = newActionSetup;
            sourceSelection = getSourceSelection(actionSetup.source, actionSetup.location);
            selectedNode = last(actionSetup.selectionPath);

            nodePath = actionSetup.selectionPath;

            extractionPath = buildExtractionPath(
                actionSetup.selectionPath,
                acceptableNodeTypes,
                terminalNodes
            );

            extractionScopeList = buildExtractionScopeList(extractionPath);
        })

        .then(() =>
            selectExtractionPoint(
                extractionScopeList,
                extractionPath
            ))
        .then((extractionPoint) =>
            extractionLocation = retrieveExtractionLocation(extractionPoint))

        .then(() =>
            getMethodName())
        .then((methodName) =>
            newMethodName = methodName)

        .then(() =>
            parseSelectedText(actionSetup.source, actionSetup.location))
        .then((parsedSelection) =>
            findAppropriateParameters(
                parsedSelection,
                extractionPath,
                extractionLocation))
        .then((suggestedParameters) =>
            getEditedParameters(suggestedParameters))
        .then((newParameterText) =>
            parameterText = newParameterText)

        .then(() =>
            buildMethodText({
                destinationType: getNodeType(extractionLocation),
                methodName: newMethodName,
                methodBody: wrapJsxElement(selectedNode, sourceSelection),
                parameters: parameterText.split(',').map(parameter => parameter.trim())
            }))
        .then((newMethodText) =>
            methodText = newMethodText)

        .then(() =>
            buildMethodCallText({
                destinationType: getNodeType(extractionLocation),
                methodName: newMethodName,
                parameters: parameterText,
                selectedNode,
                methodBody: sourceSelection
            }))
        .then((newMethodCallText) =>
            methodCallText = newMethodCallText)

        .then(() => {
            const extractionPoint = selectExtractionLocation(
                nodePath,
                extractionLocation
            );

            return buildEditLocations({
                actionSetup,
                extractionLocation: extractionPoint
            })
        })

        .then(({ extractionPosition, replacementRange }) =>
            getNewSourceEdit()
                .addReplacementEdit(replacementRange, methodCallText)
                .addInsertEdit(extractionPosition, methodText + '\n\n')
                .applyEdit())

        .catch(function (error) {
            parseAndShowMessage(error);
        });
}


module.exports = {
    extractMethod
}