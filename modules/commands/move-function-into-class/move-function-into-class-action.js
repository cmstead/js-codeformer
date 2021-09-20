const { asyncPrepareActionSetup } = require('../../action-setup');
const { findNodeByCheckFunction, findNodeInPath } = require('../../edit-utils/node-path-utils');
const { getNodeType } = require('../../core-utils');
const { parseAndShowMessage, buildInfoMessage } = require('../../ui-services/messageService');
const { validateUserInput } = require('../../validatorService');

const {
    FUNCTION_DECLARATION,
    FUNCTION_EXPRESSION,
    ARROW_FUNCTION_EXPRESSION,
    VARIABLE_DECLARATION,
    IDENTIFIER
} = require('../../constants/ast-node-types');

function getFunctionDeclaration(functionNode, selectionPath) {
    if (functionNode === null) {
        return null;
    } else if (getNodeType(functionNode) === FUNCTION_DECLARATION) {
        return functionNode;
    } else {
        const declarationNode = findNodeInPath(selectionPath, VARIABLE_DECLARATION);

        return declarationNode !== null && declarationNode.declarations[0].init === functionNode
            ? functionNode
            : null;
    }
}

function moveFunctionIntoClass() {
    let actionSetup = null;
    let functionTypes = [
        FUNCTION_DECLARATION,
        FUNCTION_EXPRESSION,
        ARROW_FUNCTION_EXPRESSION
    ];

    return asyncPrepareActionSetup()
        .then((newActionSetup) => actionSetup = newActionSetup)

        .then(() => findNodeByCheckFunction(
            actionSetup.selectionPath,
            (node) => functionTypes.includes(getNodeType(node))))
        .then((functionNode) => {
            getFunctionDeclaration(functionNode, actionSetup.selectionPath)
        })
        .then((functionDeclaration) => validateUserInput({
            value: functionDeclaration,
            validator: (functionDeclaration) =>
                functionDeclaration !== null
                && (getNodeType(functionDeclaration.id) === IDENTIFIER
                    || getNodeType(functionDeclaration.declarations[0].id) === IDENTIFIER),
            message: buildInfoMessage('Unable to find a function declaration to move')
        }))

        .catch(function (error) {
            parseAndShowMessage(error);
        });
}

module.exports = {
    moveFunctionIntoClass
};