const { VARIABLE_DECLARATOR, FUNCTION_DECLARATION, PROPERTY, METHOD_DEFINITION, BLOCK_STATEMENT, PROGRAM, CLASS_BODY, IDENTIFIER, ASSIGNMENT_PATTERN, ARRAY_PATTERN } = require('../../constants/ast-node-types');
const { getNodeType, reverse, last } = require('../../core-utils');

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

function getSurroundingScope(selectionPath) {
    const scopeTypes = [BLOCK_STATEMENT, CLASS_BODY, PROGRAM];
    const isNodeAScope = node => scopeTypes.includes(getNodeType(node));

    return reverse(selectionPath).find(isNodeAScope);
}

const renameableNodeTypes = [
    VARIABLE_DECLARATOR,
    FUNCTION_DECLARATION,
    METHOD_DEFINITION
];

function isRenameable(node, parent) {
    const parentNodeType = getNodeType(parent);

    const nodeIsDestructuredObjectProperty = parentNodeType === IDENTIFIER;
    const nodeIsADestructuredArrayValue = parentNodeType === ARRAY_PATTERN;
    const nodeIsAnAssignmentPatternDeclaration = parentNodeType === ASSIGNMENT_PATTERN
        && parent.left === node;
    const nodeIsAPropertyKey = parentNodeType === PROPERTY;

    return renameableNodeTypes.includes(parentNodeType)
        || nodeIsAnAssignmentPatternDeclaration
        || nodeIsDestructuredObjectProperty
        || nodeIsADestructuredArrayValue
        || nodeIsAPropertyKey;

}

function findDeclaratorOrFunctionDeclaration(selectionPath) {
    const selectionNode = last(selectionPath);
    const selectionParent = selectionPath[selectionPath.length - 2];

    const nodeType = getNodeType(selectionNode);

    if (nodeType === IDENTIFIER && isRenameable(selectionNode, selectionParent)) {
        return selectionParent;
    }

    return null;
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