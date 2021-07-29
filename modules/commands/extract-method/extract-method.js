const { parse } = require('../../parser/parser');
const { getSourceSelection } = require('../../source-utilities');

function parseSelectedText(sourceCodeText, selectionLocation) {
    const sourceSelection = getSourceSelection(sourceCodeText, selectionLocation);

    try{
        return parse(sourceSelection);
    } catch (_) {
        throw new Error('Selected source cannot be interpreted, unable to extract method');
    }
}

module.exports = {
    parseSelectedText
};