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

function insertReturnIfExpression(methodBody) {
    const parsedBody = parse(methodBody);

    return parsedBody.body.length === 1
        ? `return ${methodBody}`
        : methodBody;
}

const functionTypeMap = {
    [astNodeTypes.CLASS_BODY]: methodTypes.METHOD_DEFINITION,
    [astNodeTypes.OBJECT_EXPRESSION]: methodTypes.OBJECT_METHOD,
    default: methodTypes.FUNCTION_DECLARATION
};

function getFunctionType(destinationType) {
    return typeof functionTypeMap[destinationType] !== 'undefined'
        ? functionTypeMap[destinationType]
        : functionTypeMap['default'];
}

function buildMethodText({
    destinationType,
    methodBody,
    methodName,
    parameters
}) {
    const parameterString = parameters.join(', ');
    const modifiedBody = insertReturnIfExpression(methodBody);

    const methodBuilder = getMethodBuilder({
        functionName: methodName,
        functionParameters: parameterString,
        functionBody: modifiedBody,
        functionType: getFunctionType(destinationType)
    });

    return methodBuilder.buildNewMethod();
}


function isObjectMethodCall(destinationType) {
    return destinationType === astNodeTypes.BLOCK_STATEMENT
        || destinationType === astNodeTypes.PROGRAM
}

function buildMethodCallText({
    destinationType,
    methodName,
    parameters
}) {
    const prefix = isObjectMethodCall(destinationType) ? 'this.' : '';

    return`${prefix}${methodName}(${parameters})`;
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