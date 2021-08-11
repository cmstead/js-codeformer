const { traverse, VisitorOption } = require("estraverse");
const { reverse, getNodeType } = require('../core-utils');
const { getSourceSelection } = require("../source-utilities");

const {
    BLOCK_STATEMENT,
    PROGRAM,
    VARIABLE_DECLARATOR,
    IDENTIFIER,
    MEMBER_EXPRESSION,
    FUNCTION_DECLARATION,
    FUNCTION_EXPRESSION,
    FUNCTION,
    ARROW_FUNCTION_EXPRESSION,
    PROPERTY,
    VARIABLE_DECLARATION,
    IF_STATEMENT
} = require("../constants/ast-node-types");

function getSurroundingScope(selectionPath) {
    return reverse(selectionPath)
        .find(node =>
            node.type === BLOCK_STATEMENT
            || node.type === PROGRAM);
}

function findNodeInPath(selectionPath, nodeType) {
    return reverse(selectionPath)
        .find(node =>
            node.type === nodeType);
}

function getVariableDeclaractor(selectionPath) {
    return findNodeInPath(selectionPath, VARIABLE_DECLARATOR);
}

function getVariableDeclaration(selectionPath) {
    return findNodeInPath(selectionPath, VARIABLE_DECLARATION);
}

function getDeclarationBody(declaratorNode, sourceCode) {
    const bodyLocation = declaratorNode.init.loc;

    return getSourceSelection(sourceCode, bodyLocation);
}

function isAnArrowFunctionParameter(node, parentNode) {
    return parentNode.type === ARROW_FUNCTION_EXPRESSION
        && parentNode.params.includes(node);
}

function isAVariableDeclaration(node, parentNode) {
    const parentNodeType = getNodeType(parentNode);

    const declarationParentTypes = [
        FUNCTION,
        FUNCTION_DECLARATION,
        FUNCTION_EXPRESSION,
        VARIABLE_DECLARATOR,
    ];

    return declarationParentTypes.includes(parentNodeType)
        || isAnArrowFunctionParameter(node, parentNode);
}

function isAcceptableIdentifier(node, parentNode) {

    if (getNodeType(parentNode) === MEMBER_EXPRESSION) {
        return parentNode.object === node;
    } else {
        return !isAVariableDeclaration(node, parentNode);
    }
}

function isAMatchingIdentifier(node, variableName) {
    return node.type === IDENTIFIER
        && node.name === variableName;
}

const descentScopeTypes = [
    FUNCTION,
    FUNCTION_DECLARATION,
    FUNCTION_EXPRESSION,
    ARROW_FUNCTION_EXPRESSION,
    IF_STATEMENT
];

function isDescendableNode(node) {
    return descentScopeTypes.includes(getNodeType(node));
}

function selectReplacementLocations(searchScope, variableDeclarator, nodeValidator = isAcceptableIdentifier) {
    let declarationFound = false;
    let replacementLocations = [];

    const variableName = variableDeclarator.id.name;

    function getReplacementLocations(node) {
        const newReplacementLocations = selectReplacementLocations(node, variableDeclarator);

        replacementLocations = replacementLocations.concat(newReplacementLocations);

        return VisitorOption.Skip;
    }
    
    traverse(searchScope, {
        enter: function (node, parent) {
            const nodeIsNotRoot = node !== searchScope;
            const nodeIsNotRootDeclarator = parent !== variableDeclarator;
            const nodeIsAPropertyName = isAMatchingIdentifier(node, variableName)
                && getNodeType(parent) === PROPERTY;

            if (declarationFound || nodeIsAPropertyName) {
                return;
            } else if (
                nodeIsNotRootDeclarator
                && isAMatchingIdentifier(node, variableName)
                && isAVariableDeclaration(node, parent)) {

                declarationFound = true;

                return;
            }

            if (isDescendableNode(node) && nodeIsNotRoot) {
                return getReplacementLocations(node);
            } else if (isAMatchingIdentifier(node, variableName)
                && nodeValidator(node, parent)
            ) {
                replacementLocations.push(node.loc);
            }
        }
    });

    return replacementLocations;
}

module.exports = {
    getDeclarationBody,
    getSurroundingScope,
    getVariableDeclaractor,
    getVariableDeclaration,
    isAcceptableIdentifier,
    selectReplacementLocations
};