const { getSourceSelection } = require('../../source-utilities');
const { selectExtractionLocation } = require('../../extraction-utils/extraction-location-service');

const {
    buildExtractionScopeList,
    selectExtractionScopes
} = require('./variableExtractionScopeService');

const astNodeTypes = require('../../constants/ast-node-types');
const { getNewVariableBuilder, variableTypes } = require('../../builders/VariableBuilder');
const { getNodeType } = require('../../core-utils');
const { JSX_ELEMENT } = require('../../constants/ast-node-types');

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

const acceptableVariableTypes = variableTypes;

const variableTypeList = Object
    .keys(acceptableVariableTypes)
    .map(key => acceptableVariableTypes[key]);

function isJsxElement(node) {
    return getNodeType(node) === JSX_ELEMENT;
}

function prepareVariableNameString(variableName, selectedNode) {
    return isJsxElement(selectedNode) ? `{${variableName}}` : variableName;
}

function buildVariableDeclaration({
    variableType,
    variableName,
    source
}) {
    return getNewVariableBuilder({
        type: variableType,
        name: variableName,
        value: source
    }).buildVariableDeclaration();
}

module.exports = {
    acceptableNodeTypes,
    acceptableVariableTypes,
    buildExtractionScopeList,
    buildVariableDeclaration,
    selectExtractionScopes,
    selectExtractionLocation,
    getSourceSelection,
    variableTypeList,
    prepareVariableNameString
};