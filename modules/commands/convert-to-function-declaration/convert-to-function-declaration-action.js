const { asyncPrepareActionSetup } = require("../../action-setup");
const { FUNCTION_DECLARATION, FUNCTION_EXPRESSION, ARROW_FUNCTION_EXPRESSION } = require("../../constants/ast-node-types");
const { getNodeType, first } = require("../../core-utils");
const { findNodeByCheckFunction } = require("../../edit-utils/node-path-utils");
const { getNewSourceEdit } = require("../../edit-utils/SourceEdit");
const { transformLocationToRange } = require("../../edit-utils/textEditTransforms");
const { openInputBox } = require("../../ui-services/inputService");
const { buildInfoMessage, parseAndShowMessage } = require("../../ui-services/messageService");
const { validateUserInput } = require("../../validatorService");
const { isValidVariableDeclaration, findVariableDeclaration, buildFunctionString } = require("./convert-to-function-declaration");

const replaceableFunctionTypes = [FUNCTION_DECLARATION, FUNCTION_EXPRESSION, ARROW_FUNCTION_EXPRESSION];
function convertToFunctionDeclaration() {
    let actionSetup = null;
    let nodeToReplace = null;

    let functionNode = null;
    return asyncPrepareActionSetup()
        .then((newActionSetup) => actionSetup = newActionSetup)

        .then(() => findVariableDeclaration(actionSetup.selectionPath))

        .then((nodeToReplace) => {
            if (nodeToReplace === null || !isValidVariableDeclaration(nodeToReplace)) {
                return findNodeByCheckFunction(
                    actionSetup.selectionPath,
                    (node) => replaceableFunctionTypes.includes(getNodeType(node)))
            } else {
                return nodeToReplace
            }
        })

        .then((newNodeToReplace) => nodeToReplace = newNodeToReplace)
        .then((nodeToReplace) => validateUserInput({
            value: nodeToReplace,
            validator: (nodeToReplace) => nodeToReplace !== null,
            message: buildInfoMessage('Be sure you have selected a function to convert; canceling action')
        }))

        .then(() => {
            const nodeType = getNodeType(nodeToReplace);

            if (replaceableFunctionTypes.includes(nodeType)) {
                functionNode = nodeToReplace;

                return openInputBox({
                    title: 'Enter a name for your function'
                });
            } else {
                const declarator = first(nodeToReplace.declarations);
                functionNode = declarator.init;

                return declarator.id.name;
            }
        })

        .then((functionName) => validateUserInput({
            value: functionName,
            validator: (functionName) => typeof functionName === 'string' && functionName.trim() !== '',
            message: buildInfoMessage(`It looks like you didn't choose a name for your function; canceling action`)
        }))

        .then((functionName) => buildFunctionString(actionSetup.source, functionNode, functionName))

        .then((functionString) => {
            const replacementRange = transformLocationToRange(nodeToReplace.loc);

            return getNewSourceEdit()
                .addReplacementEdit(replacementRange, functionString)
                .applyEdit();
        })

        .catch(function (error) {
            parseAndShowMessage(error);
        });
}

module.exports = {
    convertToFunctionDeclaration
};