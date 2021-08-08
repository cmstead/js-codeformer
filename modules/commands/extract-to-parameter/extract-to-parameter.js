const { MethodBuilder } = require("../../builders/MethodBuilder");
const { VARIABLE_DECLARATOR, ARROW_FUNCTION_EXPRESSION, FUNCTION_DECLARATION, FUNCTION_EXPRESSION, FUNCTION, METHOD_DEFINITION, VARIABLE_DECLARATION } = require("../../constants/ast-node-types");
const { getNodeType, last, first } = require("../../core-utils");
const { findNodeInPath, findNodeByCheckFunction } = require("../../edit-utils/node-path-utils");

const { pickVariableDeletionLocation } = require('../../extraction-utils/variable-deletion-utils');
const { getSourceSelection } = require("../../source-utilities");

const functionNodeTypes = [
    ARROW_FUNCTION_EXPRESSION,
    FUNCTION_DECLARATION,
    FUNCTION_EXPRESSION,
    FUNCTION,
    METHOD_DEFINITION
];

function findVariableDeclarator(nodePath) {
    return findNodeInPath(nodePath, VARIABLE_DECLARATOR);
}

function findVariableDeclaration(nodePath) {
    return findNodeInPath(nodePath, VARIABLE_DECLARATION);
}

function getVariableName(variableDeclarator) {
    return variableDeclarator.id.name;
}

function findFunction(nodePath) {
    return findNodeByCheckFunction(nodePath, node =>
        functionNodeTypes.includes(node.type));
}

function getFunctionParametersString(functionNode, variableName) {
    const parameters = typeof functionNode.value !== 'undefined'
        ? functionNode.value.params
        : functionNode.params;

    return parameters.concat(variableName).join(', ');
}

function getFunctionName(functionNode) {
    if (typeof functionNode.id !== 'undefined'
        && typeof functionNode.id.name !== 'undefined') {
        return functionNode.id.name;
    } else if (typeof functionNode.key !== 'undefined'
        && typeof functionNode.key.name !== 'undefined') {
        return functionNode.key.name;
    } else {
        return '';
    }
}

function getBodyLocation(functionBodyNodes) {
    const firstLocation = first(functionBodyNodes).loc;
    const lastLocation = last(functionBodyNodes).loc;

    return {
        start: firstLocation.start,
        end: lastLocation.end
    };
}

function getBodyNodeFromFunctionNode(functionNode) {
    return typeof functionNode.value !== 'undefined'
        ? functionNode.value.body
        : functionNode.body
}

function getFunctionBody(functionNode, sourceText) {
    const functionBody = getBodyNodeFromFunctionNode(functionNode);
    const bodyLocation = getBodyLocation(functionBody.body);

    return getSourceSelection(sourceText, bodyLocation);
}

function getFunctionString(functionNode, variableName, sourceText) {
    const functionName = getFunctionName(functionNode);
    const functionParameters = getFunctionParametersString(functionNode, variableName);
    const functionBody = getFunctionBody(functionNode, sourceText);
    const functionType = getNodeType(functionNode);

    return new MethodBuilder({
        functionName,
        functionParameters,
        functionBody,
        functionType
    }).buildNewMethod();
}

module.exports = {
    findVariableDeclarator,
    findVariableDeclaration,
    findFunction,
    getFunctionParametersString,
    getFunctionString,
    getVariableName,
    pickVariableDeletionLocation
};