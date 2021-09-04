const { asyncPrepareActionSetup } = require("../../action-setup");
const { OBJECT_PATTERN, CALL_EXPRESSION } = require("../../constants/ast-node-types");
const { getNodeType } = require("../../core-utils");
const { findNodeInPath } = require("../../edit-utils/node-path-utils");
const { transformLocationToRange } = require("../../edit-utils/textEditTransforms");
const { buildInfoMessage, parseAndShowMessage } = require("../../ui-services/messageService");
const { validateUserInput } = require("../../validatorService");
const { getParameterListLocation, buildParameterObjectSnippet, buildPositionalParameterString } = require("./toggle-arguments-type");

const vscode = require('../../vscodeService').getVscode();

function buildSnippetString(snippetText) {
    return new vscode.SnippetString(snippetText);
}

function toggleArgumentsType() {
    let actionSetup = null;
    let functionNode = null;
    
    return asyncPrepareActionSetup()
        .then((newActionSetup) => actionSetup = newActionSetup)

        .then(() =>
            findNodeInPath(actionSetup.selectionPath, CALL_EXPRESSION))
        .then((functionCallNode) =>
            validateUserInput({
                value: functionCallNode,
                validator: functionCallNode => functionCallNode !== null
                    && functionCallNode.params.length > 0,
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

            const snippetString = buildSnippetString(snippetText);

            return actionSetup.activeTextEditor
                .insertSnippet(snippetString, replacementRange);
        })

        .catch(function (error) {
            parseAndShowMessage(error);
        });
}

module.exports = {
    toggleParametersType: toggleArgumentsType
};