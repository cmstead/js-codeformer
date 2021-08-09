const { asyncPrepareActionSetup } = require("../../action-setup");
const { VARIABLE_DECLARATION } = require("../../constants/ast-node-types");
const { findNodeInPath } = require("../../edit-utils/node-path-utils");
const { showErrorMessage } = require("../../ui-services/messageService");

function changeVariableType() {
    let actionSetup = null;

    return asyncPrepareActionSetup()
        .then((newActionSetup) =>
            actionSetup = newActionSetup)

        .then(() => 
            findNodeInPath(actionSetup.selectionPath, VARIABLE_DECLARATION))

        .catch(function (error) {
            showErrorMessage(error.message);
        });
}

module.exports = {
    changeVariableType
};