const { parse } = require('../../parser/parser');
const { getSourceSelection } = require('../../source-utilities');
const { selectExtractionLocation } = require('../../extraction-utils/extraction-location-service');

const { findAppropriateParameters } = require('./parameter-search');

const astNodeTypes = require('../../ast-node-types');

const acceptableNodeTypes = [
    astNodeTypes.ARROW_FUNCTION_EXPRESSION,
    astNodeTypes.FUNCTION_DECLARATION,
    astNodeTypes.FUNCTION_EXPRESSION,
    astNodeTypes.FUNCTION,
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

const methodBuilders = {
    [astNodeTypes.CLASS_BODY]:
        (methodBody, methodName, parameterString) =>
            `${methodName} (${parameterString}) {\n${methodBody}\n}`,

    [astNodeTypes.OBJECT_EXPRESSION]:
        (methodBody, methodName, parameterString) =>
            `${methodName}: function (${parameterString}) {\n${methodBody}\n},`,

    [astNodeTypes.BLOCK_STATEMENT]:
        (methodBody, methodName, parameterString) =>
            `function ${methodName} (${parameterString}) {\n${methodBody}\n}`
};

function insertReturnIfExpression(methodBody) {
    const parsedBody = parse(methodBody);

    return parsedBody.body.length === 1
        ? `return ${methodBody}`
        : methodBody;
}

function buildMethodText({
    destinationType,
    methodBody,
    methodName,
    parameters
}) {
    const parameterString = parameters.join(', ');

    const constructorKey = typeof methodBuilders[destinationType] === 'undefined'
        ? astNodeTypes.BLOCK_STATEMENT
        : destinationType;

    const buildMethod = methodBuilders[constructorKey];
    const modifiedBody = insertReturnIfExpression(methodBody);

    return buildMethod(modifiedBody, methodName, parameterString);
}


function buildMethodCallText({
    destinationType,
    methodName,
    parameters
}){
    const methodCall = `${methodName}(${parameters})`;

    return destinationType === astNodeTypes.BLOCK_STATEMENT
        ? methodCall
        : `this.${methodCall}`;
}

module.exports = {
    acceptableNodeTypes,
    buildMethodText,
    buildMethodCallText,
    terminalNodes,
    findAppropriateParameters,
    parseSelectedText,
    selectExtractionLocation
};