const { asyncPrepareActionSetup } = require("../../action-setup");
const { PROPERTY } = require("../../constants/ast-node-types");
const { findNodeInPath } = require("../../edit-utils/node-path-utils");
const { getNewSourceEdit } = require("../../edit-utils/SourceEdit");
const { transformLocationToRange } = require("../../edit-utils/textEditTransforms");
const { buildInfoMessage, parseAndShowMessage } = require("../../ui-services/messageService");
const { validateUserInput } = require("../../validatorService");
const { getPropertyDeclarationString, isConvertablePropertyNode } = require("./toggle-property-declaration");

function togglePropertyDeclaration() {
    return asyncPrepareActionSetup()

        .then((actionSetup) => findNodeInPath(actionSetup.selectionPath, PROPERTY))
        .then((node) => validateUserInput({
            value: node,
            validator: (node) => node !== null && isConvertablePropertyNode(node),
            message: buildInfoMessage('Unable to find acceptable property node; canceling toggle declaration')
        }))

        .then((propertyNode) => {
            const replacementRange = transformLocationToRange(propertyNode.loc);
            const replacementString = getPropertyDeclarationString(propertyNode);

            return getNewSourceEdit()
                .addReplacementEdit(replacementRange, replacementString)
                .applyEdit();
        })

        .catch(function (error) {
            parseAndShowMessage(error);
        });
}

module.exports = {
    togglePropertyDeclaration
};