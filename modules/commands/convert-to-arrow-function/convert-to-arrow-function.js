const { ARROW_FUNCTION_EXPRESSION, FUNCTION_DECLARATION, FUNCTION_EXPRESSION, METHOD_DEFINITION } = require("../../constants/ast-node-types");
const { getNewFunctionExpressionString } = require("../../function-expression-string-service");

const functionNodeTypes = [
    ARROW_FUNCTION_EXPRESSION,
    FUNCTION_DECLARATION,
    FUNCTION_EXPRESSION,
    METHOD_DEFINITION
];

function getNewFunctionString(functionNode, sourceText) {
    return getNewFunctionExpressionString({
        functionNode,
        sourceText,
        functionType: ARROW_FUNCTION_EXPRESSION
    });
}

module.exports = {
    functionNodeTypes,
    getNewFunctionString
};