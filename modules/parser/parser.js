const tsEsTree = require('@typescript-eslint/typescript-estree');

const { parseMode: htmlParseMode } = require('./html-stripper');

const parseModes = [
    htmlParseMode
];

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