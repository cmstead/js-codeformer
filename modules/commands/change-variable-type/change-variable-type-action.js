const { asyncPrepareActionSetup } = require("../../action-setup");
const { getNewVariableBuilder, variableTypes } = require("../../builders/VariableBuilder");
const { VARIABLE_DECLARATION, VARIABLE_DECLARATOR } = require("../../constants/ast-node-types");
const { first, last } = require("../../core-utils");
const { findNodeInPath } = require("../../edit-utils/node-path-utils");
const { insertSnippet } = require("../../edit-utils/snippet-service");
const { transformLocationToRange } = require("../../edit-utils/textEditTransforms");
const { getSourceSelection } = require("../../source-utilities");
const { buildInfoMessage, parseAndShowMessage } = require("../../ui-services/messageService");
const { validateUserInput } = require("../../validatorService");

function changeVariableType() {
    let actionSetup = null;
    let variableDeclarationNode = null;

    return asyncPrepareActionSetup()
        .then((newActionSetup) =>
            actionSetup = newActionSetup)

        .then(() =>
            findNodeInPath(actionSetup.selectionPath, VARIABLE_DECLARATION))
        .then((variableDeclarationNode) => validateUserInput({
            value: variableDeclarationNode,
            validator: (variableDeclarationNode) => variableDeclarationNode !== null,
            message: buildInfoMessage("It looks like you're not on a variable declaration; canceling action")
        }))
        .then((newVariableDeclarationNode) =>
            variableDeclarationNode = newVariableDeclarationNode)

        .then(() => ({
            start: first(variableDeclarationNode.declarations).loc.start,
            end: last(variableDeclarationNode.declarations).loc.end,
        }))

        .then((declaratorsLocation) => getSourceSelection(actionSetup.source, declaratorsLocation))
        .then((declaratorsString) => getNewVariableBuilder({
            type: variableTypes.SELECT,
            name: declaratorsString,
            value: null
        })
        .buildVariableDeclaration())

        .then((newVariableString) => {
            const replacementRange = transformLocationToRange(variableDeclarationNode.loc);

            return insertSnippet(newVariableString, replacementRange)
        })

        .then(() => 'Press tab or escape to exit')

        .catch(function (error) {
            parseAndShowMessage(error);
        });
}

module.exports = {
    changeVariableType
};