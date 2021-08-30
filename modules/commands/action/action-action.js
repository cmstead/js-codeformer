const { openSelectList } = require("../../ui-services/inputService");
const { showErrorMessage } = require("../../ui-services/messageService");
const { validateUserInput } = require("../../validatorService");
const { getActionTitles, findCommandIdByTitle } = require("./action");

const vscode = require('../../vscodeService').getVscode()

function action() {
    const actionList = getActionTitles();

    return openSelectList({
        values: actionList,
        title: 'Which action do you want to run?'
    })
        .then((selectedTitle) => validateUserInput({
            value: selectedTitle,
            validator: (selectedTitle) => selectedTitle !== null && selectedTitle !== '',
            message: 'No action selected; canceling action'
        }))

        .then((selectedTitle) => findCommandIdByTitle(selectedTitle))
        .then((commandId) => vscode.commands.executeCommand(commandId))

        .catch(function (error) {
            showErrorMessage(error.message);
        });
}

module.exports = {
    action
};