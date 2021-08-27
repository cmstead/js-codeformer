const { getMethodBuilder } = require("../../builders/MethodBuilder");
const { variableTypes, getNewVariableBuilder } = require("../../builders/VariableBuilder");
const astNodeTypes = require("../../constants/ast-node-types");
const { ARROW_FUNCTION_EXPRESSION, FUNCTION_DECLARATION, FUNCTION_EXPRESSION } = require("../../constants/ast-node-types");
const { getNodeType } = require("../../core-utils");
const { getFunctionBody, getFunctionParametersString } = require("../../function-utils/function-source");

const acceptableNodeTypes = [
    astNodeTypes.ARROW_FUNCTION_EXPRESSION,
    astNodeTypes.FUNCTION_DECLARATION,
    astNodeTypes.FUNCTION_EXPRESSION,
    astNodeTypes.FUNCTION,
    astNodeTypes.METHOD_DEFINITION,
    astNodeTypes.WHILE_STATEMENT
];

const isAnonymousFunction = (node) =>
    [FUNCTION_EXPRESSION, ARROW_FUNCTION_EXPRESSION]
        .includes(getNodeType(node));

function getNewFunctionType(functionNodeType) {
    return functionNodeType === FUNCTION_EXPRESSION
        ? FUNCTION_DECLARATION
        : ARROW_FUNCTION_EXPRESSION
}

function buildFunctionString(functionNode, functionName, source) {
    const functionNodeType = getNodeType(functionNode);
    const functionType = getNewFunctionType(functionNodeType)
    const functionParameters = getFunctionParametersString(functionNode, source);
    const functionBody = getFunctionBody(functionNode, source);

    return getMethodBuilder({
        functionType,
        functionParameters,
        functionBody,
        functionName
    }).buildNewMethod();

}

function buildArrowFunctionDelcarationString(functionName, functionString) {
    return getNewVariableBuilder({
        type: variableTypes.CONST,
        name: functionName,
        value: functionString
    }).buildVariableDeclaration();
}

function getNewFunctionString(functionNode, functionName, source) {
    const functionString = buildFunctionString(functionNode, functionName, source);

    if (getNodeType(functionNode) === ARROW_FUNCTION_EXPRESSION) {
        return buildArrowFunctionDelcarationString(functionName, functionString);
    }

    return functionString;
}

module.exports = {
    acceptableNodeTypes,
    getNewFunctionString,
    isAnonymousFunction
};