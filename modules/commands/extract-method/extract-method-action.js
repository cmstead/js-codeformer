const { asyncPrepareActionSetup } = require('../../action-setup');
const { buildExtractionPath } = require('../../extraction-utils/ExtractionPathBuilder');
const { buildInfoMessage, parseAndShowMessage } = require('../../ui-services/messageService');
const { validateUserInput } = require('../../validatorService');
const { openSelectList } = require('../../ui-services/inputService');
const { getSourceSelection } = require('../../source-utilities');
const { buildEditLocations, transformLocationToRange } = require('../../edit-utils/textEditTransforms');

const {
    selectExtractionLocation,
    retrieveExtractionLocation,
    buildCopyLocation,
    buildInsertionLocation
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
const { insertSnippet } = require('../../edit-utils/snippet-service');

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

function extractMethod() {
    let actionSetup = null;
    let sourceSelection = null;

    let nodePath = null;
    let extractionPath = null;
    let extractionScopeList = null;

    let extractionLocation = null;

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
            parseSelectedText(actionSetup.source, actionSetup.location))
        .then((parsedSelection) =>
            findAppropriateParameters(
                parsedSelection,
                extractionPath,
                extractionLocation))

        .then((suggestedParameters) => {
            return buildMethodText({
                destinationType: getNodeType(extractionLocation),
                methodName: '${1:newMethodName}',
                methodBody: wrapJsxElement(selectedNode, sourceSelection),
                parameters: [`\${2:${suggestedParameters}}`]
            })
        })
        .then((newMethodText) =>
            methodText = newMethodText)

        .then(() =>
            buildMethodCallText({
                destinationType: getNodeType(extractionLocation),
                parameters: '$2',
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

        .then(() => {
            const extractionPoint = selectExtractionLocation(actionSetup.selectionPath, extractionLocation);
            const copyLocation = buildCopyLocation(extractionPoint, actionSetup.location);
            const insertionLocation = buildInsertionLocation(extractionPoint, actionSetup.location);

            const copiedSource = getSourceSelection(actionSetup.source, copyLocation);

            const snippetText = `${methodText}\n${copiedSource}${methodCallText}`;
            const insertionRange = transformLocationToRange(insertionLocation);

            return insertSnippet(snippetText, insertionRange);
        })

        .catch(function (error) {
            parseAndShowMessage(error);
        });
}


module.exports = {
    extractMethod
}