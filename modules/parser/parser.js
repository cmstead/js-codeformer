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

function tryParseStandard(source) {
    return tsEsTree.parse(source, {
        loc: true,
    });
}

function tryParseJsx(source) {
    return tsEsTree.parse(source, {
        jsx: true,
        loc: true,
        useJSXTextNode: true,
    });
}

function parseText(source, { useJsx }) {
    try {
        return useJsx 
            ? tryParseJsx(source)
            : tryParseStandard(source);
    } catch (error) {
        if(useJsx) {
            throw error;
        } else {
            return parseText(source, { useJsx: true });
        }
    }
}

function parse(originalSource) {
    const parseableSource = applyParseModeTransformations(originalSource);
    return parseText(parseableSource, { useJsx: false });
}

module.exports = {
    parse
};