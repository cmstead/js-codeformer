const estraverse = require('estraverse');

function startLocationIsOkay(node, selectionLocation) {
    return (node.loc.start.line < selectionLocation.start.line
        || (node.loc.start.line === selectionLocation.start.line
            && node.loc.start.column <= selectionLocation.start.column));
}

function endLocationIsOkay(node, selectionLocation) {
    return (node.loc.end.line > selectionLocation.end.line
        || (node.loc.end.line === selectionLocation.end.line
            && node.loc.end.column >= selectionLocation.end.column));
}

function nodeContainsSelection(node, selectionLocation) {
    return startLocationIsOkay(node, selectionLocation)
        && endLocationIsOkay(node, selectionLocation);
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