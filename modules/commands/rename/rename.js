const { VARIABLE_DECLARATOR, FUNCTION_DECLARATION, PROPERTY, METHOD_DEFINITION, BLOCK_STATEMENT, PROGRAM, CLASS_BODY, IDENTIFIER, ASSIGNMENT_PATTERN, ARRAY_PATTERN, FUNCTION_EXPRESSION, ARROW_FUNCTION_EXPRESSION } = require('../../constants/ast-node-types');
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

function getSurroundingScope(selectionPath, startFrom = selectionPath[selectionPath.length - 1]) {
    const scopeTypes = [BLOCK_STATEMENT, CLASS_BODY, PROGRAM];
    const isNodeAScope = node => scopeTypes.includes(getNodeType(node));

    const selectionPathSegment = getSelectionPathSegment(selectionPath, startFrom)

    return reverse(selectionPathSegment).find(isNodeAScope);
}

const renameableNodeTypes = [
    VARIABLE_DECLARATOR,
    FUNCTION_DECLARATION,
    METHOD_DEFINITION
];

const functionNodes = [
    FUNCTION_EXPRESSION,
    FUNCTION_DECLARATION,
    ARROW_FUNCTION_EXPRESSION
];

function isRenameable(node, parent) {
    const parentNodeType = getNodeType(parent);

    const nodeIsDestructuredObjectProperty = parentNodeType === IDENTIFIER;
    const nodeIsADestructuredArrayValue = parentNodeType === ARRAY_PATTERN;
    const nodeIsAnAssignmentPatternDeclaration = parentNodeType === ASSIGNMENT_PATTERN
        && parent.left === node;
    const nodeIsAPropertyKey = parentNodeType === PROPERTY;
    const nodeIsAnArrowFunctionParam = parentNodeType === ARROW_FUNCTION_EXPRESSION;

    return getNodeType(node) === IDENTIFIER
        && (
            renameableNodeTypes.includes(parentNodeType)
            || nodeIsAnAssignmentPatternDeclaration
            || nodeIsDestructuredObjectProperty
            || nodeIsADestructuredArrayValue
            || nodeIsAPropertyKey
            || nodeIsAnArrowFunctionParam
        );

}

function isParameterNode(node, parentNodeType) {
    return functionNodes.includes(parentNodeType) && parentNodeType.id !== node
}

function pickDeclaratorNode(parent, node) {
    const parentNodeType = getNodeType(parent);

    if (parentNodeType === ARRAY_PATTERN
        || isParameterNode(node, parentNodeType)) {
        return node;
    } else {
        return parent;
    }
}

function findSymbolToRename(selectionPath) {
    const selectionNode = last(selectionPath);
    const selectionParent = selectionPath[selectionPath.length - 2];

    if (isRenameable(selectionNode, selectionParent)) {
        return pickDeclaratorNode(selectionParent, selectionNode);
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
    } else if (getNodeType(variableDeclarator) === ASSIGNMENT_PATTERN) {
        return variableDeclarator.left.loc;
    }

    throw new Error(`Variable delaration type unknown: ${getNodeType(variableDeclarator)}`)
}

module.exports = {
    findSymbolToRename,
    getSurroundingScope,
    getVariableDeclaratorLocation,
    selectReplacementLocations
};