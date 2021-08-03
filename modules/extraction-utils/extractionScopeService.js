const astNodeTypes = require('../constants/ast-node-types');
const { last } = require('../core-utils');

const typeTransforms = {
    [astNodeTypes.ARROW_FUNCTION_EXPRESSION]: () => 'arrow function',
    [astNodeTypes.CLASS_BODY]: () => 'class body',
    [astNodeTypes.FUNCTION_DECLARATION]: (node) => `the function named '${node.id.name}'`,
    [astNodeTypes.FUNCTION_EXPRESSION]: () => 'function expression',
    [astNodeTypes.FUNCTION]: () => 'function',
    [astNodeTypes.IF_STATEMENT]: () => 'if statement',
    [astNodeTypes.FOR_STATEMENT]: () => 'for statement',
    [astNodeTypes.FOR_IN_STATEMENT]: () => 'for in statement',
    [astNodeTypes.WHILE_STATEMENT]: () => 'while statement',
    [astNodeTypes.DO_WHILE_STATEMENT]: () => 'do while statement',
    [astNodeTypes.METHOD_DEFINITION]: (node) => `the method named '${node.key.name}'`,
    [astNodeTypes.OBJECT_EXPRESSION]: () => 'object literal',
}


function getScopeMessage(displayNode, index) {
    try {
        if (displayNode.type === astNodeTypes.PROGRAM) {
            return 'Extract to top of file';
        } else if (index === 0) {
            return `Extract to local scope in ${typeTransforms[displayNode.type](displayNode)}`;
        } else {
            return `Extract to scope in ${typeTransforms[displayNode.type](displayNode)}`
        }
    } catch (_) {
        throw new Error(`JS CodeFormer error: Cannot process node type "${displayNode.type}"`);
    }
}

function buildExtractionScopeList(extractionPath) {
    return extractionPath
        .map((nodeSet, index) => {
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
        extractionScope: extractionPath[selectionIndex]
    };
}

module.exports = {
    selectExtractionScopes,
    buildExtractionScopeList
};