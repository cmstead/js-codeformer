const { asyncPrepareActionSetup } = require("../../action-setup");
const { LITERAL, BINARY_EXPRESSION } = require('../../constants/ast-node-types');
const { getNodeType } = require("../../core-utils");
const { findNodeByCheckFunction } = require("../../edit-utils/node-path-utils");

function isStringLiteral(node) {
    return getNodeType(node) === LITERAL && typeof node.value === 'string'
}

function isStringExpressionCandidate(node) {
    return isStringLiteral(node) || getNodeType(node) === BINARY_EXPRESSION;
}

function convertToTemplateLiteral() {
    let actionSetup = null;

    return asyncPrepareActionSetup()
        .then((newActionSetup) => actionSetup = newActionSetup)

        .then(() =>
            findNodeByCheckFunction(
                actionSetup.selectionPath,
                isStringExpressionCandidate))
}

module.exports = {
    convertToTemplateLiteral
}