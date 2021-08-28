const { ARROW_FUNCTION_EXPRESSION, FUNCTION_EXPRESSION, BLOCK_STATEMENT, CLASS_PROPERTY, METHOD_DEFINITION } = require("../../constants/ast-node-types");
const { findNodeInPath } = require("../../edit-utils/node-path-utils");
const { getNodeType } = require('../../core-utils');
const { getMethodBuilder } = require("../../builders/MethodBuilder");
const { getFunctionBody, getFunctionParametersString } = require("../../function-utils/function-source");

const functionNodeTypes = [
    ARROW_FUNCTION_EXPRESSION,
    FUNCTION_EXPRESSION
];

function findClassPropertyDeclaration(nodePath) {
    return findNodeInPath(nodePath, CLASS_PROPERTY);
}

function isValidVariableDeclaration(propertyDeclaration) {
    const valueType = propertyDeclaration.value !== null 
        ? propertyDeclaration.value.type 
        : null;

    return getNodeType(propertyDeclaration) === CLASS_PROPERTY
        && functionNodeTypes.includes(valueType) 
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

function buildFunctionString(propertyDeclaration, source) {
    const functionNode = propertyDeclaration.value;
    const functionName = propertyDeclaration.key.name

    const functionType = METHOD_DEFINITION;
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
    findVariableDeclaration: findClassPropertyDeclaration,
    findClassPropertyDeclaration,
    isValidVariableDeclaration,
    buildFunctionString
};