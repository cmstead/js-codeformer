const {
    getDeclarationBody,
    getSurroundingScope,
    getVariableDeclaractor,
    getVariableDeclaration,
    selectReplacementLocations
} = require('../../variable-utils/variable-use-utils');

const { pickVariableDeletionLocation } = require('../../extraction-utils/variable-deletion-utils');

module.exports = {
    getDeclarationBody,
    getSurroundingScope,
    getVariableDeclaractor,
    getVariableDeclaration,
    pickVariableDeletionLocation,
    selectReplacementLocations
};