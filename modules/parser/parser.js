const tsEsTree = require('@typescript-eslint/typescript-estree');

const { parseMode: htmlParseMode} = require('./html-stripper');

const parseModes = [
    htmlParseMode
];

function parse(source) {
    let parseableSource = source;

    const modes = parseModes.filter(mode => mode.verify(source));

    modes.forEach(mode => {
        parseableSource = mode.prepare(source);
    });

    return tsEsTree.parse(parseableSource, { loc: true });
}

module.exports = {
    parse
};