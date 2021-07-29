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

function openInputBox(title) {
    return showInputBox({
        title: title,
        ignoreFocusOut: true
    })
}

module.exports = {
    openSelectList,
    openInputBox
};