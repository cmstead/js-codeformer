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

const methodBuilders = {
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

    const constructorKey = typeof methodBuilders[destinationType] === 'undefined'
        ? astNodeTypes.BLOCK_STATEMENT
        : destinationType;

    const buildMethod = methodBuilders[constructorKey];

    return buildMethod(methodBody, methodName, parameterString);
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

function selectExtractionLocation(nodePath, extractionBlock) {
    let extractionNode = null;

    for (let i = 0; i < nodePath.length; i++) {
        if (nodePath[i] === extractionBlock) {
            extractionNode = nodePath[i + 1];
            break;
        }
    }

    return extractionNode.loc;
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