const { asyncPrepareActionSetup } = require("../../action-setup");
const { getMethodBuilder, methodTypes, arrowFunctionBuildTypes } = require("../../builders/MethodBuilder");
const { ARROW_FUNCTION_EXPRESSION, EMPTY_STATEMENT, RETURN_STATEMENT, BLOCK_STATEMENT } = require("../../constants/ast-node-types");
const { getNodeType } = require("../../core-utils");
const { findNodeInPath } = require("../../edit-utils/node-path-utils");
const { getNewSourceEdit } = require("../../edit-utils/SourceEdit");
const { transformLocationToRange } = require("../../edit-utils/textEditTransforms");
const { getFunctionBody, getFunctionParametersString } = require("../../function-utils/function-source");
const { parseAndShowMessage, buildInfoMessage } = require("../../ui-services/messageService");
const { validateUserInput } = require("../../validatorService");

function hasOnlyAReturnLine(body) {
    const exectuableBodyNodes = body.filter(node => getNodeType(node) !== EMPTY_STATEMENT)

    return exectuableBodyNodes.length === 1
        && getNodeType(exectuableBodyNodes[0]) === RETURN_STATEMENT;
}

function toggleArrowFunctionBraces() {
    let actionSetup = null;
    let arrowFunctionNode = null;

    return asyncPrepareActionSetup()
        .then((newActionSetup) =>
            actionSetup = newActionSetup)

        .then(() => findNodeInPath(
            actionSetup.selectionPath,
            ARROW_FUNCTION_EXPRESSION))
        .then((arrowFunctionNode) => {
            return validateUserInput({
                value: arrowFunctionNode,
                validator: (arrowFunctionNode) => arrowFunctionNode !== null
                    && (arrowFunctionNode.expression === true
                        || (
                            getNodeType(arrowFunctionNode.body) === BLOCK_STATEMENT
                            && hasOnlyAReturnLine(arrowFunctionNode.body.body)
                        )
                        || (
                            Array.isArray(arrowFunctionNode.body)
                            && arrowFunctionNode.body[0] === RETURN_STATEMENT
                        )),
                message: buildInfoMessage('Unable to find an arrow function which can be converted')
            })
        })
        .then((newArrowFunctionNode) => arrowFunctionNode = newArrowFunctionNode)

        .then(() => {
            const methodBuilder = getMethodBuilder({
                functionName: '',
                functionType: methodTypes.ARROW_FUNCTION_EXPRESSION,
                functionBody: getFunctionBody(arrowFunctionNode, actionSetup.source),
                functionParameters: getFunctionParametersString(arrowFunctionNode, actionSetup.source)
            })

            return arrowFunctionNode.expression
                ? methodBuilder.buildArrowFunction(arrowFunctionBuildTypes.AS_MULTILINE)
                : methodBuilder.buildArrowFunction(arrowFunctionBuildTypes.AS_STANDARD)
        })

        .then((arrowFunctionString) => {
            const replacementRange = transformLocationToRange(arrowFunctionNode.loc);

            return getNewSourceEdit()
                .addReplacementEdit(replacementRange, arrowFunctionString)
                .applyEdit();
        })

        .catch(function (error) {
            parseAndShowMessage(error);
        });
}

module.exports = {
    toggleArrowFunctionBraces
};