const { parse } = require('../../parser/parser');
const { getSourceSelection } = require('../../source-utilities');
const { selectExtractionLocation } = require('../../extraction-utils/extraction-location-service');

const { findAppropriateParameters } = require('./parameter-search');

const astNodeTypes = require('../../constants/ast-node-types');
const { getMethodBuilder, methodTypes } = require('../../builders/MethodBuilder');

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
            getMethodBuilder({
                functionType: methodTypes.METHOD_DEFINITION,
                functionName: methodName,
                functionParameters: parameterString,
                functionBody: methodBody
            }).buildNewMethod(),

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
        || destinationType === astNodeTypes.PROGRAM
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