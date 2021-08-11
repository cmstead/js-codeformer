const { asyncPrepareActionSetup } = require("../../action-setup");
const { getNewSourceEdit } = require("../../edit-utils/SourceEdit");
const { transformLocationToRange } = require("../../edit-utils/textEditTransforms");
const { openInputBox } = require("../../ui-services/inputService");
const { showErrorMessage } = require("../../ui-services/messageService");
const { validateUserInput } = require("../../validatorService");
const { getVariableDeclaractor, getSurroundingScope, selectReplacementLocations } = require("./rename");

function rename() {
    let actionSetup = null;
    let variableDeclarator = null;
    let surroundingScope = null;
    let replacementLocations = null;
    let newName = '';

    return asyncPrepareActionSetup()
        .then((newActionSetup) =>
            actionSetup = newActionSetup)

        .then(() =>
            getVariableDeclaractor(actionSetup.selectionPath))
        .then((variableDeclarator) => validateUserInput({
            value: variableDeclarator,
            validator: (variableDeclarator) => variableDeclarator !== null,
            message: 'No variable declaration selected, cannot rename'
        }))
        .then((newVariableDeclarator) =>
            variableDeclarator = newVariableDeclarator)

        .then(() =>
            openInputBox({ title: 'New variable name' }))
        .then((enteredName) => validateUserInput({
            value: enteredName,
            validator: (enteredName) => enteredName.trim() !== '',
            message: 'No variable name provided; canceling rename'
        }))
        .then((enteredName) => newName = enteredName)

        .then(() =>
            getSurroundingScope(actionSetup.selectionPath))
        .then((newSurroundingScope) =>
            surroundingScope = newSurroundingScope)

        .then(() =>
            selectReplacementLocations(surroundingScope, variableDeclarator))
        .then((newReplacementLocations) => {
            replacementLocations = newReplacementLocations
            replacementLocations.reverse();
        })

        .then(() =>
            getNewSourceEdit())
        .then((sourceEdit) => {
            replacementLocations
                .forEach((replacementLocation) => {
                    const replacementRange = transformLocationToRange(replacementLocation);
                    sourceEdit.addReplacementEdit(replacementRange, newName);
                });

            const variableNameLocation = variableDeclarator.id.loc;

            const replacementRange = transformLocationToRange(variableNameLocation);
            sourceEdit.addReplacementEdit(replacementRange, newName);

            sourceEdit.applyEdit();
        })

        .catch(function (error) {
            showErrorMessage(error.message);
        });
}

module.exports = {
    rename
};