const { asyncPrepareActionSetup } = require("../../action-setup");
const { showErrorMessage } = require("../../ui-services/messageService");
const { validateUserInput } = require("../../validatorService");
const { findVariableDeclarator, findVariableDeclaration, findFunction, getFunctionParametersString } = require("./extract-to-parameter");

function extractToParameter() {
    let actionSetup = null;
    let variableDeclarator = null;
    let variableDeclaration = null;
    let functionNode = null;

    asyncPrepareActionSetup()
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

        .then(() => getFunctionParametersString(functionNode))

        .catch(function (error) {
            showErrorMessage(error.message);
        });
}

module.exports = {
    extractToParameter
};