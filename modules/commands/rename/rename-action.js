const { asyncPrepareActionSetup } = require("../../action-setup");
const { IDENTIFIER, METHOD_DEFINITION } = require("../../constants/ast-node-types");
const { getNodeType } = require("../../core-utils");
const { getNewSourceEdit } = require("../../edit-utils/SourceEdit");
const { transformLocationToRange } = require("../../edit-utils/textEditTransforms");
const { openInputBox } = require("../../ui-services/inputService");
const { buildInfoMessage, parseAndShowMessage } = require("../../ui-services/messageService");
const { validateUserInput } = require("../../validatorService");
const {
    getSurroundingScope,
    selectReplacementLocations,
    findDeclaratorOrFunctionDeclaration,
    getVariableDeclaratorLocation
} = require("./rename");

function getDeclaratorName(declarator) {
    const nodeType = getNodeType(declarator);

    if (nodeType === IDENTIFIER) {
        return declarator.name;
    } else if (nodeType === METHOD_DEFINITION) {
        return declarator.key.name;
    }

    return declarator.id.name;
}

function locationsMatch(sourceLocation, testLocation) {
    return sourceLocation.start.line === testLocation.start.line
        && sourceLocation.start.column === testLocation.start.column
        && sourceLocation.end.line === testLocation.end.line
        && sourceLocation.end.column === testLocation.end.column;
}

function rename() {
    let actionSetup = null;
    let variableDeclarator = null;
    let surroundingScope = null;
    let replacementLocations = null;
    let newName = '';

    let originalName = null;

    return asyncPrepareActionSetup()
        .then((newActionSetup) =>
            actionSetup = newActionSetup)

        .then(() =>
            findDeclaratorOrFunctionDeclaration(actionSetup.selectionPath))
        .then((variableDeclarator) => validateUserInput({
            value: variableDeclarator,
            validator: (variableDeclarator) => variableDeclarator !== null,
            message: buildInfoMessage('No variable declaration selected, cannot rename')
        }))
        .then((newVariableDeclarator) => {
            variableDeclarator = newVariableDeclarator
        })

        .then(() => originalName = getDeclaratorName(variableDeclarator))

        .then(() =>
            openInputBox({
                title: 'New variable name',
                value: originalName
            }))
        .then((enteredName) => validateUserInput({
            value: enteredName,
            validator: (enteredName) => enteredName.trim() !== '',
            message: buildInfoMessage('No variable name provided; canceling rename')
        }))
        .then((enteredName) => newName = enteredName)

        .then(() =>
            getSurroundingScope(actionSetup.selectionPath, variableDeclarator))
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
                    const replacementString = replacementLocation.shorthand
                        ? `${originalName}: ${newName}`
                        : newName;

                    sourceEdit.addReplacementEdit(replacementRange, replacementString);
                });

            const variableNameLocation = getVariableDeclaratorLocation(variableDeclarator);

            if (!replacementLocations.find((location) => locationsMatch(location, variableNameLocation))) {
                const replacementRange = transformLocationToRange(variableNameLocation);

                sourceEdit.addReplacementEdit(replacementRange, newName);
            }

            sourceEdit.applyEdit();
        })

        .catch(function (error) {
            parseAndShowMessage(error);
        });
}

module.exports = {
    rename
};