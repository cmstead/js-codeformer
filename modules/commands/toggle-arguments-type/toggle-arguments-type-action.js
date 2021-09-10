const { asyncPrepareActionSetup } = require("../../action-setup");
const { CALL_EXPRESSION, OBJECT_EXPRESSION } = require("../../constants/ast-node-types");
const { getNodeType } = require("../../core-utils");
const { findNodeByCheckFunction } = require("../../edit-utils/node-path-utils");
const { insertSnippet } = require("../../edit-utils/snippet-service");
const { transformLocationToRange } = require("../../edit-utils/textEditTransforms");
const { buildInfoMessage, parseAndShowMessage } = require("../../ui-services/messageService");
const { validateUserInput } = require("../../validatorService");
const {
    getArgumentListLocation,
    buildArgumentObjectSnippet,
    buildPositionalArgumentString } = require("./toggle-arguments-type");

function toggleArgumentsType() {
    let actionSetup = null;
    let functionTypes = [CALL_EXPRESSION];
    let functionNode = null;
    return asyncPrepareActionSetup()
        .then((newActionSetup) => actionSetup = newActionSetup)

        .then(() =>
            findNodeByCheckFunction(
                actionSetup.selectionPath,
                node => functionTypes.includes(getNodeType(node))
            ))
        .then((functionNode) =>
            validateUserInput({
                value: functionNode,
                validator: functionNode => functionNode !== null
                    && functionNode.arguments.length > 0,
                message: buildInfoMessage('Unable to find function call, or argument list is empty; canceling convert action')
            }))
        .then((newFunctionNode) =>
            functionNode = newFunctionNode)

        .then(() =>
            getArgumentListLocation(functionNode.arguments))
        .then((newArgumentListLocation) => {
            const replacementRange = transformLocationToRange(newArgumentListLocation);
            const isPositional = functionNode.arguments.length > 1
                || getNodeType(functionNode.arguments[0]) !== OBJECT_EXPRESSION

            const snippetText = isPositional
                ? buildArgumentObjectSnippet(actionSetup.source, functionNode.arguments)
                : buildPositionalArgumentString(actionSetup.source, functionNode.arguments);

            return insertSnippet(snippetText, replacementRange);
        })

        .catch(function (error) {
            parseAndShowMessage(error);
        });
}

module.exports = {
    toggleArgumentsType
};