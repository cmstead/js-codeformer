const tsEsTree = require('@typescript-eslint/typescript-estree');

function parse(source) {
    return tsEsTree.parse(source);
}

module.exports = {
    parse
};