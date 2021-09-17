const { asyncPrepareActionSetup } = require("../../action-setup");
const { VARIABLE_DECLARATION, VARIABLE_DECLARATOR } = require("../../constants/ast-node-types");
const { findNodeInPath } = require("../../edit-utils/node-path-utils");
const { insertSnippet } = require("../../edit-utils/snippet-service");
const { transformLocationToRange } = require("../../edit-utils/textEditTransforms");
const { buildInfoMessage, parseAndShowMessage } = require("../../ui-services/messageService");
const { validateUserInput } = require("../../validatorService");
const { getNewVariableString } = require("./change-variable-type");

function changeVariableType() {
    let actionSetup = null;
    let variableDeclarationNode = null;
    let variableDeclaratorNode = null;

    return asyncPrepareActionSetup()
        .then((newActionSetup) =>
            actionSetup = newActionSetup)

        .then(() =>
            findNodeInPath(actionSetup.selectionPath, VARIABLE_DECLARATION))
        .then((variableDeclarationNode) => validateUserInput({
            value: variableDeclarationNode,
            validator: (variableDeclarationNode) =>
                variableDeclarationNode !== null && variableDeclarationNode.declarations.length === 1,
            message: buildInfoMessage("It looks like you're not on a variable declaration; canceling action")
        }))
        .then((newVariableDeclarationNode) =>
            variableDeclarationNode = newVariableDeclarationNode)

        .then(() => findNodeInPath(actionSetup.selectionPath, VARIABLE_DECLARATOR))
        .then((newVariableDeclaratorNode) => variableDeclaratorNode = newVariableDeclaratorNode)

        .then(() => getNewVariableString(
            variableDeclaratorNode,
            actionSetup.source))

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