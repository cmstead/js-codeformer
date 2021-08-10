const { getNewVariableBuilder, variableTypeList } = require("../../../test/tests/builders/VariableBuilder");
const { asyncPrepareActionSetup } = require("../../action-setup");
const { VARIABLE_DECLARATION, VARIABLE_DECLARATOR } = require("../../constants/ast-node-types");
const { findNodeInPath } = require("../../edit-utils/node-path-utils");
const { getNewSourceEdit } = require("../../edit-utils/SourceEdit");
const { transformLocationToRange } = require("../../edit-utils/textEditTransforms");
const { openSelectList } = require("../../ui-services/inputService");
const { showErrorMessage } = require("../../ui-services/messageService");
const { validateUserInput } = require("../../validatorService");
const { getVariableValueString } = require("./change-variable-type");

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
            message: "No variable standalone declaration selected; cannot change declaration type"
        }))
        .then((newVariableDeclarationNode) =>
            variableDeclarationNode = newVariableDeclarationNode)

        .then(() => findNodeInPath(actionSetup.selectionPath, VARIABLE_DECLARATOR))
        .then((newVariableDeclaratorNode) => variableDeclaratorNode = newVariableDeclaratorNode)

        .then(() => openSelectList({
            values: variableTypeList,
            title: 'Which variable type do you want to use?'
        }))
        .then((variableType) => validateUserInput({
            value: variableType,
            validator: (variableType) => variableTypeList.includes(variableType),
            message: 'Invalid or no variable type selected; canceling declaration type change'
        }))

        .then((variableType) => getNewVariableBuilder({
            type: variableType,
            name: variableDeclaratorNode.id.name,
            value: getVariableValueString(variableDeclaratorNode, actionSetup.source)
        })
            .buildVariableDeclaration())

        .then((newVariableString) => {
            const replacementRange = transformLocationToRange(variableDeclarationNode.loc);

            return getNewSourceEdit()
                .addReplacementEdit(replacementRange, newVariableString)
                .applyEdit();
        })

        .catch(function (error) {
            showErrorMessage(error.message);
        });
}

module.exports = {
    changeVariableType
};