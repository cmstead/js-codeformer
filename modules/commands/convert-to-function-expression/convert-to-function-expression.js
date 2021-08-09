const { getNewVariableBuilder, variableTypes } = require("../../builders/VariableBuilder");
const { getMethodBuilder } = require("../../builders/MethodBuilder");
const { ARROW_FUNCTION_EXPRESSION, FUNCTION_DECLARATION, FUNCTION_EXPRESSION, FUNCTION } = require("../../constants/ast-node-types");

const {
    getFunctionBody,
    getFunctionName,
    getFunctionParametersString
} = require('../../function-utils/function-source');

const functionNodeTypes = [
    ARROW_FUNCTION_EXPRESSION,
    FUNCTION_DECLARATION,
    FUNCTION_EXPRESSION,
    FUNCTION
];

function getNewFunctionString(functionNode, sourceText) {
    const functionName = getFunctionName(functionNode);
    const functionParameters = getFunctionParametersString(functionNode, sourceText);
    const functionBody = getFunctionBody(functionNode, sourceText);

    const functionString = getMethodBuilder({
        functionParameters: functionParameters,
        functionBody: functionBody,
        functionType: FUNCTION_EXPRESSION
    })
        .buildNewMethod()

    if (functionName !== '') {
        return getNewVariableBuilder({
            name: functionName,
            type: variableTypes.CONST,
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