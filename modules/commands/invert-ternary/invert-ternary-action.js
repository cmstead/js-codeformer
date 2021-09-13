const { asyncPrepareActionSetup } = require("../../action-setup");
const { getNewTernaryBuilder } = require("../../builders/ternaryBuilder");
const { invertTestExpression } = require("../../conditionals-service");
const { CONDITIONAL_EXPRESSION } = require("../../constants/ast-node-types");
const { findNodeInPath } = require("../../edit-utils/node-path-utils");
const { getNewSourceEdit } = require("../../edit-utils/SourceEdit");
const { transformLocationToRange } = require("../../edit-utils/textEditTransforms");
const { getSourceSelection } = require("../../source-utilities");
const { buildInfoMessage, parseAndShowMessage } = require("../../ui-services/messageService");
const { validateUserInput } = require("../../validatorService");

function invertTernary() {
    let actionSetup = null;
    let ternaryNode = null;
    let consequentBody = null;
    let alternateBody = null;
    let testExpression = null;

    return asyncPrepareActionSetup()
        .then((newActionSetup) =>
            actionSetup = newActionSetup)

        .then(() =>
            findNodeInPath(actionSetup.selectionPath, CONDITIONAL_EXPRESSION))

        .then((ternaryNode) => validateUserInput({
            value: ternaryNode,
            validator: ternaryNode => ternaryNode !== null,
            message: buildInfoMessage('Cannot locate acceptable ternary to invert; canceling invert ternary')
        }))

        .then((newIfNode) => ternaryNode = newIfNode)

        .then(() => consequentBody = getSourceSelection(actionSetup.source, ternaryNode.consequent.loc))
        .then(() => alternateBody = getSourceSelection(actionSetup.source, ternaryNode.alternate.loc))
        .then(() => testExpression = invertTestExpression(actionSetup.source, ternaryNode.test))

        .then(() => getNewTernaryBuilder({
            test: testExpression,
            consequent: alternateBody,
            alternate: consequentBody
        }).buildTernary())

        .then((ifStatement) => {
            const replacementRange = transformLocationToRange(ternaryNode.loc);

            return getNewSourceEdit()
                .addReplacementEdit(replacementRange, ifStatement)
                .applyEdit();
        })

        .catch(function (error) {
            parseAndShowMessage(error);
        });
}

module.exports = {
    invertTernary
};