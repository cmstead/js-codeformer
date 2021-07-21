const estraverse = require('estraverse');

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

function buildNodePath(parsedSource, selectionLocation) {
    let nodePath = [];

    estraverse.traverse(parsedSource, {
        enter: function (node) {
            if(node.type === 'IfStatement') {
                console.log(node);
            }
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