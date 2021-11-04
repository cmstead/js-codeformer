const { parseOrNull } = require('../../parser/parser');
const { getSourceSelection } = require('../../source-utilities');
const { selectExtractionLocation } = require('../../extraction-utils/extraction-location-service');

const { findAppropriateParameters } = require('./parameter-search');

const astNodeTypes = require('../../constants/ast-node-types');
const { getMethodBuilder, methodTypes } = require('../../builders/MethodBuilder');
const { getNodeType, first, last } = require('../../core-utils');
const { VARIABLE_DECLARATION, IDENTIFIER } = require('../../constants/ast-node-types');
const { wrapJsxExpression } = require('../../react-service');
const languageValues = require('../../constants/language-values');

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

    return parseOrNull(sourceSelection);
}

function isBodyReturnable(parsedBody) {
    const firstChild = first(parsedBody.body);
    const childType = getNodeType(firstChild);

    return parsedBody.body.length === 1
        && !childType.toLowerCase().includes('statement')
        && childType !== VARIABLE_DECLARATION;
}

function isFinalLineADeclaration(parsedBody) {
    const finalLine = last(parsedBody.body);
    const finalLineIsADeclaration = getNodeType(finalLine) === VARIABLE_DECLARATION;
    const firstDeclaration = finalLineIsADeclaration
        ? first(finalLine.declarations)
        : {};


    return finalLineIsADeclaration
        && finalLine.declarations.length === 1
        && getNodeType(firstDeclaration.id) === IDENTIFIER
        && firstDeclaration.init !== null;
}

function getAssignedValue(methodBody, parsedBody) {
    const finalLine = last(parsedBody.body);
    const assignedExpression = finalLine.declarations[0].init;

    return getSourceSelection(methodBody, assignedExpression.loc);
}

function getMethodBodyRemainder(methodBody, parsedBody) {
    if (parsedBody.body.length === 1) {
        return '';
    }

    const firstLine = first(parsedBody.body);
    const nextToLastLine = parsedBody.body[parsedBody.body.length - 2];

    const selection = {
        start: firstLine.loc.start,
        end: nextToLastLine.loc.end
    }

    return getSourceSelection(methodBody, selection) + '\n';
}

function insertReturnStatement(methodBody, selectedNode) {
    let parsedBody = parseOrNull(methodBody);

    if(parsedBody === null) {
        return isBodyReturnable({ body: [selectedNode] })
            ? `return ${methodBody}`
            : methodBody;
    } else if (isBodyReturnable(parsedBody)) {
        return `return ${methodBody}`;
    } else if (isFinalLineADeclaration(parsedBody)) {
        const assignedValue = getAssignedValue(methodBody, parsedBody);
        const bodyRemainder = getMethodBodyRemainder(methodBody, parsedBody);

        return `${bodyRemainder}return ${assignedValue}${languageValues.terminator}`;
    } else {
        return methodBody;
    }
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
    parameters,
    selectedNode = null
}) {
    const functionParameters = parameters.join(', ');
    const functionBody = insertReturnStatement(methodBody, selectedNode);
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


function attachAssignment(simpleMethodCall, parsedBody) {
    if (isFinalLineADeclaration(parsedBody)) {
        const finalDeclaration = last(parsedBody.body);
        const finalDeclarator = last(finalDeclaration.declarations);
        return `${finalDeclaration.kind} ${finalDeclarator.id.name} = ${simpleMethodCall}`;
    }

    return simpleMethodCall;
}

function buildMethodCallText({
    destinationType,
    parameters,
    selectedNode = null,
    methodBody = ''
}) {
    const prefix = isObjectMethodCall(destinationType) ? 'this.' : '';
    const simpleMethodCall = '${1/async/await/}' + `${prefix}$2(${parameters})`;

    const parsedBody = parseOrNull(methodBody);

    const baseMethodCall = parsedBody === null
        ? simpleMethodCall
        : attachAssignment(simpleMethodCall, parsedBody);

    return wrapJsxExpression(selectedNode, baseMethodCall);
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