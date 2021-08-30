const { IDENTIFIER } = require("../../constants/ast-node-types");
const { getNodeType } = require("../../core-utils");

function getPropertyKey(propertyNode) {
    return getNodeType(propertyNode.key) === IDENTIFIER
        ? propertyNode.key.name
        : propertyNode.key;
}

function buildStandardDeclaration(propertyNode) {
    const propertyKey = getPropertyKey(propertyNode);

    return `${propertyKey}: ${propertyKey}`;
}

function getValueIdentifierName(propertyNode) {
    return propertyNode.value.name
}

function getPropertyDeclarationString(propertyNode) {
    return propertyNode.shorthand
        ? buildStandardDeclaration(propertyNode)
        : getValueIdentifierName(propertyNode);
}

function isConvertablePropertyNode(node) {
    return node.shorthand || getNodeType(node.value) === IDENTIFIER
}

module.exports = {
    getPropertyDeclarationString,
    isConvertablePropertyNode
};