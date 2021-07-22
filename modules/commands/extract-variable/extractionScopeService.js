const astNodeTypes = require('../../ast-node-types');

const typeTransforms = {
    [astNodeTypes.ARROW_FUNCTION_EXPRESSION]: () => 'arrow function',
    [astNodeTypes.FUNCTION_DECLARATION]: (node) => `the function named '${node.id.name}'`,
    [astNodeTypes.FUNCTION_EXPRESSION]: () => 'function expression',
    [astNodeTypes.IF_STATEMENT]: () => 'if statement',
    [astNodeTypes.METHOD_DEFINITION]: (node) => `the method named '${node.key.name}'`,
    [astNodeTypes.OBJECT_EXPRESSION]: () => 'object literal'
}


const last = values => values[values.length - 1];

function getScopeMessage(displayNode, index) {
    if (index === 0) {
        return `Extract to local scope in ${typeTransforms[displayNode.type](displayNode)}`;
    } else if (displayNode.type === astNodeTypes.PROGRAM) {
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
    selectExtractionScopes,
    buildExtractionScopeList
};