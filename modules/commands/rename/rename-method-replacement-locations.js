const { VisitorOption } = require("estraverse");
const { traverse } = require("../../astTraverse");
const { MEMBER_EXPRESSION, THIS_EXPRESSION, IDENTIFIER, METHOD_DEFINITION } = require("../../constants/ast-node-types");
const { getNodeType } = require("../../core-utils");

function getVariableName(variableDeclarator) {
    return typeof variableDeclarator.key === 'string'
        ? variableDeclarator.key
        : variableDeclarator.key.name;
}

function selectReplacementLocations(searchScope, variableDeclarator) {
    const variableName = getVariableName(variableDeclarator);

    traverse(searchScope, {
        enter: function (node, parent) {
            if(getNodeType(node) === IDENTIFIER
                && node.name === variableName
                && getNodeType(parent) === MEMBER_EXPRESSION
                && getNodeType(parent.object) === THIS_EXPRESSION) {
                console.log(node);
            }
        }
    });
}

module.exports = {
    selectReplacementLocations
}