const { parse } = require('../../parser/parser');
const { getSourceSelection } = require('../../source-utilities');

function parseSelectedText(sourceCodeText, selectionLocation) {
    const sourceSelection = getSourceSelection(sourceCodeText, selectionLocation);

    return parse(sourceSelection);
}

module.exports = {
    parseSelectedText
};