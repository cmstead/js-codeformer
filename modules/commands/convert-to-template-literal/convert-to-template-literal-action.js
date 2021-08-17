const { asyncPrepareActionSetup } = require("../../action-setup");
const { LITERAL, BINARY_EXPRESSION } = require('../../constants/ast-node-types');
const { getNodeType } = require("../../core-utils");
const { findNodeByCheckFunction } = require("../../edit-utils/node-path-utils");
const { getNewSourceEdit } = require("../../edit-utils/SourceEdit");
const { transformLocationToRange } = require("../../edit-utils/textEditTransforms");
const { getSourceSelection } = require("../../source-utilities");
const { validateUserInput } = require("../../validatorService");

function isStringLiteral(node) {
    return getNodeType(node) === LITERAL && typeof node.value === 'string'
}

function isStringExpressionCandidate(node) {
    return isStringLiteral(node) || getNodeType(node) === BINARY_EXPRESSION;
}

function checkExpressionTree(expression) {
    const expressionIsNotBinary = getNodeType(expression) !== BINARY_EXPRESSION;
    const operatorIsNotConcat = expression.operator !== '+';

    if (expressionIsNotBinary) {
        return true;
    } else if (operatorIsNotConcat) {
        return false;
    } else {
        return checkExpressionTree(expression.left) && checkExpressionTree(expression.right);
    }
}

function buildTemplateLiteral(expressionToConvert, source) {
    if (isStringLiteral(expressionToConvert)) {
        return expressionToConvert.value;
    } else if (getNodeType(expressionToConvert) !== BINARY_EXPRESSION) {
        return `\${${getSourceSelection(source, expressionToConvert.loc)}}`
    } else {
        return buildTemplateLiteral(expressionToConvert.left, source)
            + buildTemplateLiteral(expressionToConvert.right, source);
    }
}

function convertToTemplateLiteral() {
    let actionSetup = null;
    let expressionToConvert = null;

    return asyncPrepareActionSetup()
        .then((newActionSetup) => actionSetup = newActionSetup)

        .then(() =>
            findNodeByCheckFunction(
                actionSetup.selectionPath,
                isStringExpressionCandidate))
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