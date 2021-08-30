const { asyncPrepareActionSetup } = require("../../action-setup");
const { PROPERTY, IDENTIFIER } = require("../../constants/ast-node-types");
const { getNodeType } = require("../../core-utils");
const { findNodeInPath } = require("../../edit-utils/node-path-utils");
const { getNewSourceEdit } = require("../../edit-utils/SourceEdit");
const { transformLocationToRange } = require("../../edit-utils/textEditTransforms");
const { showErrorMessage } = require("../../ui-services/messageService");
const { validateUserInput } = require("../../validatorService");

function convertToStandardProperty() {
    let actionSetup = null;
    let propertyNode = null;
    return asyncPrepareActionSetup()
        .then((newActionSetup) => actionSetup = newActionSetup)

        .then(() => findNodeInPath(actionSetup.selectionPath, PROPERTY))
        .then((node) => validateUserInput({
            value: node,
            validator: (node) => node !== null && node.shorthand,
            message: 'Unable to find shorthand property node; canceling convert to standard property'
        }))
        .then((newPropertyNode) => propertyNode = newPropertyNode)

        .then(() => {
            const replacementRange = transformLocationToRange(propertyNode.loc);
            const propertyName = getNodeType(propertyNode.key) === IDENTIFIER
                ? propertyNode.key.name
                : propertyNode.key;

            const replacementString = `${propertyName}: ${propertyName}`;

            return getNewSourceEdit()
                .addReplacementEdit(replacementRange, replacementString)
                .applyEdit();
        })

        .catch(function (error) {
            showErrorMessage(error.message);
        });
}

module.exports = {
    convertToStandardProperty
};