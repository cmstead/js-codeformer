const { BLOCK_STATEMENT, PROGRAM, VARIABLE_DECLARATOR } = require("../../ast-node-types");

function reverse(values) {
    const reversedValues = values.slice(0);
    reversedValues.reverse();

    return reversedValues;
}

function getSurroundingScope(selectionPath) {
    return reverse(selectionPath)
        .find(node =>
            node.type === BLOCK_STATEMENT
            || node.type === PROGRAM);
}

function getVariableDeclaractor(selectionPath) {
    return reverse(selectionPath)
        .find(node =>
            node.type === VARIABLE_DECLARATOR);
}

module.exports = {
    getSurroundingScope,
    getVariableDeclaractor
};