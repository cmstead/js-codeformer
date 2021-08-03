const tsEsTree = require('@typescript-eslint/typescript-estree');

const { parseModes } = require('./parse-modes');

function applyParseModeTransformations(originalSource) {
    return parseModes
        .filter(mode => mode.verify(originalSource))
        .reduce(
            (latestSource, parseMode) => parseMode.transform(latestSource),
            originalSource
        )
}

function parse(originalSource) {
    const parseableSource = applyParseModeTransformations(originalSource);

    try {
        return tsEsTree.parse(parseableSource, {
            loc: true,
        });
    } catch (error) {
        return tsEsTree.parse(parseableSource, {
            jsx: true,
            loc: true,
            useJSXTextNode: true,
        });
    }
}

module.exports = {
    parse
};