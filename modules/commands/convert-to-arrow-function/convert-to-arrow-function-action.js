const { prepareActionSetup } = require("../../action-setup");
const { getNewSourceEdit } = require("../../edit-utils/SourceEdit");
const { transformLocationToRange } = require("../../edit-utils/textEditTransforms");
const { showErrorMessage } = require("../../ui-services/messageService");
const { validateUserInput } = require("../../validatorService");
const { findFunction, getNewFunctionString } = require("./convert-to-arrow-function");

function convertToArrowFunction() {
    let actionSetup = null;
    let functionNode = null;

    return prepareActionSetup()
        .then((newActionSetup) =>
            actionSetup = newActionSetup)

        .then(() =>
            findFunction(actionSetup.selectionPath))

        .then((newFunctionNode) =>
            functionNode = newFunctionNode)

        .then(() => validateUserInput({
            value: functionNode,
            validator: (functionNode) => functionNode !== null,
            message: 'No function selected; cannot convert to arrow function'
        }))

        .then(() =>
            getNewFunctionString(functionNode))

        .then((functionString) => {
            const replacementLocation = functionNode.loc;
            const replacementRange = transformLocationToRange(replacementLocation);

            return getNewSourceEdit()
                .addReplacementEdit(replacementRange, functionString)
                .applyEdit();
        })

        .catch(function (error) {
            showErrorMessage(error.message);
        });
}

module.exports = {
    convertToArrowFunction
};