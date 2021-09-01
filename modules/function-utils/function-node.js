const { getNodeType } = require("../core-utils");
const { findNodeByCheckFunction } = require("../edit-utils/node-path-utils");

function findFunctionNode(nodePath, functionNodeTypes) {
    return findNodeByCheckFunction(nodePath, node =>
        functionNodeTypes.includes(getNodeType(node)));
}

module.exports = {
    findFunctionNode
};