const { VARIABLE_DECLARATOR, FUNCTION_DECLARATION, PROPERTY, FUNCTION_EXPRESSION, METHOD_DEFINITION, BLOCK_STATEMENT, PROGRAM, CLASS_BODY, IDENTIFIER } = require('../../constants/ast-node-types');
const { getNodeType, reverse, last } = require('../../core-utils');
const { findNodeByCheckFunction } = require('../../edit-utils/node-path-utils');

const {
    getVariableDeclaractor,
    selectReplacementLocations: selectVariableLocations
} = require('../../variable-utils/variable-use-utils');

const {
    selectReplacementLocations: selectMethodLocations
} = require("./rename-method-replacement-locations");

function getSurroundingScope(selectionPath) {
    const scopeTypes = [BLOCK_STATEMENT, CLASS_BODY, PROGRAM];
    const isNodeAScope = node => scopeTypes.includes(getNodeType(node));

    return reverse(selectionPath).find(isNodeAScope);
}

const renameableNodeTypes = [IDENTIFIER, VARIABLE_DECLARATOR, FUNCTION_DECLARATION, METHOD_DEFINITION];

function isNodeAFunctionProperty(node) {
    return getNodeType(node) === PROPERTY
        && getNodeType(node.value) === FUNCTION_EXPRESSION
}
function isNodeADeclaration(node) {
    return renameableNodeTypes.includes(getNodeType(node))
}
function isRenameableNode(selectionNode, node) {
    const nodeIsADeclaration = isNodeADeclaration(node);
    const nodeIsAFunctionProperty = isNodeAFunctionProperty(node);

    return nodeIsADeclaration || nodeIsAFunctionProperty;
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
        : selectMethodLocations(searchScope, variableDeclarator)
}

module.exports = {
    findDeclaratorOrFunctionDeclaration,
    getSurroundingScope,
    getVariableDeclaractor,
    selectReplacementLocations
};