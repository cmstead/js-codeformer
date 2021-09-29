const { asyncPrepareActionSetup } = require("../../action-setup");
const { IMPORT_DECLARATION } = require("../../constants/ast-node-types");
const { findNodeInPath } = require("../../edit-utils/node-path-utils");
const { getNewSourceEdit } = require("../../edit-utils/SourceEdit");
const { transformLocationToRange } = require("../../edit-utils/textEditTransforms");
const { buildInfoMessage, parseAndShowMessage, showInfoMessage } = require("../../ui-services/messageService");
const { validateUserInput } = require("../../validatorService");
const { validateImportNode, convertToRequire } = require("./convert-import-to-commonjs");

const conversionRequirements = 'cannot convert empty imports, or default imports';

function convertImportToCommonjs() {
    let actionSetup = null;
    let locationsSetup = null;
    let allImportNodes = null;
    let importNodes = null;

    return asyncPrepareActionSetup()
        .then((newActionSetup) => actionSetup = newActionSetup)
        .then(() => actionSetup.getLocationsSetup())
        .then((newLocationsSetup) => locationsSetup = newLocationsSetup)

        .then(() => allImportNodes = locationsSetup
            .map((locationSetup) =>
                findNodeInPath(locationSetup.selectionPath, IMPORT_DECLARATION)))

        .then(() => importNodes = allImportNodes
            .filter((node) => node !== null && validateImportNode(node)))

        .then(() => validateUserInput({
            value: importNodes,
            validator: (importNodes) => importNodes.length > 0,
            message: buildInfoMessage(`No valid imports found: ${conversionRequirements}`)
        }))

        .then(() => importNodes.map((importNode) => ({
            loc: importNode.loc,
            requireString: convertToRequire(importNode)
        })))

        .then((replacements) => {
            const sourceEdit = getNewSourceEdit();

            replacements.slice(0).reverse().forEach((replacement) => {
                const replacementRange = transformLocationToRange(replacement.loc);

                sourceEdit.addReplacementEdit(replacementRange, replacement.requireString);
            });

            return sourceEdit.applyEdit();
        })

        .then(() => {
            if (allImportNodes.length !== importNodes.length) {
                showInfoMessage(`Some imports were not converted: ${conversionRequirements}`);
            }
        })

        .catch(function (error) {
            parseAndShowMessage(error);
        });
}

module.exports = {
    convertImportToCommonjs
};