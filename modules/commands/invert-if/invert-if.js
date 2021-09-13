const { getNewIfBuilder } = require("../../builders/IfBuilder");
const { invertTestExpression } = require('../../conditionals-service');

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