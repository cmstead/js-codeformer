const { asyncPrepareActionSetup } = require("../../action-setup");
const { getNewSourceEdit } = require("../../edit-utils/SourceEdit");
const { transformLocationToRange } = require("../../edit-utils/textEditTransforms");
const { buildInfoMessage, parseAndShowMessage } = require("../../ui-services/messageService");
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
            message: buildInfoMessage(`It looks like you either didn't select a string, or string concatenation; canceling action`)
        }))
        .then((selectedExpression) => expressionToConvert = selectedExpression)

        .then(() => buildTemplateLiteral(expressionToConvert, actionSetup.source))

        .then((convertedString) => {
            const replacementRange = transformLocationToRange(expressionToConvert.loc);

            return getNewSourceEdit()
                .addReplacementEdit(replacementRange, '`' + convertedString + '`')
                .applyEdit();
        })

        .catch(function(error){
            parseAndShowMessage(error);
        });
}

module.exports = {
    convertToTemplateLiteral
}