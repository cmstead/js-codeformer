const { asyncPrepareActionSetup } = require("../../action-setup");
const { showErrorMessage } = require("../../ui-services/messageService");
const { getNewSourceEdit } = require("../../edit-utils/SourceEdit");
const { transformLocationToRange } = require("../../edit-utils/textEditTransforms");
const { validateUserInput } = require("../../validatorService");
const {
    getVariableDeclaractor,
    getSurroundingScope,
    selectReplacementLocations,
    getDeclarationBody,
    getVariableDeclaration,
    pickVariableDeletionLocation
} = require("./inline-variable");

function prepareEditLocation(editLocation) {
    return transformLocationToRange(editLocation);
}

function inlineVariable() {
    let actionSetup = null;

    let nodePath = null;

    let variableDeclarator = null;
    let variableDeclaration = null;
    let surroundingScope = null;
    let replacementLocations = null;
    let declarationBody = null;

    return asyncPrepareActionSetup()
        .then(function (newActionSetup) {
            actionSetup = newActionSetup;

            nodePath = actionSetup.selectionPath;
        })

        .then(() =>
            getVariableDeclaractor(nodePath))
        .then((newVariableDeclarator) =>
            validateUserInput({
                value: newVariableDeclarator,
                validator: (selectedScope) => selectedScope !== null,
                message: 'No variable selected to inline'
            }))
        .then((newVariableDeclarator) =>
                variableDeclarator = newVariableDeclarator)

        .then(() =>
            getVariableDeclaration(nodePath))
        .then((newVariableDeclaration) =>
            variableDeclaration = newVariableDeclaration)

        .then(() =>
            getDeclarationBody(variableDeclarator, actionSetup.source))
        .then((newDeclarationBody) =>
            declarationBody = newDeclarationBody)

        .then(() =>
            getSurroundingScope(nodePath))
        .then((newSurroundingScope) =>
            surroundingScope = newSurroundingScope)

        .then(() =>
            selectReplacementLocations(surroundingScope, variableDeclarator))
        .then((newReplacementLocations) => validateUserInput({
            value: newReplacementLocations,
            validator: (replacementLocations) => replacementLocations.length > 0,
            message: 'No variable usage found; cannot inline variable'
        }))
        .then((newReplacementLocations) => {
            replacementLocations = newReplacementLocations
            replacementLocations.reverse();
        })

        .then(() =>
            getNewSourceEdit())
        .then((sourceEdit) => {
            replacementLocations
                .forEach((replacementLocation) => {
                    const replacementRange = prepareEditLocation(replacementLocation);
                    sourceEdit.addReplacementEdit(replacementRange, declarationBody)
                });

            const deletionLocation = pickVariableDeletionLocation(
                variableDeclarator,
                variableDeclaration
            );

            const replacementRange = prepareEditLocation(deletionLocation);
            sourceEdit.addReplacementEdit(replacementRange, '');

            sourceEdit.applyEdit();
        })

        .catch((error) =>
            showErrorMessage(error.message));
}

module.exports = {
    inlineVariable
};