const { asyncPrepareActionSetup } = require("../../action-setup");
const { getNodeType } = require("../../core-utils");
const { getNewSourceEdit } = require("../../edit-utils/SourceEdit");
const { transformLocationToRange } = require("../../edit-utils/textEditTransforms");
const { openInputBox } = require("../../ui-services/inputService");
const { showErrorMessage } = require("../../ui-services/messageService");
const { validateUserInput } = require("../../validatorService");
const { getSurroundingScope, selectReplacementLocations, findDeclaratorOrFunctionDeclaration } = require("./rename");

function getVariableDeclaratorLocation(variableDeclarator) {
    if(typeof variableDeclarator.id === 'object') {
        return variableDeclarator.id.loc;
    } else if(typeof variableDeclarator.key === 'object') {
        return variableDeclarator.key.loc;
    } else if(typeof variableDeclarator.callee === 'object') {
        return variableDeclarator.callee.loc;
    }

    throw new Error(`Variable delaration type unknown: ${getNodeType(variableDeclarator)}`)
}

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
            findDeclaratorOrFunctionDeclaration(actionSetup.selectionPath))
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

            const variableNameLocation = getVariableDeclaratorLocation(variableDeclarator);

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