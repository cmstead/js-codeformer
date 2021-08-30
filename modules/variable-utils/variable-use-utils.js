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
const { findNodeInPath } = require("../edit-utils/node-path-utils");

function getSurroundingScope(selectionPath) {
    return reverse(selectionPath)
        .find(node =>
            node.type === BLOCK_STATEMENT
            || node.type === PROGRAM);
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

function isDeclaredVariableInDeclaration(node, parentNode) {
    return getNodeType(parentNode) === VARIABLE_DECLARATOR
        && parentNode.id === node;
}

function isAVariableDeclaration(node, parentNode) {
    const parentNodeType = getNodeType(parentNode);

    const functionDeclarationParentTypes = [
        FUNCTION,
        FUNCTION_DECLARATION,
        FUNCTION_EXPRESSION
    ];

    return functionDeclarationParentTypes.includes(parentNodeType)
        || isDeclaredVariableInDeclaration(node, parentNode)
        || isAnArrowFunctionParameter(node, parentNode);
}

function isMemberExpression(parentNode) {
    return getNodeType(parentNode) === MEMBER_EXPRESSION;
}

function isAcceptableIdentifier(node, parentNode) {

    if (isMemberExpression(parentNode)) {
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

function shallowCloneNodeLocation(astLocation) {
    return {
        start: astLocation.start,
        end: astLocation.end
    }
}

function selectReplacementLocations(searchScope, variableDeclarator) {
    let declarationFound = false;
    let replacementLocations = [];

    const variableName = getNodeType(variableDeclarator) === IDENTIFIER
        ? variableDeclarator.name
        : variableDeclarator.id.name;

    function getReplacementLocations(node) {
        const newReplacementLocations = selectReplacementLocations(node, variableDeclarator);

        replacementLocations = replacementLocations.concat(newReplacementLocations);

        return VisitorOption.Skip;
    }

    traverse(searchScope, {
        enter: function (node, parent) {
            const nodeIsNotRoot = node !== searchScope;
            const nodeIsNotRootIdentifier = parent !== variableDeclarator;
            const nodeIsNotRootDeclarator = node !== variableDeclarator;
            const nodeIsAPropertyName = isAMatchingIdentifier(node, variableName)
                && getNodeType(parent) === PROPERTY
                && parent.value !== node;

            if (declarationFound || nodeIsAPropertyName) {
                return;
            } else if (
                nodeIsNotRootIdentifier
                && nodeIsNotRootDeclarator
                && isAMatchingIdentifier(node, variableName)
                && isAVariableDeclaration(node, parent)) {

                declarationFound = true;

                return;
            }

            if (isDescendableNode(node) && nodeIsNotRoot) {
                return getReplacementLocations(node);
            } else if (isAMatchingIdentifier(node, variableName)
                && isAcceptableIdentifier(node, parent)
            ) {
                let nodeLocation = shallowCloneNodeLocation(node.loc);

                if (getNodeType(parent) === PROPERTY && parent.shorthand === true) {
                    nodeLocation.shorthand = true;
                }

                replacementLocations.push(nodeLocation);
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
    isAcceptableVariableIdentifier: isAcceptableIdentifier,
    isMemberExpression,
    selectReplacementLocations
};