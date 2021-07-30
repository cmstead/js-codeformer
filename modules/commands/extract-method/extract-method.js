const { parse } = require('../../parser/parser');
const { getSourceSelection } = require('../../source-utilities');

const { findAppropriateParameters } = require('./parameter-search');

const astNodeTypes = require('../../ast-node-types');

const acceptableNodeTypes = [
    astNodeTypes.ARROW_FUNCTION_EXPRESSION,
    astNodeTypes.DO_WHILE_STATEMENT,
    astNodeTypes.FOR_STATEMENT,
    astNodeTypes.FOR_IN_STATEMENT,
    astNodeTypes.FUNCTION_DECLARATION,
    astNodeTypes.FUNCTION_EXPRESSION,
    astNodeTypes.FUNCTION,
    astNodeTypes.IF_STATEMENT,
    astNodeTypes.METHOD_DEFINITION,
    astNodeTypes.WHILE_STATEMENT
];

const terminalNodes = [
    astNodeTypes.CLASS_BODY,
    astNodeTypes.OBJECT_EXPRESSION
];

function parseSelectedText(sourceCodeText, selectionLocation) {
    const sourceSelection = getSourceSelection(sourceCodeText, selectionLocation);

    try {
        return parse(sourceSelection);
    } catch (_) {
        throw new Error('Selected source cannot be interpreted, unable to extract method');
    }
}

const methodConstructors = {
    [astNodeTypes.CLASS_BODY]:
        (methodBody, methodName, parameterString) =>
            `${methodName} (${parameterString}) {\n${methodBody}\n}`,

    [astNodeTypes.OBJECT_EXPRESSION]:
        (methodBody, methodName, parameterString) =>
            `${methodName}: function (${parameterString}) {\n${methodBody}\n}`,

    [astNodeTypes.BLOCK_STATEMENT]:
        (methodBody, methodName, parameterString) =>
            `function ${methodName} (${parameterString}) {\n${methodBody}\n}`
};

function buildMethodText({
    destinationType,
    methodBody,
    methodName,
    parameters
}) {
    const parameterString = parameters.join(',');

    const constructorKey = typeof methodConstructors[destinationType] === 'undefined'
        ? astNodeTypes.BLOCK_STATEMENT
        : destinationType;

    return methodConstructors[constructorKey](methodBody, methodName, parameterString);
}
module.exports = {
    acceptableNodeTypes,
    buildMethodText,
    terminalNodes,
    findAppropriateParameters,
    parseSelectedText
};