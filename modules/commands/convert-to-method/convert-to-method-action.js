const { asyncPrepareActionSetup } = require("../../action-setup");
const { getNewSourceEdit } = require("../../edit-utils/SourceEdit");
const { transformLocationToRange } = require("../../edit-utils/textEditTransforms");
const { buildInfoMessage, parseAndShowMessage } = require("../../ui-services/messageService");
const { validateUserInput } = require("../../validatorService");
const { isValidVariableDeclaration, findVariableDeclaration, buildFunctionString } = require("./convert-to-method");

function convertToMethod() {
    let actionSetup = null;
    let variableDeclaration = null;

    return asyncPrepareActionSetup()
        .then((newActionSetup) => actionSetup = newActionSetup)

        .then(() => findVariableDeclaration(actionSetup.selectionPath))
        .then((newVariableDeclaration) => variableDeclaration = newVariableDeclaration)

        .then(() => validateUserInput({
            value: variableDeclaration,
            validator: isValidVariableDeclaration,
            message: buildInfoMessage(`It looks like you either didn't select a property, or the property isn't a function; canceling action`)
        }))

        .then(() => buildFunctionString(variableDeclaration, actionSetup.source))

        .then((functionString) => {
            const replacementRange = transformLocationToRange(variableDeclaration.loc);

            return getNewSourceEdit()
                .addReplacementEdit(replacementRange, functionString)
                .applyEdit();
        })

        .catch(function (error) {
            parseAndShowMessage(error);
        });
}

module.exports = {
    convertToMethod
};