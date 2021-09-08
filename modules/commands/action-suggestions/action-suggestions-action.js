const { asyncPrepareActionSetup } = require('../../action-setup');
const actions = require('../../../actions');
const { groups, groupOrder } = require('../../../groups');
const { parseAndShowMessage } = require('../../ui-services/messageService');
const { openSelectList } = require('../../ui-services/inputService');
const { validateUserInput } = require('../../validatorService');

const vscode = require('../../vscodeService').getVscode();

function actionSuggestions() {
    let actionSetup = null;
    let suggestedActions = null;
    let actionCommandMap = null;

    return asyncPrepareActionSetup()
        .then((newActionSetup) => actionSetup = newActionSetup)

        .then(() => actions
            .filter(action =>
                action.group !== groups.NONE
                && typeof action.analyzer === 'function'
                && action.analyzer(actionSetup)))

        .then((filteredActions) => suggestedActions = filteredActions)

        .then(() => suggestedActions.sort((action1, action2) => {
            const group1Index = groupOrder[action1.group];
            const group2Index = groupOrder[action2.group];

            if(group1Index !== group2Index) {
                return group1Index - group2Index;
            } else if(action1.name < action2.name) {
                return 1;
            } else if(action1.name > action2.name) {
                return -1;
            }

            return 0;
        }))

        .then(() => actionCommandMap = suggestedActions.reduce((map, action) => {
            map[action.name] = action.commandId;

            return map;
        }, {}))

        .then(() => openSelectList({
            values: Object.keys(actionCommandMap),
            title: 'What would you like to do?'
        }))
        .then((selectedAction) => validateUserInput({
            value: selectedAction,
            validator: selectedAction => selectedAction.trim() !== '',
            message: 'No action selected'
        }))
        .then((selectedAction) => {
            const selectedCommandId = actionCommandMap[selectedAction];
            
            return vscode.commands.executeCommand(selectedCommandId);
        })

        .catch(function (error) {
            parseAndShowMessage(error);
        });
}

module.exports = {
    actionSuggestions
};