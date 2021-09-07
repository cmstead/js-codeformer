const { getNewIfBuilder } = require("../../builders/IfBuilder");
const { getNodeType } = require("../../core-utils");
const { getSourceSelection } = require("../../source-utilities");

function invertTestExpression(source, testNode) {
    if (getNodeType(testNode) === 'UnaryExpression' && testNode.operator === '!') {
        return getSourceSelection(source, testNode.argument.loc);
    } else {
        const originalExpression = getSourceSelection(source, testNode.loc);

        return `!(${originalExpression})`;
    }
}

function buildIfStatement(consequent, alternate, testExpression) {
    return getNewIfBuilder({
        test: testExpression,
        consequent,
        alternate
    }).buildIf();
}

module.exports = {
    invertTestExpression,
    buildIfStatement
};