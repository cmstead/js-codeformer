const { VisitorOption } = require("estraverse");
const { traverse } = require("../../astTraverse");
const { MEMBER_EXPRESSION, THIS_EXPRESSION, IDENTIFIER, METHOD_DEFINITION, FUNCTION_DECLARATION, FUNCTION_EXPRESSION } = require("../../constants/ast-node-types");
const { getNodeType } = require("../../core-utils");

function getVariableName(variableDeclarator) {
    return typeof variableDeclarator.key === 'string'
        ? variableDeclarator.key
        : variableDeclarator.key.name;
}

function doNotDescend(node, parent) {
    const nodeType = getNodeType(node);

    return [FUNCTION_DECLARATION, FUNCTION_EXPRESSION].includes(nodeType)
        && getNodeType(parent) !== METHOD_DEFINITION;
}

function selectReplacementLocations(searchScope, variableDeclarator) {
    const variableName = getVariableName(variableDeclarator);
    let selectedLocations = [];

    traverse(searchScope, {
        enter: function (node, parent) {
            if(doNotDescend(node, parent)) {
                return VisitorOption.Skip;
            }

            if (getNodeType(node) === IDENTIFIER
                && node.name === variableName
                && getNodeType(parent) === MEMBER_EXPRESSION
                && getNodeType(parent.object) === THIS_EXPRESSION) {
                selectedLocations.push(node.loc);
            }
        }
    });

    return selectedLocations;
}

module.exports = {
    selectReplacementLocations
}