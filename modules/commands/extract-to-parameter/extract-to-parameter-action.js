const { asyncPrepareActionSetup } = require("../../action-setup");
const { getNewSourceEdit } = require("../../edit-utils/SourceEdit");
const { transformLocationToRange } = require("../../edit-utils/textEditTransforms");
const { showErrorMessage } = require("../../ui-services/messageService");
const { validateUserInput } = require("../../validatorService");
const { pickVariableDeletionLocation } = require("../inline-variable/inline-variable");
const { findVariableDeclarator, findVariableDeclaration, findFunction, getFunctionString, getVariableName } = require("./extract-to-parameter");

function extractToParameter() {
    let actionSetup = null;
    let variableDeclarator = null;
    let variableDeclaration = null;
    let functionNode = null;
    let functionString = null;

    return asyncPrepareActionSetup()
        .then((newActionSetup) =>
            actionSetup = newActionSetup)

        .then(() => findVariableDeclarator(actionSetup.selectionPath))
        .then((variableDeclarator) => validateUserInput({
            value: variableDeclarator,
            validator: (variableDeclarator) => variableDeclarator !== null,
            message: 'No variable selected; cannot extract parameter'
        }))
        .then((newVariableDeclarator) =>
            variableDeclarator = newVariableDeclarator)

        .then(() => findVariableDeclaration(actionSetup.selectionPath))
        .then((variableDeclaration) => validateUserInput({
            value: variableDeclaration,
            validator: (variableDeclaration) => variableDeclaration !== null,
            message: 'No variable selected: cannot extract parameter'
        }))
        .then((newVariableDeclaration) =>
            variableDeclaration = newVariableDeclaration)


        .then(() => findFunction(actionSetup.selectionPath))
        .then((functionNode) => validateUserInput({
            value: functionNode,
            validator: (functionNode) => functionNode !== null,
            message: 'Variable is not within a function scope; cannot extract parameter'
        }))
        .then((newFunctionNode) =>
            functionNode = newFunctionNode)

        .then(() => {
            const variableName = getVariableName(variableDeclarator);

            return getFunctionString(functionNode, variableName, actionSetup.source);
        })

        .then((newFunctionString) => functionString = newFunctionString)

        .then(() => {
            const functionReplacementLocation = functionNode.loc;
            const variableDeletionLocation = pickVariableDeletionLocation(
                variableDeclarator,
                variableDeclaration,
                actionSetup.source)

            const functionReplacementRange = transformLocationToRange(functionReplacementLocation);
            const variableDeletionRange = transformLocationToRange(variableDeletionLocation);

            getNewSourceEdit()
                .addReplacementEdit(functionReplacementRange, functionString)
                .addReplacementEdit(variableDeletionRange, '')
                .applyEdit();
        })

        .catch(function (error) {
            console.log(error);
            
            showErrorMessage(error.message);
        });
}

module.exports = {
    extractToParameter
};