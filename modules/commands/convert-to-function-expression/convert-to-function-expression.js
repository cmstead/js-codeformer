const { ARROW_FUNCTION_EXPRESSION, FUNCTION_DECLARATION, FUNCTION_EXPRESSION, BLOCK_STATEMENT, METHOD_DEFINITION } = require("../../constants/ast-node-types");
const { getFunctionBody } = require('../../function-utils/function-source');
const { getNodeType } = require("../../core-utils");
const { getNewFunctionExpressionString } = require("../../function-expression-string-service");

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
    return getNewFunctionExpressionString({
        functionNode,
        sourceText,
        functionType: FUNCTION_EXPRESSION,
        buildFunctionBody
    });
}

module.exports = {
    functionNodeTypes,
    getNewFunctionString
};