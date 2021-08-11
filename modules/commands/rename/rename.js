const { VARIABLE_DECLARATOR, FUNCTION_DECLARATION } = require('../../constants/ast-node-types');
const { getNodeType } = require('../../core-utils');
const { findNodeByCheckFunction } = require('../../edit-utils/node-path-utils');
const {
    getSurroundingScope,
    getVariableDeclaractor,
    selectReplacementLocations
} = require('../../variable-utils/variable-use-utils');

function findDeclaratorOrFunctionDeclaration(selectionPath) {
    const acceptableNodeTypes = [VARIABLE_DECLARATOR, FUNCTION_DECLARATION];

    return findNodeByCheckFunction(selectionPath, (node) =>
        acceptableNodeTypes.includes(getNodeType(node)));
}

module.exports = {
    findDeclaratorOrFunctionDeclaration,
    getSurroundingScope,
    getVariableDeclaractor,
    selectReplacementLocations
};