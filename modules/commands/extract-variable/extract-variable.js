
// Stuff to do to extract a variable:

// Acceptable scopes:
// - Program
// - Function
// - FunctionExpression
// - ArrowFunctionExpression (only with FunctionBody)

// 1. [x] build extraction scope path
// 2. [x] prepare extraction scope data for user scope selection
// 3. [x] create variable declaration code
//     1. [x] capture selected text
//     2. [x] build variable source string using
//              variable type, variable name, and selected source code
//     3. [x] Semicolons?? -- I never did figure this out before.
// 4. [x] select location for variable declaration insertion
// 5. [x] select location for variable name input


const {
    buildExtractionScopeList,
    selectExtractionScopes
} = require('./extractionScopeService');

const { buildExtractionPath } = require('./ExtractionPathBuilder');

const astNodeTypes = require('../../ast-node-types');

const acceptableNodeTypes = [
    astNodeTypes.FUNCTION_DECLARATION,
    astNodeTypes.ARROW_FUNCTION_EXPRESSION,
    astNodeTypes.FUNCTION_EXPRESSION,
    astNodeTypes.FUNCTION,
    astNodeTypes.IF_STATEMENT,
    astNodeTypes.FOR_STATEMENT,
    astNodeTypes.FOR_IN_STATEMENT,
    astNodeTypes.WHILE_STATEMENT,
    astNodeTypes.DO_WHILE_STATEMENT,
    astNodeTypes.METHOD_DEFINITION,
    astNodeTypes.OBJECT_EXPRESSION
];

const acceptableVariableTypes = {
    CONST: 'const',
    LET: 'let',
    VAR: 'var'
};

const variableTypeList = Object
    .keys(acceptableVariableTypes)
    .map(key => acceptableVariableTypes[key]);

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
    getSourceSelection,
    variableTypeList
};