const { FUNCTION_DECLARATION, VARIABLE_DECLARATION } = require("../../constants/ast-node-types");
const { getNodeType, last } = require("../../core-utils");
const { findNodeInPath } = require("../../edit-utils/node-path-utils");

function isSingleDeclaration(declarationNode) {
    return declarationNode.declarations.length === 1;
}

function findFunctionDeclarator(functionNode, declarationNode) {
    return declarationNode.declarations
        .find(declarator => declarator.init === functionNode);
}

function findFunctionVariableDeclaration(functionNode, selectionPath) {
    const declarationNode = findNodeInPath(selectionPath, VARIABLE_DECLARATION);
    const declaratorNode = declarationNode === null ? null : findFunctionDeclarator(functionNode, declarationNode)

    if (declaratorNode === null) {
        return null
    } else if (isSingleDeclaration(declarationNode)) {
        return declarationNode;
    } else {
        return declaratorNode;
    }
}

function isNodeAFunctionDeclaration(functionNode) {
    return getNodeType(functionNode) === FUNCTION_DECLARATION;
}

function getFunctionDeclaration(functionNode, selectionPath) {
    if (functionNode === null) {
        return null;
    } else if (isNodeAFunctionDeclaration(functionNode)) {
        return functionNode;
    } else {
        return findFunctionVariableDeclaration(functionNode, selectionPath);
    }
}

function getFunctionName(functionDeclaration) {
    if (getNodeType(functionDeclaration) === FUNCTION_DECLARATION) {
        return functionDeclaration.id.name;
    } else if (getNodeType(functionDeclaration) === VARIABLE_DECLARATION) {
        return functionDeclaration.declarations[0].id.name;
    } else {
        return functionDeclaration.id.name;
    }
}

function getFunctionNode(functionDeclaration) {
    if (getNodeType(functionDeclaration) === FUNCTION_DECLARATION) {
        return functionDeclaration;
    } else if (getNodeType(functionDeclaration) === VARIABLE_DECLARATION) {
        return functionDeclaration.declarations[0].init;
    } else {
        return functionDeclaration.init;
    }
}

function getMethodWriteLocation({ body: classBody }) {
    if(classBody.body.length > 0) {
        const lastBodyNode = last(classBody.body);
    
        return {
            start: lastBodyNode.loc.end,
            end: lastBodyNode.loc.end
        }
    } else {
        return {
            start: { line: classBody.loc.end.line, column: classBody.loc.end.column - 1},
            end: { line: classBody.loc.end.line, column: classBody.loc.end.column - 1}
        }
    }
}

module.exports = {
    getFunctionDeclaration,
    getFunctionName,
    getFunctionNode,
    getMethodWriteLocation
};