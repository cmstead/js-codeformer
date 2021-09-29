const { asyncPrepareActionSetup } = require("../../action-setup");
const { getNewVariableBuilder } = require("../../builders/VariableBuilder");
const { VARIABLE_DECLARATION } = require("../../constants/ast-node-types");
const { findNodeInPath } = require("../../edit-utils/node-path-utils");
const { getNewSourceEdit } = require("../../edit-utils/SourceEdit");
const { transformLocationToRange } = require("../../edit-utils/textEditTransforms");
const { getSourceSelection } = require("../../source-utilities");
const { buildInfoMessage, parseAndShowMessage } = require("../../ui-services/messageService");
const { validateUserInput } = require("../../validatorService");

function convertToMultipleDeclarations() {
    let actionSetup = null;
    let declarationNode = null;

    return asyncPrepareActionSetup()
        .then((newActionSetup) => actionSetup = newActionSetup)

        .then(() => declarationNode = findNodeInPath(actionSetup.selectionPath, VARIABLE_DECLARATION))

        .then(() => validateUserInput({
            value: declarationNode,
            validator: (declarationNode) => declarationNode !== null,
            message: buildInfoMessage('Unable to find variable declaration')
        }))

        .then(() => declarationNode.declarations
            .map((declarator) => getNewVariableBuilder({
                type: declarationNode.kind,
                name: declarator.id.name,
                value: declarator.init ? getSourceSelection(actionSetup.source, declarator.init.loc) : null
            })
                .buildVariableDeclaration())
            .join('\n'))

        .then((declarationsString) => {
            const replacementRange = transformLocationToRange(declarationNode.loc);

            return getNewSourceEdit()
                .addReplacementEdit(replacementRange, declarationsString)
                .applyEdit();
        })

        .catch(function (error) {
            parseAndShowMessage(error);
        });
}

module.exports = {
    convertToMultipleDeclarations
};