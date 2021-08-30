const { asyncPrepareActionSetup } = require("../../action-setup");
const { PROPERTY, IDENTIFIER } = require("../../constants/ast-node-types");
const { getNodeType } = require("../../core-utils");
const { findNodeInPath } = require("../../edit-utils/node-path-utils");
const { getNewSourceEdit } = require("../../edit-utils/SourceEdit");
const { transformLocationToRange } = require("../../edit-utils/textEditTransforms");
const { showErrorMessage } = require("../../ui-services/messageService");
const { validateUserInput } = require("../../validatorService");

function convertToShorthandProperty() {
    let actionSetup = null;
    let propertyNode = null;
    return asyncPrepareActionSetup()
        .then((newActionSetup) => actionSetup = newActionSetup)

        .then(() => findNodeInPath(actionSetup.selectionPath, PROPERTY))
        .then((node) => validateUserInput({
            value: node,
            validator: (node) => node !== null
                && getNodeType(node.value) === IDENTIFIER,
            message: 'Unable to find property node; canceling convert to shorthand'
        }))
        .then((newPropertyNode) => propertyNode = newPropertyNode)

        .then(() => {
            const replacementRange = transformLocationToRange(propertyNode.loc);
            const replacementString = propertyNode.value.name;

            return getNewSourceEdit()
                .addReplacementEdit(replacementRange, replacementString)
                .applyEdit();
        })

        .catch(function (error) {
            showErrorMessage(error.message);
        });
}

module.exports = {
    convertToShorthandProperty
};