const { VARIABLE_DECLARATOR, FUNCTION_DECLARATION, PROPERTY, FUNCTION_EXPRESSION, METHOD_DEFINITION, BLOCK_STATEMENT, PROGRAM, CLASS_BODY } = require('../../constants/ast-node-types');
const { getNodeType, reverse } = require('../../core-utils');
const { findNodeByCheckFunction } = require('../../edit-utils/node-path-utils');
const {
    getVariableDeclaractor,
    selectReplacementLocations: selectVariableLocations
} = require('../../variable-utils/variable-use-utils');

const { selectReplacementLocations: selectMethodLocations } = require("./rename-method-replacement-locations");

function getSurroundingScope(selectionPath) {
    const scopeTypes = [BLOCK_STATEMENT, CLASS_BODY, PROGRAM];
    return reverse(selectionPath)
        .find(node => scopeTypes.includes(getNodeType(node)));
}

const renameableNodeTypes = [VARIABLE_DECLARATOR, FUNCTION_DECLARATION, METHOD_DEFINITION];

function isNodeAFunctionProperty(node) {
    return getNodeType(node) === PROPERTY
        && getNodeType(node.value) === FUNCTION_EXPRESSION
}
function isNodeADeclaration(node) {
    return renameableNodeTypes.includes(getNodeType(node))
}
function isRenameableNode(node) {
    const nodeIsADeclaration = isNodeADeclaration(node);
    const nodeIsAFunctionProperty = isNodeAFunctionProperty(node);

    return nodeIsADeclaration || nodeIsAFunctionProperty;
}

function findDeclaratorOrFunctionDeclaration(selectionPath) {
    return findNodeByCheckFunction(selectionPath, isRenameableNode);
}

function selectReplacementLocations(searchScope, variableDeclarator) {
    const nodeType = getNodeType(variableDeclarator);

    if (nodeType !== METHOD_DEFINITION && nodeType !== PROPERTY) {
        return selectVariableLocations(searchScope, variableDeclarator);
    } else {
        const selectedLocations = selectMethodLocations(searchScope, variableDeclarator);

        return selectedLocations;
    }
}

module.exports = {
    findDeclaratorOrFunctionDeclaration,
    getSurroundingScope,
    getVariableDeclaractor,
    selectReplacementLocations
};