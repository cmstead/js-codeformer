const { asyncPrepareActionSetup } = require("../../action-setup");
const { getNewIfBuilder } = require("../../builders/IfBuilder");
const { CONDITIONAL_EXPRESSION, RETURN_STATEMENT } = require("../../constants/ast-node-types");
const { findNodeInPath } = require("../../edit-utils/node-path-utils");
const { getNewSourceEdit } = require("../../edit-utils/SourceEdit");
const { transformLocationToRange } = require("../../edit-utils/textEditTransforms");
const { getSourceSelection } = require("../../source-utilities");
const { buildInfoMessage, parseAndShowMessage } = require("../../ui-services/messageService");
const { validateUserInput } = require("../../validatorService");

function convertTernaryToIfElse() {
    let actionSetup = null;
    let ternaryExpression = null;
    let returnStatement = null;

    return asyncPrepareActionSetup()
        .then((newActionSetup) =>
            actionSetup = newActionSetup)

        .then(() => findNodeInPath(actionSetup.selectionPath, CONDITIONAL_EXPRESSION))
        .then((newTernaryExpression) => ternaryExpression = newTernaryExpression)

        .then(() => findNodeInPath(actionSetup.selectionPath, RETURN_STATEMENT))
        .then((newReturnStatement) => returnStatement = newReturnStatement)

        .then(() => validateUserInput({
            value: ternaryExpression,
            validator: (ternaryExpression) => ternaryExpression !== null
                && returnStatement !== null
                && returnStatement.argument === ternaryExpression,
            message: buildInfoMessage('Unable to find an acceptable ternary expression to convert; canceling action')
        }))

        .then(() => getNewIfBuilder({
            test: `return ${getSourceSelection(actionSetup.source, ternaryExpression.consequent.loc)};`,
            consequent: `return ${getSourceSelection(actionSetup.source, ternaryExpression.alternate.loc)};`,
            alternate: getSourceSelection(actionSetup.source, ternaryExpression.test.loc)
        }).buildIf())

        .then((newIfStatement) => {
            const replacementRange = transformLocationToRange(returnStatement.loc);

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