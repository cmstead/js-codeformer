const { parse } = require('../../parser/parser');
const { getSourceSelection } = require('../../source-utilities');
const { selectExtractionLocation } = require('../../extraction-utils/extraction-location-service');

const { findAppropriateParameters } = require('./parameter-search');

const astNodeTypes = require('../../constants/ast-node-types');
const { getMethodBuilder, methodTypes } = require('../../builders/MethodBuilder');
const { getNodeType, first } = require('../../core-utils');
const { JSX_ELEMENT } = require('../../constants/ast-node-types');

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

function bodyIsReturnable(methodBody) {
    const parsedBody = parse(methodBody);
    const firstChild = first(parsedBody.body);
    const childType = getNodeType(firstChild);

    return parsedBody.body.length === 1
        && !childType.toLowerCase().includes('statement');
}

function insertReturnIfExpression(methodBody) {
    return bodyIsReturnable(methodBody)
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
    methodName: functionName,
    parameters
}) {
    const functionParameters = parameters.join(', ');
    const functionBody = insertReturnIfExpression(methodBody);
    const functionType = getFunctionType(destinationType);

    return getMethodBuilder({
        functionName,
        functionParameters,
        functionBody,
        functionType
    }).buildNewMethod();
}


function isObjectMethodCall(destinationType) {
    return destinationType !== astNodeTypes.BLOCK_STATEMENT
        && destinationType !== astNodeTypes.PROGRAM
}


function isJsxElement(node) {
    return getNodeType(node) === JSX_ELEMENT;
}

function buildMethodCallText({
    destinationType,
    methodName,
    parameters,
    selectedNode = null
}) {
    const prefix = isObjectMethodCall(destinationType) ? 'this.' : '';
    const baseMethodCall = `${prefix}${methodName}(${parameters})`;

    return isJsxElement(selectedNode)
        ? `{${baseMethodCall}}`
        : baseMethodCall;
}

function wrapMethodBodyForJSX(selectedNode, sourceSelection) {
    return isJsxElement(selectedNode)
        ? `(${sourceSelection})`
        : sourceSelection
}

module.exports = {
    acceptableNodeTypes,
    buildMethodText,
    buildMethodCallText,
    terminalNodes,
    findAppropriateParameters,
    parseSelectedText,
    selectExtractionLocation,
    wrapMethodBodyForJSX
};