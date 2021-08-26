const { asyncPrepareActionSetup } = require("../../action-setup");
const { findNodeByCheckFunction } = require("../../edit-utils/node-path-utils");
const { getNewSourceEdit } = require("../../edit-utils/SourceEdit");
const { transformLocationToRange } = require("../../edit-utils/textEditTransforms");
const { validateUserInput } = require("../../validatorService");
const { checkExpressionTree, buildTemplateLiteral, findNearestExpressionToConvert } = require("./convert-to-template-literal");

function convertToTemplateLiteral() {
    let actionSetup = null;
    let expressionToConvert = null;

    return asyncPrepareActionSetup()
        .then((newActionSetup) => actionSetup = newActionSetup)

        .then(() =>
            findNearestExpressionToConvert(actionSetup.selectionPath))
        .then((expression) => validateUserInput({
            value: expression,
            validator: (expression) => checkExpressionTree(expression),
            message: 'Invalid string or expression selected; canceling convert to template literal'
        }))
        .then((selectedExpression) => expressionToConvert = selectedExpression)

        .then(() => buildTemplateLiteral(expressionToConvert, actionSetup.source))

        .then((convertedString) => {
            const replacementRange = transformLocationToRange(expressionToConvert.loc);

            return getNewSourceEdit()
                .addReplacementEdit(replacementRange, '`' + convertedString + '`')
                .applyEdit();
        })
}

module.exports = {
    convertToTemplateLiteral
}