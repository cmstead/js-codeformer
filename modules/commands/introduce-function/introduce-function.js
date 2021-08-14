const { CALL_EXPRESSION, IDENTIFIER } = require("../../constants/ast-node-types");
const { last, getNodeType } = require("../../core-utils");
const { findNodeInPath } = require("../../edit-utils/node-path-utils");

function getNameOrCall(selectionPath) {
    const identifier = last(selectionPath);
    const callNode = findNodeInPath(selectionPath, CALL_EXPRESSION);

    return callNode !== null ? callNode : identifier;
}

function getNodeName(selectedNode) {
    return getNodeType(selectedNode) === IDENTIFIER
        ? selectedNode.name
        : selectedNode.callee.name;
}

function buildParameterString(parameterCount) {
    const parameters = [];

    for (let i = 0; i < parameterCount; i++) {
        parameters.push(`param${i + 1}`);
    }

    return parameters.join(', ');
}

function getParameterString(selectedNode) {
    return getNodeType(selectedNode) === CALL_EXPRESSION
        ? buildParameterString(selectedNode.arguments.length)
        : '';
}

module.exports = {
    getNameOrCall,
    getNodeName,
    getParameterString
};