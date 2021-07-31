const { BLOCK_STATEMENT } = require("../../ast-node-types");

function getSurroundingScope(scopePath) {
    const reversedPath = scopePath.slice(0);
    reversedPath.reverse();

    return reversedPath.find(node => node.type === BLOCK_STATEMENT);
}

module.exports = {
    getSurroundingScope
};