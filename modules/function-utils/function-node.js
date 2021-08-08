const { findNodeByCheckFunction } = require("../edit-utils/node-path-utils");

function findFunctionNode(nodePath, functionNodeTypes) {
    return findNodeByCheckFunction(nodePath, node =>
        functionNodeTypes.includes(node.type));
}

module.exports = {
    findFunctionNode
};