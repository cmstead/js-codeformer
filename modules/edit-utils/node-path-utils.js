const { BLOCK_STATEMENT, PROGRAM } = require("../constants/ast-node-types");
const { reverse, getNodeType } = require("../core-utils");

function getSurroundingScope(selectionPath) {
    return reverse(selectionPath)
        .find(node =>
            getNodeType(node) === BLOCK_STATEMENT
            || getNodeType(node) === PROGRAM);
}

function findNodeByCheckFunction(selectionPath, isMatchingNode) {
    let matchingNode = null;
    const reversedSelectionPath = reverse(selectionPath);

    for(const key in reversedSelectionPath) {
        const node = reversedSelectionPath[key];

        if(isMatchingNode(node)) {
            matchingNode = node;
        } else if (matchingNode !== null && !isMatchingNode(node)) {
            break;
        }
    }

    return matchingNode;
}

function findNodeInPath(selectionPath, nodeType) {
    return findNodeByCheckFunction(selectionPath, node => getNodeType(node) === nodeType)
}

function findAncestorNodeInPath(selectionPath, childNode, checkFunction) {
    const selectionPathCopy = selectionPath.slice(0);

    while (selectionPathCopy.pop() !== childNode) { /* do keep looking */}

    return findNodeByCheckFunction(selectionPathCopy, checkFunction);
}

module.exports = {
    getSurroundingScope,
    findAncestorNodeInPath,
    findNodeInPath,
    findNodeByCheckFunction
};