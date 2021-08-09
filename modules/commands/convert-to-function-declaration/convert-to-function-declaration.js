const { VARIABLE_DECLARATION, ARROW_FUNCTION_EXPRESSION, FUNCTION_DECLARATION, FUNCTION_EXPRESSION, FUNCTION } = require("../../constants/ast-node-types");
const { findNodeInPath } = require("../../edit-utils/node-path-utils");
const { first } = require('../../core-utils');
const { getMethodBuilder } = require("../../builders/MethodBuilder");
const { getFunctionBody, getFunctionParametersString } = require("../../function-utils/function-source");

const functionNodeTypes = [
    ARROW_FUNCTION_EXPRESSION,
    FUNCTION_DECLARATION,
    FUNCTION_EXPRESSION,
    FUNCTION
];

function findVariableDeclaration(nodePath) {
    return findNodeInPath(nodePath, VARIABLE_DECLARATION);
}

function isValidVariableDeclaration(variableDeclaration) {
    const declarationsLength = variableDeclaration.declarations.length;
    const declaration = first(variableDeclaration.declarations);
    const initType = declaration.init !== null ? declaration.init.type : null;

    return declarationsLength === 1
        && functionNodeTypes.includes(initType) 
}

function buildFunctionString(variableDeclaration, source) {
    const variableDeclarator = first(variableDeclaration.declarations);
    const functionNode = variableDeclarator.init;

    const functionName = variableDeclarator.id.name
    const functionType = FUNCTION_DECLARATION;
    const functionBody = getFunctionBody(functionNode, source);
    const functionParameters = getFunctionParametersString(functionNode, source);

    return getMethodBuilder({
        functionName,
        functionType,
        functionBody,
        functionParameters
    })
    .buildNewMethod();
}

module.exports = {
    findVariableDeclaration,
    isValidVariableDeclaration,
    buildFunctionString
};