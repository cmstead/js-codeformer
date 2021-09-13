const { getNewTernaryBuilder } = require("../../builders/ternaryBuilder");
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

function buildTernaryExpression(consequent, alternate, testExpression) {
    return getNewTernaryBuilder({
        test: testExpression,
        consequent,
        alternate
    }).buildTernary();
}

module.exports = {
    invertTestExpression,
    buildTernaryExpression

};