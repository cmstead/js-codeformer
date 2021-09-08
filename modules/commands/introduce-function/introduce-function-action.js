const { asyncPrepareActionSetup } = require("../../action-setup");
const { getMethodBuilder, methodTypes } = require("../../builders/MethodBuilder");
const astNodeTypes = require("../../constants/ast-node-types");
const { getNodeType } = require("../../core-utils");
const { transformLocationPartToPosition } = require("../../edit-utils/textEditTransforms");
const { retrieveExtractionLocation, selectExtractionLocation } = require("../../extraction-utils/extraction-location-service");
const { buildExtractionPath } = require("../../extraction-utils/ExtractionPathBuilder");
const { selectExtractionScopes, buildIntroductionScopeList } = require("../../extraction-utils/extractionScopeService");
const { openSelectList, openInputBox } = require("../../ui-services/inputService");
const { buildInfoMessage, parseAndShowMessage } = require("../../ui-services/messageService");
const { validateUserInput } = require("../../validatorService");
const { getNameOrCall, getNodeName, getParameterString } = require("./introduce-function");

const vscode = require('../../vscodeService').getVscode()

const acceptableNodeTypes = [
    astNodeTypes.ARROW_FUNCTION_EXPRESSION,
    astNodeTypes.FUNCTION_DECLARATION,
    astNodeTypes.FUNCTION_EXPRESSION,
    astNodeTypes.FUNCTION,
    astNodeTypes.METHOD_DEFINITION,
    astNodeTypes.WHILE_STATEMENT
];

function buildSnippetString(snippetText) {
    return new vscode.SnippetString(snippetText);
}

function introduceFunction() {
    let actionSetup = null;
    let extractionPath = null;
    let identifierNode = null;
    let selectedScopeNode = null;
    let introductionLocation = null;

    return asyncPrepareActionSetup()
        .then((newActionSetup) => actionSetup = newActionSetup)

        .then(() => buildExtractionPath(actionSetup.selectionPath, acceptableNodeTypes))
        .then((newExtractionPath) =>
            extractionPath = newExtractionPath)

        .then(() => getNameOrCall(actionSetup.selectionPath))
        .then((selectedNode) => validateUserInput({
            value: selectedNode,
            validator: (selectedNode) =>
                getNodeType(selectedNode) !== null,
            message: buildInfoMessage('No function name or call selected; canceling introduce function action')
        }))
        .then((newIdentifierNode) =>
            identifierNode = newIdentifierNode)

        .then(() => openSelectList({
            title: 'Where should your new variable be introduced?',
            values: buildIntroductionScopeList(extractionPath)
        }))
        .then((selectedScope) => validateUserInput({
            value: selectedScope,
            validator: (selectedScope) => selectedScope.trim() !== '',
            message: buildInfoMessage('No scope selected for function introduction; canceling introduce function action')
        }))
        .then((selectedScope) => {
            const extractionScopes = selectExtractionScopes(extractionPath, selectedScope);
            selectedScopeNode = retrieveExtractionLocation(extractionScopes);
        })

        .then(() => {
            introductionLocation = selectExtractionLocation(actionSetup.selectionPath, selectedScopeNode);
        })

        .then(() => getParameterString(identifierNode))
        .then((parameterString) => openInputBox({
            title: 'Enter function parameters',
            value: parameterString
        }))

        .then((parameterString) =>
            getMethodBuilder({
                functionType: methodTypes.FUNCTION_DECLARATION,
                functionName: getNodeName(identifierNode),
                functionParameters: parameterString,
                functionBody: `\${1:throw new Error('Function not implemented');}`
            })
                .buildNewMethod())

        .then((functionDeclarationString) => {
            const editPosition = transformLocationPartToPosition(introductionLocation.start);
            const snippetString = buildSnippetString(`${functionDeclarationString}\$0\n`);

            return actionSetup.activeTextEditor.insertSnippet(snippetString, editPosition);
        })

        .catch(function (error) {
            parseAndShowMessage(error);
        });
}

module.exports = {
    introduceFunction
};