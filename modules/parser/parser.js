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

    return tsEsTree.parse(parseableSource, { loc: true });
}

module.exports = {
    parse
};