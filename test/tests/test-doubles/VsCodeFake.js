const { VsCodeSelection } = require("./VsCodeSelection");

class ActiveTextEditor {
    constructor({ sourceCode = '', selection = new VsCodeSelection() }) {
        this.sourceCode = sourceCode;
        this.selection = selection;
    }

    get document() {
        return {
            getText: () => this.sourceCode
        }
    }

    updateSelectionStart(selectionStart) {
        this.selection.updateStart(selectionStart);
    }

    updateSelectionEnd(selectionEnd) {
        this.selection.updateEnd(selectionEnd);
    }
}

class VsCodeFake {
    constructor({ sourceCode = '', selection = new VsCodeSelection() }) {
        this.activeTextEditor = new ActiveTextEditor({ sourceCode, selection });
        this.selection = selection;
    }

    get window() {
        return {
            activeTextEditor: this.activeTextEditor
        }
    }

    updateSelectionStart(selectionStart) {
        this.activeTextEditor.updateSelectionStart(selectionStart);
    }

    updateSelectionEnd(selectionEnd) {
        this.activeTextEditor.updateSelectionEnd(selectionEnd);
    }
}

function getVsCodeFake({ sourceCode = '', selection = new VsCodeSelection() }) {
    return new VsCodeFake({ sourceCode, selection });
}

module.exports = {
    VsCodeFake,
    getVsCodeFake
}