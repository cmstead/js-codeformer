const { VARIABLE_DECLARATION, ARROW_FUNCTION_EXPRESSION, FUNCTION_DECLARATION, FUNCTION_EXPRESSION, FUNCTION, BLOCK_STATEMENT } = require("../../constants/ast-node-types");
const { findNodeInPath } = require("../../edit-utils/node-path-utils");
const { first, getNodeType } = require('../../core-utils');
const { getMethodBuilder } = require("../../builders/MethodBuilder");
const { getFunctionBody, getFunctionParametersString } = require("../../function-utils/function-source");

const functionNodeTypes = [
    ARROW_FUNCTION_EXPRESSION,
    FUNCTION_EXPRESSION,
    FUNCTION
];

function findVariableDeclaration(nodePath) {
    return findNodeInPath(nodePath, VARIABLE_DECLARATION);
}

function isValidVariableDeclaration(variableDeclaration) {
    const declarationsLength = variableDeclaration.declarations.length;
    const declaration = first(variableDeclaration.declarations);
    const initType = declaration.init !== null ? getNodeType(declaration.init) : null;

    return declarationsLength === 1
        && functionNodeTypes.includes(initType)
}

function isSingleLineArrowFunction(functionNode) {
    return getNodeType(functionNode) === ARROW_FUNCTION_EXPRESSION
        && getNodeType(functionNode.body) !== BLOCK_STATEMENT
}

function buildFunctionBody(functionNode, sourceText) {
    const functionBody = getFunctionBody(functionNode, sourceText);

    return isSingleLineArrowFunction(functionNode)
        ? `return ${functionBody}`
        : functionBody;

}

function buildFunctionString(source, functionNode, functionName) {
    const functionType = FUNCTION_DECLARATION;
    const functionBody = buildFunctionBody(functionNode, source);
    const functionParameters = getFunctionParametersString(functionNode, source);

    return getMethodBuilder({
        functionName,
        functionType,
        functionBody,
        functionParameters,
        async: functionNode.async,
        generator: functionNode.generator
    })
        .buildNewMethod();
}

module.exports = {
    findVariableDeclaration,
    isValidVariableDeclaration,
    buildFunctionString
};