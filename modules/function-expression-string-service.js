const { getMethodBuilder } = require("./builders/MethodBuilder");
const { variableTypes, getNewVariableBuilder } = require("./builders/VariableBuilder");
const { METHOD_DEFINITION, FUNCTION_DECLARATION } = require("./constants/ast-node-types");
const { getNodeType } = require("./core-utils");
const { getFunctionName, getFunctionParametersString, getFunctionBody } = require("./function-utils/function-source");

function getNewFunctionExpressionString({
    functionNode,
    sourceText,
    functionType,
    buildFunctionBody = getFunctionBody
}) {
    const nodeType = getNodeType(functionNode);

    const functionName = getFunctionName(functionNode);
    const functionParameters = getFunctionParametersString(functionNode, sourceText);
    const functionBody = buildFunctionBody(functionNode, sourceText);

    const functionString = getMethodBuilder({
        functionParameters: functionParameters,
        functionBody: functionBody,
        functionType: functionType,
        async: functionNode.async,
        generator: functionNode.generator
    })
        .buildNewMethod()

    if (nodeType === METHOD_DEFINITION || nodeType === FUNCTION_DECLARATION) {
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
    getNewFunctionExpressionString
};