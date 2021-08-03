const estraverse = require('estraverse');

function traverse(ast, behaviors) {
    return estraverse.traverse(ast, {
        ...behaviors,
        fallback(node) {
            return node.type.startsWith('TS')
                ? estraverse.VisitorOption.Skip
                : node;
        }
    });
}

module.exports = {
    traverse,
    VisitorOption: estraverse.VisitorOption
};