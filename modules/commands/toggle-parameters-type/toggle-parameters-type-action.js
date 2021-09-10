const { asyncPrepareActionSetup } = require("../../action-setup");
const { FUNCTION_DECLARATION, ARROW_FUNCTION_EXPRESSION, OBJECT_PATTERN, FUNCTION_EXPRESSION } = require("../../constants/ast-node-types");
const { getNodeType } = require("../../core-utils");
const { findNodeByCheckFunction } = require("../../edit-utils/node-path-utils");
const { insertSnippet } = require("../../edit-utils/snippet-service");
const { transformLocationToRange } = require("../../edit-utils/textEditTransforms");
const { buildInfoMessage, parseAndShowMessage } = require("../../ui-services/messageService");
const { validateUserInput } = require("../../validatorService");
const { getParameterListLocation, buildParameterObjectSnippet, buildPositionalParameterString } = require("./toggle-parameters-type");

function toggleParametersType() {
    let actionSetup = null;
    let functionTypes = [FUNCTION_DECLARATION, FUNCTION_EXPRESSION, ARROW_FUNCTION_EXPRESSION];
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
                    && functionNode.params.length > 0,
                message: buildInfoMessage('Unable to find function, or parameter list is empty; canceling convert action')
            }))
        .then((newFunctionNode) =>
            functionNode = newFunctionNode)

        .then(() =>
            getParameterListLocation(functionNode.params))
        .then((newParameterListLocation) => {
            const replacementRange = transformLocationToRange(newParameterListLocation);
            const isPositional = functionNode.params.length > 1
                || getNodeType(functionNode.params[0]) !== OBJECT_PATTERN

            const snippetText = isPositional
                ? buildParameterObjectSnippet(actionSetup.source, functionNode.params)
                : buildPositionalParameterString(actionSetup.source, functionNode.params);

            return insertSnippet(snippetText, replacementRange);
        })

        .catch(function (error) {
            parseAndShowMessage(error);
        });
}

module.exports = {
    toggleParametersType
};