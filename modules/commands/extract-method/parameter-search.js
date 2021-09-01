const astTraverse = require('../../astTraverse');

const { nodeContainsSelection } = require('../../node-path');
const { getNodeType } = require('../../core-utils');

const astNodeTypes = require('../../constants/ast-node-types');
const {
    IDENTIFIER,
    MEMBER_EXPRESSION
} = astNodeTypes;

const scopeTypes = [
    astNodeTypes.ARROW_FUNCTION_EXPRESSION,
    astNodeTypes.FUNCTION_DECLARATION,
    astNodeTypes.FUNCTION_EXPRESSION,
    astNodeTypes.BLOCK_STATEMENT
];

const declarationTypes = [
    astNodeTypes.ARROW_FUNCTION_EXPRESSION,
    astNodeTypes.FUNCTION_DECLARATION,
    astNodeTypes.FUNCTION_EXPRESSION,
    astNodeTypes.VARIABLE_DECLARATOR
];

function isVariableBeingDeclared(parentNode, node) {
    const parentNodeType = getNodeType(parentNode);

    return getNodeType(node) === IDENTIFIER &&
        (
            declarationTypes.includes(parentNodeType)
            || (parentNodeType === MEMBER_EXPRESSION
                && parentNode.object === node)
        )
}

function isVariableBeingUsed(parentNode, node) {
    const parentNodeType = getNodeType(parentNode);
    const nodeType = getNodeType(node);

    const parentIsNotAMemberExpression = parentNodeType !== MEMBER_EXPRESSION;
    const nodeIsAnIdentifier = nodeType === IDENTIFIER;

    return nodeIsAnIdentifier && parentIsNotAMemberExpression;
}

function isNodeAScope(node) {
    const nodeType = getNodeType(node);

    return scopeTypes.includes(nodeType);
}

function insertUsedVariables(parameterNames, variableNamesObject) {
    parameterNames
        .forEach(parameterName =>
            variableNamesObject[parameterName] = true);
}

function diffVariableSets(declaredVariables, variablesInUse) {
    return Object.keys(variablesInUse)
        .filter(function (variableName) {
            return !declaredVariables[variableName];
        })
}

function getLocallyScopedDeclarations(extractionPath, extractionLocation) {
    const selectionScopes = extractionPath
        .map(nodes => nodes[0])
        .filter((node) =>
            nodeContainsSelection(node, extractionLocation.loc));

    const declaredVariables = {};

    selectionScopes.forEach(function (scope) {
        astTraverse.traverse(scope, {
            enter: function (node, parentNode) {
                if (node === scope) {
                    return;
                }

                const varibleIsBeingDeclared = isVariableBeingDeclared(parentNode, node);
                const nodeIsAScope = isNodeAScope(node);

                if (nodeIsAScope) {
                    return astTraverse.VisitorOption.Skip;
                } if (varibleIsBeingDeclared) {
                    declaredVariables[node.name] = true;
                }
            }
        });
    });

    return Object.keys(declaredVariables);
}

function getSubordinateScopeParameters(parsedSelectionSource) {
    const declaredVariables = {};
    const variablesInUse = {};

    astTraverse.traverse(parsedSelectionSource, {
        enter: function (node, parentNode) {
            if (node === parsedSelectionSource) {
                return;
            }

            const varibleIsBeingDeclared = isVariableBeingDeclared(parentNode, node);
            const variableIsBeingUsed = isVariableBeingUsed(parentNode, node);
            const nodeIsAScope = isNodeAScope(node);

            if (nodeIsAScope) {
                const locatedParameters = getSubordinateScopeParameters(node);

                insertUsedVariables(locatedParameters, variablesInUse);

                return astTraverse.VisitorOption.Skip;
            } if (varibleIsBeingDeclared) {
                declaredVariables[node.name] = true;
            } else if (variableIsBeingUsed) {
                variablesInUse[node.name] = true;
            }
        }
    });

    return diffVariableSets(declaredVariables, variablesInUse);
}

function findAppropriateParameters(
    parsedSelectionSource,
    extractionPath,
    extractionLocation
) {
    const collectedParameters = getSubordinateScopeParameters(parsedSelectionSource);
    const ancestorDeclarations = getLocallyScopedDeclarations(extractionPath, extractionLocation);

    return collectedParameters.filter(key => !ancestorDeclarations.includes(key));
}

module.exports = {
    diffVariableSets,
    findAppropriateParameters,
    getLocallyScopedDeclarations,
    getSubordinateScopeParameters
};