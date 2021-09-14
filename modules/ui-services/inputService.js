const {
    window: {
        showQuickPick
    },
} = require('../vscodeService').getVscode();

function openSelectList({ values, title }) {
    return showQuickPick(values, {
        title: title,
        ignoreFocusOut: true
    });
}

module.exports = {
    openSelectList
};