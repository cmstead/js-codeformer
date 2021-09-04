const { VARIABLE_DECLARATOR, FUNCTION_DECLARATION, PROPERTY, FUNCTION_EXPRESSION, METHOD_DEFINITION, BLOCK_STATEMENT, PROGRAM, CLASS_BODY, IDENTIFIER, ARROW_FUNCTION_EXPRESSION } = require('../../constants/ast-node-types');
const { getNodeType, reverse, last } = require('../../core-utils');
const { findNodeByCheckFunction } = require('../../edit-utils/node-path-utils');
const { nodeContainsSelection } = require('../../node-path');

const {
    selectReplacementLocations: selectVariableLocations
} = require('../../variable-utils/variable-use-utils');

const {
    selectReplacementLocations: selectBoundMethodLocations
} = require("./rename-method-replacement-locations");

function getSelectionPathSegment(selectionPath, startFrom) {
    let selectionPathSegment = [];

    for (let i = 0; i < selectionPath.length; i++) {
        const node = selectionPath[i];

        selectionPathSegment.push(node);

        if (node === startFrom) {
            break;
        }
    }

    return selectionPathSegment;
}

function getSurroundingScope(selectionPath, startFrom = selectionPath[selectionPath.length - 1]) {
    const scopeTypes = [BLOCK_STATEMENT, CLASS_BODY, PROGRAM];
    const isNodeAScope = node => scopeTypes.includes(getNodeType(node));

    const selectionPathSegment = getSelectionPathSegment(selectionPath, startFrom)

    return reverse(selectionPathSegment).find(isNodeAScope);
}

const renameableNodeTypes = [VARIABLE_DECLARATOR, FUNCTION_DECLARATION, METHOD_DEFINITION];
const functionNodeTypes = [
    FUNCTION_DECLARATION,
    FUNCTION_EXPRESSION,
    ARROW_FUNCTION_EXPRESSION
];

function isNodeAFunctionProperty(node) {
    return getNodeType(node) === PROPERTY
        && getNodeType(node.value) === FUNCTION_EXPRESSION
}

function isNodeADeclaration(node) {
    return renameableNodeTypes.includes(getNodeType(node))
}

function isSelectionInParameters(node, location) {
    let selectionFound = false;

    node.params.forEach(function (parameter) {
        selectionFound = selectionFound || nodeContainsSelection(parameter, location);
    });

    return selectionFound;
}

function isRenameableNode(selectionNode, node) {
    const nodeIsADeclaration = isNodeADeclaration(node);
    const nodeIsAFunctionProperty = isNodeAFunctionProperty(node);

    const nodeType = getNodeType(node);
    const selectionNotInParameters = !functionNodeTypes.includes(nodeType)
        || node.params.length === 0
        || !isSelectionInParameters(node, selectionNode.loc);

    return selectionNotInParameters && (nodeIsADeclaration || nodeIsAFunctionProperty);
}

function findDeclaratorOrFunctionDeclaration(selectionPath) {
    const selectionNode = last(selectionPath);

    return findNodeByCheckFunction(
        selectionPath,
        (node) => isRenameableNode(selectionNode, node));
}

function isNodeAVariableOrFunctionDeclaration(nodeType) {
    return nodeType !== METHOD_DEFINITION && nodeType !== PROPERTY
}

function selectReplacementLocations(searchScope, variableDeclarator) {
    const declaratorNodeType = getNodeType(variableDeclarator);

    return isNodeAVariableOrFunctionDeclaration(declaratorNodeType)
        ? selectVariableLocations(searchScope, variableDeclarator)
        : selectBoundMethodLocations(searchScope, variableDeclarator)
}

function getVariableDeclaratorLocation(variableDeclarator) {
    if (typeof variableDeclarator.id === 'object') {
        return variableDeclarator.id.loc;
    } else if (typeof variableDeclarator.key === 'object') {
        return variableDeclarator.key.loc;
    } else if (typeof variableDeclarator.callee === 'object') {
        return variableDeclarator.callee.loc;
    } else if (getNodeType(variableDeclarator) === IDENTIFIER) {
        return variableDeclarator.loc;
    }

    throw new Error(`Variable delaration type unknown: ${getNodeType(variableDeclarator)}`)
}

module.exports = {
    findDeclaratorOrFunctionDeclaration,
    getSurroundingScope,
    getVariableDeclaratorLocation,
    selectReplacementLocations
};