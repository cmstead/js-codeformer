const astTraverse = require('./astTraverse');

function nodeStartContainsSelectionStart(node, selectionLocation) {
    return (node.loc.start.line < selectionLocation.start.line
        || (node.loc.start.line === selectionLocation.start.line
            && node.loc.start.column <= selectionLocation.start.column));
}

function nodeEndContainsSelectionEnd(node, selectionLocation) {
    return (node.loc.end.line > selectionLocation.end.line
        || (node.loc.end.line === selectionLocation.end.line
            && node.loc.end.column >= selectionLocation.end.column));
}

function nodeContainsSelection(node, selectionLocation) {
    return nodeStartContainsSelectionStart(node, selectionLocation)
        && nodeEndContainsSelectionEnd(node, selectionLocation);
}

/*
An important note about node paths so I don't forget:

A node path is constructed as an array of nodes, each surrounding the one in the
next position in the array.

The 0th position is the top of the program. The last position is the location of
the user selection. Each node in between the first and last are vertically scoped,
meaning each surrounds the next.

This provides a means to do a vertical search for surrounding scopes and other
ancestor nodes without needing to traverse the entire AST.
*/

function buildNodePath(parsedSource, selectionLocation) {
    let nodePath = [];

    astTraverse.traverse(parsedSource, {
        enter: function (node) {
            if (nodeContainsSelection(node, selectionLocation)) {
                nodePath.push(node);
            }
        }
    });

    return nodePath;
}

module.exports = {
    buildNodePath,
    nodeContainsSelection
};