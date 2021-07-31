const { BLOCK_STATEMENT, PROGRAM, VARIABLE_DECLARATOR } = require("../../ast-node-types");

function getSurroundingScope(selectionPath) {
    const reversedPath = selectionPath.slice(0);
    reversedPath.reverse();

    return reversedPath.find(node => 
        node.type === BLOCK_STATEMENT
        || node.type === PROGRAM);
}

function getVariableDeclaractor(selectionPath) {
    const reversedPath = selectionPath.slice(0);
    reversedPath.reverse();

    return reversedPath.find(node => node.type === VARIABLE_DECLARATOR);
}

module.exports = {
    getSurroundingScope,
    getVariableDeclaractor
};