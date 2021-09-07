const { getNewIfBuilder } = require("../../builders/IfBuilder");
const { RETURN_STATEMENT, VARIABLE_DECLARATION, PROGRAM, BLOCK_STATEMENT, EXPRESSION_STATEMENT, CONDITIONAL_EXPRESSION } = require("../../constants/ast-node-types");
const { getNodeType, first } = require("../../core-utils");
const { getSourceSelection } = require("../../source-utilities");

function addReturnPrefix(_, expressionString) {
    return `return ${expressionString}`;
}

function getDeclarator(declarationNode) {
    return declarationNode.declarations[0];
}

function getDeclaratorName(declarationNode) {
    return getDeclarator(declarationNode).id.name
}

function addVariableDeclarationPrefix(declarationNode, expressionString) {
    const declaratorName = getDeclaratorName(declarationNode);

    return `${declaratorName} = ${expressionString}`;
}

function expressionIdentity(_, expressionString) {
    return expressionString;
}
const linePrefixAdderMap = {
    [RETURN_STATEMENT]: addReturnPrefix,
    [VARIABLE_DECLARATION]: addVariableDeclarationPrefix,
    [CONDITIONAL_EXPRESSION]: expressionIdentity
}

function getDeclarationSetup(declarationNode) {
    const variableKind = declarationNode.kind === 'var' ? 'var' : 'let';
    const declaratorName = getDeclaratorName(declarationNode);

    return `${variableKind} ${declaratorName};`
}

function buildNewIfStatement(source, parentNode, ternaryExpression) {
    const test = getSourceSelection(source, ternaryExpression.test.loc);
    const consequent = getSourceSelection(source, ternaryExpression.consequent.loc);
    const alternate = getSourceSelection(source, ternaryExpression.alternate.loc);
    const parentNodeType = getNodeType(parentNode);

    const addLinePrefix = linePrefixAdderMap[parentNodeType];

    const newIfStatement = getNewIfBuilder({
        test,
        consequent: addLinePrefix(parentNode, consequent) + ';',
        alternate: addLinePrefix(parentNode, alternate) + ';'
    }).buildIf();

    return getNodeType(parentNode) === VARIABLE_DECLARATION
        ? `${getDeclarationSetup(parentNode)}\n\n${newIfStatement}`
        : newIfStatement;
}

function isReturnArgument(returnStatement, ternaryExpression) {
    return returnStatement.argument === ternaryExpression
}

function isVariableDeclaration(declarationNode, ternaryExpression) {
    return getDeclarator(declarationNode).init === ternaryExpression;
}

function isProgramScoped(surroundingNode, ternaryExpression) {
    return surroundingNode.body.find(node =>
        getNodeType(node) === EXPRESSION_STATEMENT
        && node.expression === ternaryExpression);
}
const parentNodeValidatorMap = {
    [RETURN_STATEMENT]: isReturnArgument,
    [VARIABLE_DECLARATION]: isVariableDeclaration,
    [PROGRAM]: isProgramScoped,
    [BLOCK_STATEMENT]: isProgramScoped,
}

function testParentNode(node, ternaryExpression) {
    const verifyParentNode = parentNodeValidatorMap[getNodeType(node)];
    return node !== null
        && typeof verifyParentNode !== 'undefined'
        && verifyParentNode(node, ternaryExpression);
}

function pickParentNode(potentialNodes, ternaryExpression) {
    const acceptableParentNodes = potentialNodes.filter(node => testParentNode(node, ternaryExpression));
    const parentNode = first(acceptableParentNodes);

    return typeof parentNode === undefined ? null : parentNode;
}

module.exports = {
    buildNewIfStatement,
    pickParentNode,
    isReturnArgument,
    isAssignmentValue: isVariableDeclaration
};