const { asyncPrepareActionSetup } = require("../../action-setup");
const { IDENTIFIER } = require("../../constants/ast-node-types");
const { getNodeType } = require("../../core-utils");
const { getNewSourceEdit } = require("../../edit-utils/SourceEdit");
const { transformLocationToRange } = require("../../edit-utils/textEditTransforms");
const { openInputBox } = require("../../ui-services/inputService");
const { showErrorMessage } = require("../../ui-services/messageService");
const { validateUserInput } = require("../../validatorService");
const {
    getSurroundingScope,
    selectReplacementLocations,
    findDeclaratorOrFunctionDeclaration,
    getVariableDeclaratorLocation
} = require("./rename");

function getDeclaratorName(declarator) {
    if(getNodeType(declarator) === IDENTIFIER) {
        return declarator.name;
    }

    return declarator.id.name;
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
            openInputBox({
                title: 'New variable name',
                value: getDeclaratorName(variableDeclarator)
            }))
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