const { asyncPrepareActionSetup } = require("../../action-setup");
const { findNodeByCheckFunction } = require("../../edit-utils/node-path-utils");
const { getNewSourceEdit } = require("../../edit-utils/SourceEdit");
const { transformLocationPartToPosition, transformLocationToRange } = require("../../edit-utils/textEditTransforms");
const { retrieveExtractionLocation } = require("../../extraction-utils/extraction-location-service");
const { buildExtractionPath } = require("../../extraction-utils/ExtractionPathBuilder");
const { buildExtractionScopeList, selectExtractionScopes } = require("../../extraction-utils/extractionScopeService");
const { openSelectList, openInputBox } = require("../../ui-services/inputService");
const { showErrorMessage } = require("../../ui-services/messageService");
const { validateUserInput } = require("../../validatorService");
const { isAnonymousFunction, acceptableNodeTypes, getNewFunctionString } = require("./lift-and-name-function-expression");



function liftAndNameFunctionExpression() {
    let actionSetup = null;
    let extractionPath = null;
    let functionNode = null;
    let selectedScopeNode = null;
    let functionName = null;

    const getNearestAnonymousFunction = () => findNodeByCheckFunction(actionSetup.selectionPath, isAnonymousFunction);

    return asyncPrepareActionSetup()
        .then((newActionSetup) => actionSetup = newActionSetup)

        .then(() => getNearestAnonymousFunction())
        .then((functionNode) =>
            validateUserInput({
                value: functionNode,
                validator: (functionNode) => functionNode !== null,
                message: 'No anonymous function found; canceling lift and name action'
            }))
        .then((newFunctionNode) =>
            functionNode = newFunctionNode)

        .then(() =>
            buildExtractionPath(actionSetup.selectionPath, acceptableNodeTypes))
        .then((newExtractionPath) =>
            extractionPath = newExtractionPath)

        .then(() => openInputBox({
            title: 'What is the name of your function?'
        }))
        .then((functionName) => validateUserInput({
            value: functionName,
            validator: (functionName) => functionName.trim() !== '',
            message: 'No function name provided; canceling lift and name action'
        }))
        .then((newFunctionName) => functionName = newFunctionName)

        .then(() => openSelectList({
            values: buildExtractionScopeList(extractionPath),
            title: 'Where do you want to lift your function to?'
        }))
        .then((selectedScopeString) => validateUserInput({
            value: selectedScopeString,
            validator: (selectedScopeString) => selectedScopeString.trim() !== '',
            message: 'No scope selected; canceling lift and name action'
        }))
        .then((selectedScopeString) => {
            const extractionScopes = selectExtractionScopes(extractionPath, selectedScopeString);
            selectedScopeNode = retrieveExtractionLocation(extractionScopes)
        })

        .then(() => getNewFunctionString(functionNode, functionName, actionSetup))
        .then((functionString) => {
            const replacementRange = transformLocationToRange(functionNode.loc);
            const editPosition = transformLocationPartToPosition(selectedScopeNode.loc.start);

            return getNewSourceEdit()
                .addReplacementEdit(replacementRange, functionName)
                .addInsertEdit(editPosition, `${functionString}\n`)
                .applyEdit();
        })

        .catch(function (error) {
            showErrorMessage(error.message);
        });
}

module.exports = {
    liftAndNameFunctionExpression
};