
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
    OBJECT_EXPRESSION,
    PROGRAM
} = require('../../ast-node-types');

const typeTransforms = {
    [ARROW_FUNCTION_EXPRESSION]: () => 'arrow function',
    [FUNCTION_DECLARATION]: (node) => `the function named '${node.id.name}'`,
    [FUNCTION_EXPRESSION]: () => 'function expression',
    [IF_STATEMENT]: () => 'if statement',
    [METHOD_DEFINITION]: (node) => `the method named '${node.key.name}'`,
    [OBJECT_EXPRESSION]: () => 'object literal'
}

const { buildExtractionPath } = require('./ExtractionPathBuilder');

const acceptableNodeTypes = [
    ARROW_FUNCTION_EXPRESSION,
    FUNCTION_DECLARATION,
    FUNCTION_EXPRESSION,
    IF_STATEMENT,
    METHOD_DEFINITION
]

const last = values => values[values.length - 1];

function getScopeMessage(displayNode, index) {
    if (index === 0) {
        return `Extract to local scope in ${typeTransforms[displayNode.type](displayNode)}`;
    } else if (displayNode.type === PROGRAM) {
        return 'Extract to top of file';
    } else {
        return `Extract to scope in ${typeTransforms[displayNode.type](displayNode)}`
    }
}

function buildExtractionScopeList(extractionPath) {
    return extractionPath.map((nodeSet, index) => {
        const displayNode = last(nodeSet);

        return `${index + 1} - ${getScopeMessage(displayNode, index)}`;
    });
}

function getUserSelectionIndex(userSelection) {
    const userSelectionPosition = userSelection.split(/\s+[-]\s+/ig)[0];

    return parseInt(userSelectionPosition) - 1;
}

function selectExtractionScopes(extractionPath, userSelection) {
    const selectionIndex = getUserSelectionIndex(userSelection);

    return {
        extractionScope: extractionPath[selectionIndex],
        subordinateScope: selectionIndex > 0 
            ? extractionPath[selectionIndex - 1]
            : null
    };
}

module.exports = {
    acceptableNodeTypes,
    buildExtractionScopeList,
    selectExtractionScopes
};