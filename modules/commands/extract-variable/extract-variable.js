
// Stuff to do to extract a variable:

// Acceptable scopes:
// - Program
// - Function
// - FunctionExpression
// - ArrowFunctionExpression (only with FunctionBody)

// 1. [ ] get the scope for extraction (window.showQuickPick)
// 2. [ ] get the variable name (window.showInputBox)
// 3. [ ] get variable type (const, let, var -- in that order -- window.showQuickPick)

// 1. [x] build extraction scope path
// 2. [x] prepare extraction scope data for user scope selection
// 3. [ ] create variable declaration code
//     1. [ ] capture selected text
//     2. [ ] build variable source string using
//              variable type, variable name, and selected source code
//     3. [ ] Semicolons?? -- I never did figure this out before.
// 4. [ ] select location for variable declaration insertion
// 5. [ ] select location for variable name input
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