const { asyncPrepareActionSetup } = require("../../action-setup");
const { IMPORT_DECLARATION } = require("../../constants/ast-node-types");
const { findNodeInPath } = require("../../edit-utils/node-path-utils");
const { getNewSourceEdit } = require("../../edit-utils/SourceEdit");
const { transformLocationToRange } = require("../../edit-utils/textEditTransforms");
const { buildInfoMessage, parseAndShowMessage } = require("../../ui-services/messageService");
const { validateUserInput } = require("../../validatorService");
const { validateImportNode, convertToRequire } = require("./convert-import-to-commonjs");

function convertImportToCommonjs() {
    let actionSetup = null;
    let importNode = null;

    return asyncPrepareActionSetup()
        .then((newActionSetup) => actionSetup = newActionSetup)

        .then(() => findNodeInPath(actionSetup.selectionPath, IMPORT_DECLARATION))

        .then((importNode) => validateUserInput({
            value: importNode,
            validator: (importNode) => importNode !== null,
            message: buildInfoMessage('No import declaration found')
        }))

        .then((importNode) => validateUserInput({
            value: importNode,
            validator: (importNode) => validateImportNode(importNode),
            message: buildInfoMessage('Import declaration contains default import, or no imports')
        }))

        .then((newImportNode) => importNode = newImportNode)

        .then(() => convertToRequire(importNode))

        .then((requireStatement) => {
            const replacementRange = transformLocationToRange(importNode.loc);

            return getNewSourceEdit()
                .addReplacementEdit(replacementRange, requireStatement)
                .applyEdit();
        })

        .catch(function(error){
            parseAndShowMessage(error);
        });
}

module.exports = {
    convertImportToCommonjs
};