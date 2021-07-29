const { parse } = require('../../parser/parser');
const { getSourceSelection } = require('../../source-utilities');

const { findAppropriateParameters } = require('./parameter-search');

const astNodeTypes = require('../../ast-node-types');

const acceptableNodeTypes = [
    astNodeTypes.FUNCTION_DECLARATION,
    astNodeTypes.ARROW_FUNCTION_EXPRESSION,
    astNodeTypes.FUNCTION_EXPRESSION,
    astNodeTypes.FUNCTION,
    astNodeTypes.IF_STATEMENT,
    astNodeTypes.FOR_STATEMENT,
    astNodeTypes.FOR_IN_STATEMENT,
    astNodeTypes.WHILE_STATEMENT,
    astNodeTypes.DO_WHILE_STATEMENT,
    astNodeTypes.METHOD_DEFINITION
];

function parseSelectedText(sourceCodeText, selectionLocation) {
    const sourceSelection = getSourceSelection(sourceCodeText, selectionLocation);

    try {
        return parse(sourceSelection);
    } catch (_) {
        throw new Error('Selected source cannot be interpreted, unable to extract method');
    }
}

module.exports = {
    findAppropriateParameters,
    parseSelectedText
};