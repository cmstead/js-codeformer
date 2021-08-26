const { MethodBuilder } = require("../../builders/MethodBuilder");
const { VARIABLE_DECLARATOR, ARROW_FUNCTION_EXPRESSION, FUNCTION_DECLARATION, FUNCTION_EXPRESSION, FUNCTION, METHOD_DEFINITION, VARIABLE_DECLARATION } = require("../../constants/ast-node-types");
const { getNodeType, last, first } = require("../../core-utils");
const { findNodeInPath, findNodeByCheckFunction } = require("../../edit-utils/node-path-utils");

const { pickVariableDeletionLocation } = require('../../extraction-utils/variable-deletion-utils');
const { getFunctionParametersString } = require("../../function-utils/function-source");
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

function getFunctionName(functionNode) {
    try {
        if (typeof functionNode.id !== 'undefined'
            && typeof functionNode.id.name !== 'undefined') {
            return functionNode.id.name;
        } else if (typeof functionNode.key !== 'undefined'
            && typeof functionNode.key.name !== 'undefined') {
            return functionNode.key.name;
        } else {
            return '';
        }
    } catch (_) {
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

function buildLocation(start, end) {
    const reverseOrder = start.line > end.line
        || (start.line === end.line && start.column > end.column)

    return {
        start: reverseOrder ? end : start,
        end: reverseOrder ? start : end
    }
}

function partitionOnLocation(sourceLocation, partitioningLocation) {
    return [
        buildLocation(sourceLocation.start, partitioningLocation.start),
        buildLocation(partitioningLocation.end, sourceLocation.end)
    ]
}

function getFunctionBody(functionNode, sourceText, deletionLocation) {
    const functionBody = getBodyNodeFromFunctionNode(functionNode);
    const bodyLocation = getBodyLocation(functionBody.body);

    const locationPartitions = partitionOnLocation(bodyLocation, deletionLocation);

    return locationPartitions
        .map((location) => getSourceSelection(sourceText, location))
        .join('');
}

function getFunctionString(functionNode, variableName, sourceText, deletionLocation) {
    const functionName = getFunctionName(functionNode);
    const functionBody = getFunctionBody(functionNode, sourceText, deletionLocation);
    const functionType = getNodeType(functionNode);
    
    const functionParameterString = getFunctionParametersString(functionNode, sourceText);
    const separator = functionParameterString.trim() !== '' ? ', ' : '';

    const functionParameters = `${functionParameterString}${separator}${variableName}`;

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
    getFunctionString,
    getVariableName,
    pickVariableDeletionLocation
};