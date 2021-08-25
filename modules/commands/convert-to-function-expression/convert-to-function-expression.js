const { getNewVariableBuilder, variableTypes } = require("../../builders/VariableBuilder");
const { getMethodBuilder } = require("../../builders/MethodBuilder");
const { ARROW_FUNCTION_EXPRESSION, FUNCTION_DECLARATION, FUNCTION_EXPRESSION, FUNCTION, BLOCK_STATEMENT, METHOD_DEFINITION } = require("../../constants/ast-node-types");

const {
    getFunctionBody,
    getFunctionName,
    getFunctionParametersString
} = require('../../function-utils/function-source');
const { getNodeType } = require("../../core-utils");

const functionNodeTypes = [
    ARROW_FUNCTION_EXPRESSION,
    FUNCTION_DECLARATION,
    FUNCTION_EXPRESSION,
    METHOD_DEFINITION
];

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

function getNewFunctionString(functionNode, sourceText) {
    const functionName = getFunctionName(functionNode);
    const functionParameters = getFunctionParametersString(functionNode, sourceText);
    const functionBody = buildFunctionBody(functionNode, sourceText);

    const functionString = getMethodBuilder({
        functionParameters: functionParameters,
        functionBody: functionBody,
        functionType: FUNCTION_EXPRESSION,
        async: functionNode.async
    })
        .buildNewMethod()

    if (functionName !== '') {
        const variableType = getNodeType(functionNode) === METHOD_DEFINITION
            ? variableTypes.PROPERTY
            : variableTypes.CONST;

        return getNewVariableBuilder({
            name: functionName,
            type: variableType,
            value: functionString
        })
            .buildVariableDeclaration()
    } else {
        return functionString;
    }
}

module.exports = {
    functionNodeTypes,
    getNewFunctionString
};