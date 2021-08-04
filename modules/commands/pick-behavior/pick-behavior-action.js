const { openSelectList } = require('../../ui-services/inputService');
const { showErrorMessage } = require('../../ui-services/messageService');
const { validateUserInput } = require('../../validatorService');

const { getGroupTitles, getActions, getActionTitles, getActionCommandId } = require('./pick-behavior');

const vscode = require('../../vscodeService').getVscode();

function pickBehavior() {
    return openSelectList({
        values: getGroupTitles(),
        title: 'JS CodeFormer: Pick behavior type'
    })
        .then((title) => validateUserInput({
            value: title,
            validator: title => title !== '',
            message: 'No action type selected: canceling action selection'
        }))

        .then((groupTitle) => getActions(groupTitle))
        .then((actions) => getActionTitles(actions))
        .then((actionTitles) => openSelectList({
            values: actionTitles,
            title: 'What do you want to do?'
        }))
        .then((actionTitle) => validateUserInput({
            value: actionTitle,
            validator: actionTitle => actionTitle !== '',
            message: 'No action selected: canceling action execution'
        }))

        .then((actionTitle) => getActionCommandId(actionTitle))
        .then((actionCommandId) => validateUserInput({
            value: actionCommandId,
            validator: actionCommandId => actionCommandId !== '',
            message: 'Selected action is not a valid action.'
        }))

        .then((actionCommandId) => vscode.commands.executeCommnd(actionCommandId))

        .catch(function (error) {
            showErrorMessage(error.message);
        });
}

module.exports = {
    pickBehavior
};