const { asyncPrepareActionSetup } = require("../../action-setup");
const { PROPERTY, IDENTIFIER } = require("../../constants/ast-node-types");
const { getNodeType } = require("../../core-utils");
const { findNodeInPath } = require("../../edit-utils/node-path-utils");
const { getNewSourceEdit } = require("../../edit-utils/SourceEdit");
const { transformLocationToRange } = require("../../edit-utils/textEditTransforms");
const { showErrorMessage } = require("../../ui-services/messageService");
const { validateUserInput } = require("../../validatorService");

function getPropertyKey(propertyNode) {
    return getNodeType(propertyNode.key) === IDENTIFIER
        ? propertyNode.key.name
        : propertyNode.key;
}

function getPropertyDeclarationString(propertyNode) {
    if(propertyNode.shorthand) {
        const propertyKey = getPropertyKey(propertyNode);

        return `${propertyKey}: ${propertyKey}`
    } else {
        return propertyNode.value.name;
    }
}

function togglePropertyDeclaration() {
    let actionSetup = null;
    let propertyNode = null;
    return asyncPrepareActionSetup()
        .then((newActionSetup) => actionSetup = newActionSetup)

        .then(() => findNodeInPath(actionSetup.selectionPath, PROPERTY))
        .then((node) => validateUserInput({
            value: node,
            validator: (node) => node !== null
                && (node.shorthand || getNodeType(node.value) === IDENTIFIER),
            message: 'Unable to find acceptable property node; canceling toggle declaration'
        }))
        .then((newPropertyNode) => propertyNode = newPropertyNode)

        .then(() => {
            const replacementRange = transformLocationToRange(propertyNode.loc);
            const replacementString = getPropertyDeclarationString(propertyNode);

            return getNewSourceEdit()
                .addReplacementEdit(replacementRange, replacementString)
                .applyEdit();
        })

        .catch(function (error) {
            showErrorMessage(error.message);
        });
}

module.exports = {
    togglePropertyDeclaration
};