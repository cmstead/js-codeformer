const { asyncPrepareActionSetup } = require("../../action-setup");
const { getNewVariableBuilder, variableTypes, variableTypeList } = require("../../builders/VariableBuilder");
const astNodeTypes = require("../../constants/ast-node-types");
const { last, getNodeType } = require("../../core-utils");
const { getNewSourceEdit } = require("../../edit-utils/SourceEdit");
const { transformLocationPartToPosition } = require("../../edit-utils/textEditTransforms");
const { retrieveExtractionLocation, selectExtractionLocation } = require("../../extraction-utils/extraction-location-service");
const { buildExtractionPath } = require("../../extraction-utils/ExtractionPathBuilder");
const { buildExtractionScopeList, selectExtractionScopes } = require("../../extraction-utils/extractionScopeService");
const { openSelectList } = require("../../ui-services/inputService");
const { showErrorMessage } = require("../../ui-services/messageService");
const { validateUserInput } = require("../../validatorService");

const { IDENTIFIER } = astNodeTypes;

const acceptableNodeTypes = [
    astNodeTypes.ARROW_FUNCTION_EXPRESSION,
    astNodeTypes.FUNCTION_DECLARATION,
    astNodeTypes.FUNCTION_EXPRESSION,
    astNodeTypes.FUNCTION,
    astNodeTypes.METHOD_DEFINITION,
    astNodeTypes.WHILE_STATEMENT
];

function introduceVariable() {
    let actionSetup = null;
    let extractionPath = null;
    let identifierNode = null;
    let selectedScopeNode = null;
    let introductionLocation = null;
    let variableType = null;

    return asyncPrepareActionSetup()
        .then((newActionSetup) => actionSetup = newActionSetup)

        .then(() => buildExtractionPath(actionSetup.selectionPath, acceptableNodeTypes))
        .then((newExtractionPath) =>
            extractionPath = newExtractionPath)

        .then(() => last(actionSetup.selectionPath))
        .then((selectedNode) => validateUserInput({
            value: selectedNode,
            validator: (selectedNode) =>
                getNodeType(selectedNode) === IDENTIFIER,
            message: 'No variable use selected; canceling introduce variable action'
        }))
        .then((newIdentifierNode) =>
            identifierNode = newIdentifierNode)

        .then(() => openSelectList({
            title: 'Where should your new variable be introduced?',
            values: buildExtractionScopeList(extractionPath)
        }))
        .then((selectedScope) => validateUserInput({
            value: selectedScope,
            validator: (selectedScope) => selectedScope.trim() !== '',
            message: 'No scope selected for variable introduction; canceling introduce variable action'
        }))
        .then((selectedScope) => {
            const extractionScopes = selectExtractionScopes(extractionPath, selectedScope);
            selectedScopeNode = retrieveExtractionLocation(extractionScopes);
        })

        .then(() => openSelectList({
            title: 'What kind of variable do you need?',
            values: variableTypeList
        }))
        .then((variableType) => validateUserInput({
            value: variableType,
            validator: (variableType) => variableTypeList.includes(variableType),
            message: 'No variable type selected; canceling introduce variable action'
        }))
        .then((newVariableType) => variableType = newVariableType)

        .then(() => {
            introductionLocation = selectExtractionLocation(actionSetup.selectionPath, selectedScopeNode);
        })

        .then(() =>
            getNewVariableBuilder({
                type: variableType,
                name: identifierNode.name,
                value: 'null'
            })
                .buildVariableDeclaration())

        .then((variableDeclarationString) => {
            const editPosition = transformLocationPartToPosition(introductionLocation.start);

            return getNewSourceEdit()
                .addInsertEdit(editPosition, `${variableDeclarationString}\n`)
                .applyEdit();
        })

        .catch(function (error) {
            showErrorMessage(error.message);
        });
}

module.exports = {
    introduceVariable
};