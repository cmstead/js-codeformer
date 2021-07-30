const { parse } = require('../../parser/parser');
const { getSourceSelection } = require('../../source-utilities');

const { findAppropriateParameters } = require('./parameter-search');

const astNodeTypes = require('../../ast-node-types');

const acceptableNodeTypes = [
    astNodeTypes.ARROW_FUNCTION_EXPRESSION,
    astNodeTypes.DO_WHILE_STATEMENT,
    astNodeTypes.CLASS_BODY,
    astNodeTypes.FOR_STATEMENT,
    astNodeTypes.FOR_IN_STATEMENT,
    astNodeTypes.FUNCTION_DECLARATION,
    astNodeTypes.FUNCTION_EXPRESSION,
    astNodeTypes.FUNCTION,
    astNodeTypes.IF_STATEMENT,
    astNodeTypes.METHOD_DEFINITION,
    astNodeTypes.OBJECT_EXPRESSION,
    astNodeTypes.WHILE_STATEMENT
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