const estraverse = require('estraverse');

function nodeContainsSelection(node, selectionLocation) {
    return (node.loc.start.line < selectionLocation.start.line
        || (node.loc.start.line === selectionLocation.start.line
            && node.loc.start.column <= selectionLocation.start.column))

        && (node.loc.end.line > selectionLocation.end.line
            || (node.loc.end.line === selectionLocation.end.line
                && node.loc.end.column >= selectionLocation.end.column));
}

function buildNodePath(parsedSource, selectionLocation) {
    let nodePath = [];

    estraverse.traverse(parsedSource, {
        enter: function (node) {
            if (nodeContainsSelection(node, selectionLocation)) {
                nodePath.push(node);
            }
        }
    });

    return nodePath;
}

module.exports = {
    buildNodePath
};