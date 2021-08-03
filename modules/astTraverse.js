const estraverse = require('estraverse');

function skipTypeScriptSpecificNodes(node) {
    return node.type.startsWith('TS')
        ? estraverse.VisitorOption.Skip
        : node;
}

function traverse(ast, behaviors) {
    return estraverse.traverse(ast, {
        ...behaviors,
        fallback(node) {
            return skipTypeScriptSpecificNodes(node);
        }
    });
}

module.exports = {
    traverse,
    VisitorOption: estraverse.VisitorOption
};