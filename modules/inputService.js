const {
    window: {
        showInputBox,
        showQuickPick
    },
} = require('./vscodeService').getVscode();

function openSelectList({ values, title }) {
    return showQuickPick(values, {
        title: title,
        ignoreFocusOut: true
    });
}

function openInputBox({ title, value = '' }) {
    return showInputBox({
        title: title,
        value: value,
        ignoreFocusOut: true
    })
}

module.exports = {
    openSelectList,
    openInputBox
};