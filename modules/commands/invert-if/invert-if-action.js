const { asyncPrepareActionSetup } = require("../../action-setup");
const { IF_STATEMENT, BLOCK_STATEMENT } = require("../../constants/ast-node-types");
const { getNodeType } = require("../../core-utils");
const { findNodeInPath } = require("../../edit-utils/node-path-utils");
const { getNewSourceEdit } = require("../../edit-utils/SourceEdit");
const { transformLocationToRange } = require("../../edit-utils/textEditTransforms");
const { getBodyCoordinates } = require("../../function-utils/function-location");
const { getSourceSelection } = require("../../source-utilities");
const { buildInfoMessage, parseAndShowMessage } = require("../../ui-services/messageService");
const { validateUserInput } = require("../../validatorService");
const { invertTestExpression, buildIfStatement } = require("./invert-if");

function invertIf() {
    let actionSetup = null;
    let ifNode = null;
    let consequentBody = null;
    let alternateBody = null;
    let testExpression = null;

    return asyncPrepareActionSetup()
        .then((newActionSetup) =>
            actionSetup = newActionSetup)

        .then(() =>
            findNodeInPath(actionSetup.selectionPath, IF_STATEMENT))
            
        .then((ifNode) => validateUserInput({
            value: ifNode,
            validator: ifNode => ifNode !== null
                && ifNode.alternate !== null
                && getNodeType(ifNode.alternate) === BLOCK_STATEMENT,
            message: buildInfoMessage('Cannot locate acceptable conditional to invert; canceling invert if')
        }))

        .then((newIfNode) => ifNode = newIfNode)

        .then(() => consequentBody = getSourceSelection(actionSetup.source, getBodyCoordinates(ifNode.consequent)))
        .then(() => alternateBody = getSourceSelection(actionSetup.source, getBodyCoordinates(ifNode.alternate)))
        .then(() => testExpression = invertTestExpression(actionSetup.source, ifNode.test))

        .then(() => buildIfStatement(alternateBody, consequentBody, testExpression))

        .then((ifStatement) => {
            const replacementRange = transformLocationToRange(ifNode.loc);

            return getNewSourceEdit()
                .addReplacementEdit(replacementRange, ifStatement)
                .applyEdit();
        })

        .catch(function (error) {
            parseAndShowMessage(error);
        });
}

module.exports = {
    invertIf
};