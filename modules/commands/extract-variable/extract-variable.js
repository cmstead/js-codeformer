
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
//     1. [x] capture selected text
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

const acceptableVariableTypes = {
    CONST: 'const',
    LET: 'let',
    VAR: 'var'
};

function locationToSourceSelection({ start, end }) {
    return {
        startLine: start.line - 1,
        endLine: end.line - 1,
        startColumn: start.column,
        endColumn: end.column
    };
}

function getSourceSelection(sourceCode, location) {
    const {
        startLine,
        endLine,
        startColumn,
        endColumn
    } = locationToSourceSelection(location);

    const selectedLines = sourceCode.split('\n').slice(startLine, endLine + 1);

    if (selectedLines.length === 1) {
        return selectedLines[0].slice(startColumn, endColumn)
    } else {
        const lastIndex = selectedLines.length - 1;

        selectedLines[0] = selectedLines[0].slice(startColumn);
        selectedLines[lastIndex] = selectedLines[lastIndex].slice(0, endColumn);

        return selectedLines.join('\n');
    }

}

function buildVariableDeclaration({ variableType, variableName, source }) {
    const sanitizedSource = source.replace(/(.*)\;+$/, '$1');
    return `${variableType} ${variableName} = ${sanitizedSource};`;
}

function selectExtractionLocation(nodePath, extractionBlock) {
    let extractionNode = null;

    for (let i = 0; i < nodePath.length; i++) {
        if (nodePath[i] === extractionBlock) {
            extractionNode = nodePath[i + 1];
            break;
        }
    }

    return extractionNode.loc;
}

module.exports = {
    acceptableNodeTypes,
    acceptableVariableTypes,
    buildExtractionScopeList,
    buildVariableDeclaration,
    selectExtractionScopes,
    selectExtractionLocation,
    getSourceSelection
};