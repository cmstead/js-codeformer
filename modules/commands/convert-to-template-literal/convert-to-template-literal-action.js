const { asyncPrepareActionSetup } = require("../../action-setup");
const { getNewSourceEdit } = require("../../edit-utils/SourceEdit");
const { transformLocationToRange } = require("../../edit-utils/textEditTransforms");
const { buildInfoMessage, parseAndShowMessage, showInfoMessage } = require("../../ui-services/messageService");
const { validateUserInput } = require("../../validatorService");
const { checkExpressionTree, buildTemplateLiteral, findNearestExpressionToConvert } = require("./convert-to-template-literal");

function convertToTemplateLiteral() {
    let actionSetup = null;
    let allFoundLocations = null;
    let convertableNodes = null;

    return asyncPrepareActionSetup()
        .then((newActionSetup) => actionSetup = newActionSetup)

        .then(({ getLocationsSetup }) => getLocationsSetup())

        .then((locationsSetup) => allFoundLocations = locationsSetup
            .map((locationSetup) =>
                findNearestExpressionToConvert(locationSetup.selectionPath))
            .filter((node) => node !== null))

        .then(() => convertableNodes = allFoundLocations.filter((node) => checkExpressionTree(node)))

        .then(() => validateUserInput({
            value: convertableNodes,
            validator: (convertableNodes) => convertableNodes.length > 0,
            message: buildInfoMessage(`No expressions found to convert.`)
        }))

        .then(() => convertableNodes.map((node) => ({
            replacementRange: transformLocationToRange(node.loc),
            replacementString: '`' + buildTemplateLiteral(node, actionSetup.source) + '`'
        })))

        .then((convertedNodes) => {
            const sourceEdit = getNewSourceEdit();

            convertedNodes.forEach((convertedNode) =>
                sourceEdit.addReplacementEdit(convertedNode.replacementRange, convertedNode.replacementString));

            return sourceEdit.applyEdit();
        })

        .then(() => {
            if(allFoundLocations.length !== convertableNodes.length) {
                showInfoMessage('Not all selections could be converted');
            }
        })

        .catch(function (error) {
            parseAndShowMessage(error);
        });
}

module.exports = {
    convertToTemplateLiteral
}