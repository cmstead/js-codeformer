const { BLOCK_STATEMENT, PROGRAM } = require("../constants/ast-node-types");
const { reverse } = require("../core-utils");

function getSurroundingScope(selectionPath) {
    return reverse(selectionPath)
        .find(node =>
            node.type === BLOCK_STATEMENT
            || node.type === PROGRAM);
}

function findNodeByCheckFunction(selectionPath, isMatchingNode) {
    return reverse(selectionPath).find(isMatchingNode);
}

function findNodeInPath(selectionPath, nodeType) {
    return findNodeByCheckFunction(selectionPath, node => node.type === nodeType)
}

module.exports = {
    getSurroundingScope,
    findNodeInPath,
    findNodeByCheckFunction
};