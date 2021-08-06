const { MethodBuilder } = require("../../builders/MethodBuilder");
const { VARIABLE_DECLARATOR, ARROW_FUNCTION_EXPRESSION, FUNCTION_DECLARATION, FUNCTION_EXPRESSION, FUNCTION, METHOD_DEFINITION, VARIABLE_DECLARATION } = require("../../constants/ast-node-types");
const { getNodeType, last } = require("../../core-utils");
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
    const firstLoc = functionBodyNodes[0].loc;
    const lastLoc = last(functionBodyNodes).loc;

    return {
        start: firstLoc.start,
        end: lastLoc.end
    };
}

function getFunctionBody(functionNode, sourceText) {
    const functionBody = typeof functionNode.value !== 'undefined'
        ? functionNode.value.body
        : functionNode.body;

    const bodyLocation = getBodyLocation(functionBody.body);

    return getSourceSelection(sourceText, bodyLocation);
}

function getFunctionString(functionNode, variableName, sourceText) {
    const methodBuiler = new MethodBuilder({
        functionName: getFunctionName(functionNode),
        functionParameters: getFunctionParametersString(functionNode, variableName),
        functionBody: getFunctionBody(functionNode, sourceText),
        functionType: getNodeType(functionNode)
    });

    return methodBuiler.buildNewMethod();
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