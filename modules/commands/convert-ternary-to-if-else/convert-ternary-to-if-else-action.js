const { asyncPrepareActionSetup } = require("../../action-setup");
const { CONDITIONAL_EXPRESSION, RETURN_STATEMENT, VARIABLE_DECLARATION } = require("../../constants/ast-node-types");
const { getNodeType } = require("../../core-utils");
const { findNodeInPath, findNodeByCheckFunction } = require("../../edit-utils/node-path-utils");
const { getNewSourceEdit } = require("../../edit-utils/SourceEdit");
const { transformLocationToRange } = require("../../edit-utils/textEditTransforms");
const { buildInfoMessage, parseAndShowMessage } = require("../../ui-services/messageService");
const { validateUserInput } = require("../../validatorService");
const { pickParentNode, buildNewIfStatement } = require("./convert-ternary-to-if-else");

function convertTernaryToIfElse() {
    let actionSetup = null;
    let ternaryExpression = null;
    let parentNodes = [];
    let parentNode = null;

    return asyncPrepareActionSetup()
        .then((newActionSetup) =>
            actionSetup = newActionSetup)

        .then(() => findNodeInPath(actionSetup.selectionPath, CONDITIONAL_EXPRESSION))
        .then((newTernaryExpression) => ternaryExpression = newTernaryExpression)

        .then((ternaryExpression) => validateUserInput({
            value: ternaryExpression,
            validator: (ternaryExpression) => ternaryExpression !== null,
            message: buildInfoMessage('It looks like you might not have selected a ternary expression; canceling action')
        }))

        .then(() => findNodeInPath(actionSetup.selectionPath, RETURN_STATEMENT))
        .then((returnStatement) => parentNodes.push(returnStatement))

        .then(() => findNodeByCheckFunction(actionSetup.selectionPath, (node) => {
            return getNodeType(node) === VARIABLE_DECLARATION && node.declarations.length === 1;
        }))
        .then((assignmentExpression) => parentNodes.push(assignmentExpression))

        .then(() => parentNode = pickParentNode(parentNodes, ternaryExpression))

        .then(() => validateUserInput({
            value: parentNode,
            validator: (parentNode) => parentNode !== null,
            message: buildInfoMessage('Parent must be a return statement or variable declaration. None found; canceling action')
        }))

        .then(() => buildNewIfStatement(actionSetup.source, parentNode, ternaryExpression))

        .then((newIfStatement) => {
            const replacementRange = transformLocationToRange(parentNode.loc);

            return getNewSourceEdit()
                .addReplacementEdit(replacementRange, newIfStatement)
                .applyEdit();
        })

        .catch(function (error) {
            parseAndShowMessage(error);
        });
}

module.exports = {
    convertTernaryToIfElse
};