const { VARIABLE_DECLARATOR, ARROW_FUNCTION_EXPRESSION, FUNCTION_DECLARATION, FUNCTION_EXPRESSION, FUNCTION, METHOD_DEFINITION, VARIABLE_DECLARATION } = require("../../constants/ast-node-types");
const { findNodeInPath, findNodeByCheckFunction } = require("../../edit-utils/node-path-utils");

const { pickVariableDeletionLocation } = require('../../extraction-utils/variable-deletion-utils');

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

function getFunctionParametersString(functionNode) {
    console.log(functionNode);
}

module.exports = {
    findVariableDeclarator,
    findVariableDeclaration,
    findFunction,
    getFunctionParametersString,
    getVariableName,
    pickVariableDeletionLocation
};