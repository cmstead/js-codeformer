const { groupTitles } = require('../../../groups');
const actions = require('../../../actions');

function getGroupTitles() {
    return Object.keys(groupTitles);
}

function getActions(groupTitle) {
    const selectedGroup = groupTitles[groupTitle];

    return actions.filter(action => action.group === selectedGroup);
}

function getActionTitles(actions) {
    return actions.map(action => action.title);
}

function getActionCommandId(actionTitle) {
    const action = actions.find(action => action.title === actionTitle);

    return Boolean(action)
        ? action.commandId
        : '';
}

module.exports = {
    getActions,
    getActionCommandId,
    getActionTitles,
    getGroupTitles,
};