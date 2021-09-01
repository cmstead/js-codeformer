const estraverse = require('estraverse');
const { getNodeType } = require('./core-utils');

function skipTypeScriptSpecificNodes(node) {
    return node.type.startsWith('TS')
        ? estraverse.VisitorOption.Skip
        : node;
}

function traverse(ast, behaviors) {
    return estraverse.traverse(ast, {
        ...behaviors,
        fallback(node) {
            const nodeType = getNodeType(node);

            if (nodeType.startsWith('TS')) {
                return estraverse.VisitorOption.Skip;
            } else if(nodeType === 'JSXElement') {
                node.children.forEach(node => {
                    traverse(node, behaviors);
                });
            } else if(nodeType === 'JSXExpressionContainer') {
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