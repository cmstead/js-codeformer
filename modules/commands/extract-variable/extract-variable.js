
// Stuff to do to extract a variable:

// Acceptable scopes:
// - Program
// - Function
// - FunctionExpression
// - ArrowFunctionExpression (only with FunctionBody)

// 1. get the scope for extraction (window.showQuickPick)
// 2. get the variable name (window.showInputBox)
// 3. create variable declaration code
// 4. create variable name replacement
// 5. select location for variable declaration insertion
// 6. create array of edits: [value replacement + location, variable declaration + location]

const {
    ARROW_FUNCTION_EXPRESSION,
    FUNCTION_DECLARATION,
    FUNCTION_EXPRESSION,
    IF_STATEMENT,
    METHOD_DEFINITION,
} = require('../../ast-node-types');

const { buildExtractionPath } = require('./ExtractionPathBuilder');

const acceptableNodeTypes = [
    ARROW_FUNCTION_EXPRESSION,
    FUNCTION_DECLARATION,
    FUNCTION_EXPRESSION,
    IF_STATEMENT,
    METHOD_DEFINITION
]

module.exports = {
    acceptableNodeTypes
};