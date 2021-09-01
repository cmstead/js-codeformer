const estraverse = require('estraverse');
const { JSX_ELEMENT, JSX_EXPRESSION_CONTAINER } = require('./constants/ast-node-types');
const { getNodeType } = require('./core-utils');

function traverse(ast, behaviors) {
    return estraverse.traverse(ast, {
        ...behaviors,
        fallback(node) {
            const nodeType = getNodeType(node);

            if (nodeType.startsWith('TS')) {
                return estraverse.VisitorOption.Skip;
            } else if(nodeType === JSX_ELEMENT) {
                node.children.forEach(node => {
                    traverse(node, behaviors);
                });
            } else if(nodeType === JSX_EXPRESSION_CONTAINER) {
                traverse(node.expression, behaviors);
            }

            return node;
        }
    });
}

module.exports = {
    traverse,
    VisitorOption: estraverse.VisitorOption
};