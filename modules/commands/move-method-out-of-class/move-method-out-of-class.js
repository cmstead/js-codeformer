const astTraverse = require("../../astTraverse");
const { THIS_EXPRESSION } = require("../../constants/ast-node-types");
const { getNodeType } = require("../../core-utils");

function methodDoesNotUseThis(methodNode) {
    const thisReferences = [];

    astTraverse.traverse(methodNode, {
        enter: (node) => {
            if(getNodeType(node) === THIS_EXPRESSION) {
                thisReferences.push(node);
            }
        }
    });

    return thisReferences.length === 0;
}

module.exports = {
    methodDoesNotUseThis
};