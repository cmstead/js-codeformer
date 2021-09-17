const { asyncPrepareActionSetup } = require("../../action-setup");
const { getMethodBuilder } = require("../../builders/MethodBuilder");
const { METHOD_DEFINITION, FUNCTION_DECLARATION, FUNCTION_EXPRESSION, ARROW_FUNCTION_EXPRESSION } = require("../../constants/ast-node-types");
const { getNodeType } = require("../../core-utils");
const { findNodeByCheckFunction } = require("../../edit-utils/node-path-utils");
const { getNewSourceEdit } = require("../../edit-utils/SourceEdit");
const { transformLocationToRange } = require("../../edit-utils/textEditTransforms");
const { getFunctionName, getFunctionBody, getFunctionParametersString } = require("../../function-utils/function-source");
const { parseAndShowMessage, buildInfoMessage } = require("../../ui-services/messageService");
const { validateUserInput } = require("../../validatorService");

const functionTypes = [
    FUNCTION_DECLARATION,
    FUNCTION_EXPRESSION,
    ARROW_FUNCTION_EXPRESSION,
    METHOD_DEFINITION];

function toggleAsync() {
    let actionSetup = null;
    let functionNode = null;

    return asyncPrepareActionSetup()
        .then((newActionSetup) => actionSetup = newActionSetup)

        .then(() => findNodeByCheckFunction(
            actionSetup.selectionPath,
            (node) => functionTypes.includes(getNodeType(node))
        ))

        .then((functionNode) => validateUserInput({
            value: functionNode,
            validator: (functionNode) => functionNode !== null,
            message: buildInfoMessage('No function found at selection')
        }))
        .then((newFunctionNode) => functionNode = newFunctionNode)

        .then(() => getMethodBuilder({
            functionType: getNodeType(functionNode),
            functionName: getFunctionName(functionNode),
            functionParameters: getFunctionParametersString(functionNode, actionSetup.source),
            functionBody: getFunctionBody(functionNode, actionSetup.source),
            async: !functionNode.async
        }).buildNewMethod())

        .then((functionString) => {
            const replacementRange = transformLocationToRange(functionNode.loc);

            return getNewSourceEdit()
                .addReplacementEdit(replacementRange, functionString)
                .applyEdit();
        })

        .catch(function (error) {
            parseAndShowMessage(error);
        });
}

module.exports = {
    toggleAsync
};