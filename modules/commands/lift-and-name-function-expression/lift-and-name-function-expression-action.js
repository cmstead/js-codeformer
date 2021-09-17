const { asyncPrepareActionSetup } = require("../../action-setup");
const { findNodeByCheckFunction } = require("../../edit-utils/node-path-utils");
const { insertSnippet } = require("../../edit-utils/snippet-service");
const { transformLocationToRange } = require("../../edit-utils/textEditTransforms");
const { retrieveExtractionLocation, buildCopyLocation, buildInsertionLocation } = require("../../extraction-utils/extraction-location-service");
const { buildExtractionPath } = require("../../extraction-utils/ExtractionPathBuilder");
const { buildExtractionScopeList, selectExtractionScopes } = require("../../extraction-utils/extractionScopeService");
const { getSourceSelection } = require("../../source-utilities");
const { openSelectList } = require("../../ui-services/inputService");
const { buildInfoMessage, parseAndShowMessage } = require("../../ui-services/messageService");
const { validateUserInput } = require("../../validatorService");
const { isAnonymousFunction, acceptableNodeTypes, getNewFunctionString } = require("./lift-and-name-function-expression");

const { selectExtractionLocation } = require('../../extraction-utils/extraction-location-service')



function liftAndNameFunctionExpression() {
    let actionSetup = null;
    let extractionPath = null;
    let functionNode = null;
    let selectedScopeNode = null;

    const getNearestAnonymousFunction = () => findNodeByCheckFunction(actionSetup.selectionPath, isAnonymousFunction);

    return asyncPrepareActionSetup()
        .then((newActionSetup) => actionSetup = newActionSetup)

        .then(() => getNearestAnonymousFunction())
        .then((functionNode) =>
            validateUserInput({
                value: functionNode,
                validator: (functionNode) => functionNode !== null,
                message: buildInfoMessage('No anonymous function found; canceling lift and name action')
            }))
        .then((newFunctionNode) =>
            functionNode = newFunctionNode)

        .then(() =>
            buildExtractionPath(actionSetup.selectionPath, acceptableNodeTypes))
        .then((newExtractionPath) =>
            extractionPath = newExtractionPath)

        .then(() => openSelectList({
            values: buildExtractionScopeList(extractionPath),
            title: 'Where do you want to lift your function to?'
        }))
        .then((selectedScopeString) => validateUserInput({
            value: selectedScopeString,
            validator: (selectedScopeString) => selectedScopeString.trim() !== '',
            message: buildInfoMessage('No scope selected; canceling lift and name action')
        }))
        .then((selectedScopeString) => {
            const extractionScopes = selectExtractionScopes(extractionPath, selectedScopeString);
            selectedScopeNode = retrieveExtractionLocation(extractionScopes)
        })

        .then(() => getNewFunctionString(functionNode, `\${1:newFunctionName}`, actionSetup.source))
        .then((functionString) => {
            const extractionPoint = selectExtractionLocation(actionSetup.selectionPath, selectedScopeNode);
            const copyLocation = buildCopyLocation(extractionPoint, functionNode.loc);
            const insertionLocation = buildInsertionLocation(extractionPoint, functionNode.loc);

            const copiedSource = getSourceSelection(actionSetup.source, copyLocation);

            const snippetText = `${functionString}\n${copiedSource}\$1`;
            const insertionRange = transformLocationToRange(insertionLocation);

            return insertSnippet(snippetText, insertionRange);
        })

        .then(() => 'Press tab or escape to exit')

        .catch(function (error) {
            parseAndShowMessage(error);
        });
}

module.exports = {
    liftAndNameFunctionExpression
};