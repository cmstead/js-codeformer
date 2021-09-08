const { BINARY_EXPRESSION, LITERAL } = require("../../constants/ast-node-types");
const { getNodeType } = require("../../core-utils");
const { findNodeByCheckFunction } = require("../../edit-utils/node-path-utils");
const { getSourceSelection } = require("../../source-utilities");

function isStringLiteral(node) {
    return getNodeType(node) === LITERAL && typeof node.value === 'string'
}

function isStringExpressionCandidate(node) {
    return isStringLiteral(node) || getNodeType(node) === BINARY_EXPRESSION;
}

function checkExpressionTree(expression) {
    if(expression === null) {
        return false;
    }

    const expressionIsNotBinary = getNodeType(expression) !== BINARY_EXPRESSION;
    const operatorIsNotConcat = expression === null ||  expression.operator !== '+';

    if (expressionIsNotBinary) {
        return true;
    } else if (operatorIsNotConcat) {
        return false;
    } else {
        return checkExpressionTree(expression.left) && checkExpressionTree(expression.right);
    }
}

function findNearestExpressionToConvert(selectionPath) {
    return findNodeByCheckFunction(
        selectionPath,
        isStringExpressionCandidate);
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

module.exports = {
    findNearestExpressionToConvert,
    checkExpressionTree,
    buildTemplateLiteral
};