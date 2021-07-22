
// Stuff to do to extract a variable:

// Acceptable scopes:
// - Program
// - Function
// - FunctionExpression
// - ArrowFunctionExpression (only with FunctionBody)

// 1. [x] get the scope for extraction (window.showQuickPick)
// 2. [ ] get the variable name (window.showInputBox)
// 3. [ ] create variable declaration code
// 4. [ ] create variable name replacement
// 5. [ ] select location for variable declaration insertion
// 6. [ ] create array of edits: [value replacement + location, variable declaration + location]


const {
    buildExtractionScopeList,
    selectExtractionScopes
} = require('./extractionScopeService');

const { buildExtractionPath } = require('./ExtractionPathBuilder');

const astNodeTypes = require('../../ast-node-types');

const acceptableNodeTypes = [
    astNodeTypes.ARROW_FUNCTION_EXPRESSION,
    astNodeTypes.FUNCTION_DECLARATION,
    astNodeTypes.FUNCTION_EXPRESSION,
    astNodeTypes.IF_STATEMENT,
    astNodeTypes.METHOD_DEFINITION
];

module.exports = {
    acceptableNodeTypes,
    buildExtractionScopeList,
    selectExtractionScopes
};