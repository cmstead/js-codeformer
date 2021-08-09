const actions = require('../../../actions');
const { groups: { CONVERSIONS } } = require('../../../groups');

function getActionTitles() {
    return actions
        .filter(action => action.group === CONVERSIONS)
        .map(action => action.title);
}

function findCommandIdByTitle(actionTitle) {
    return actions
        .filter(action =>
            action.title === actionTitle)[0].commandId;
}

module.exports = {
    getActionTitles,
    findCommandIdByTitle
}