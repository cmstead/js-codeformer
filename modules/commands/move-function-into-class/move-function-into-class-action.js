const { asyncPrepareActionSetup } = require('../../action-setup');
const { findNodeByCheckFunction } = require('../../edit-utils/node-path-utils');
const { getNodeType } = require('../../core-utils');
const { parseAndShowMessage, buildInfoMessage } = require('../../ui-services/messageService');
const { validateUserInput } = require('../../validatorService');

const {
    FUNCTION_DECLARATION,
    FUNCTION_EXPRESSION,
    ARROW_FUNCTION_EXPRESSION
} = require('../../constants/ast-node-types');

const { getFunctionDeclaration } = require('./move-function-into-class');

let functionTypes = [
    FUNCTION_DECLARATION,
    FUNCTION_EXPRESSION,
    ARROW_FUNCTION_EXPRESSION
];

function moveFunctionIntoClass() {
    let actionSetup = null;

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

        .then((functionDeclaration) => {
            
        })

        .catch(function (error) {
            parseAndShowMessage(error);
        });
}

module.exports = {
    moveFunctionIntoClass
};