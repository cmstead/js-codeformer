const { asyncPrepareActionSetup } = require('../../action-setup');
const { findNodeByCheckFunction } = require('../../edit-utils/node-path-utils');
const { getNodeType } = require('../../core-utils');
const { parseAndShowMessage, buildInfoMessage } = require('../../ui-services/messageService');
const { validateUserInput } = require('../../validatorService');

const {
    FUNCTION_DECLARATION,
    FUNCTION_EXPRESSION,
    ARROW_FUNCTION_EXPRESSION,
    METHOD_DEFINITION
} = require('../../constants/ast-node-types');

const { getFunctionDeclaration, getFunctionName, getFunctionNode } = require('./move-function-into-class');
const { getMethodBuilder } = require('../../builders/MethodBuilder');
const { getFunctionBody, getFunctionParametersString } = require('../../function-utils/function-source');

let functionTypes = [
    FUNCTION_DECLARATION,
    FUNCTION_EXPRESSION,
    ARROW_FUNCTION_EXPRESSION
];

function moveFunctionIntoClass() {
    let actionSetup = null;
    let methodString = null;

    return asyncPrepareActionSetup()
        .then((newActionSetup) => actionSetup = newActionSetup)

        .then(() => findNodeByCheckFunction(
            actionSetup.selectionPath,
            (node) => functionTypes.includes(getNodeType(node))))

        .then((functionNode) =>
            getFunctionDeclaration(functionNode, actionSetup.selectionPath))

        .then((functionDeclaration) => validateUserInput({
            value: functionDeclaration,
            validator: (functionDeclaration) => functionDeclaration !== null,
            message: buildInfoMessage('Unable to find a function declaration to move')
        }))

        .then((functionDeclaration) => ({
            functionName: getFunctionName(functionDeclaration),
            functionNode: getFunctionNode(functionDeclaration)
        }))

        .then(({ functionName, functionNode }) => getMethodBuilder({
            functionType: METHOD_DEFINITION,
            functionName,
            functionBody: getFunctionBody(functionNode),
            functionParameters: getFunctionParametersString(functionNode),
            async: functionNode.async,
            generator: functionNode.generator
        }).buildNewMethod())

        .then((newMethodString) => methodString = newMethodString)

        .catch(function (error) {
            parseAndShowMessage(error);
        });
}

module.exports = {
    moveFunctionIntoClass
};