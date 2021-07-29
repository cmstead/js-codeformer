const { WorkspaceEdit, window, workspace } = require("./vscodeService").getVscode();

class SourceEdit{
    constructor(){
        this.workspaceEdit = new WorkspaceEdit();
        this.uri = window.activeTextEditor.document.uri;
    }

    addInsertEdit(insertPosition, textToInsert) {
        this.workspaceEdit.insert(this.uri, insertPosition, textToInsert);

        return this;
    }

    addReplacementEdit(replacementRange, replacementText) {
        this.workspaceEdit.replace(this.uri, replacementRange, replacementText);

        return this;
    }

    applyEdit(){
        return workspace.applyEdit(this.workspaceEdit);
    }
}

function getNewSourceEdit() {
    return new SourceEdit();
}

module.exports = {
    getNewSourceEdit,
    SourceEdit
};