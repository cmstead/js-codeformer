const { JSX_ELEMENT } = require("./constants/ast-node-types");
const { getNodeType } = require("./core-utils");

function isJsxElement(node) {
    return getNodeType(node) === JSX_ELEMENT;
}

function wrapJsxExpression(targetNode, sourceText) {
    return isJsxElement(targetNode) ? `{${sourceText}}` : sourceText;
}

function wrapJsxElement(selectedNode, sourceText) {
    return isJsxElement(selectedNode) ? `return (${sourceText})` : sourceText;
}

module.exports = {
    isJsxElement,
    wrapJsxElement,
    wrapJsxExpression
};