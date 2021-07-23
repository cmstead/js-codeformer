class EditorCoordinates {
    constructor(line = 0, column = 0) {
        this.line = line,
            this.column = column;
    }
}

class EditorSelection{
    constructor(start = new EditorCoordinates(), end = new EditorCoordinates()){
        this.start = start;
        this.end = end;
    }
}

function buildEditorCoordinates({ line, column }) {
    return new EditorCoordinates(line, column);
}

function buildLocationFromEditorCoordinates({
    start = new EditorCoordinates(),
    end = new EditorCoordinates()
}) {
    return {
        start: new EditorCoordinates(start.line, start.column - 1),
        end: new EditorCoordinates(end.line, end.column - 1)
    };
}

function buildSelectionLocation(selection = new EditorSelection()) {
    return buildLocationFromEditorCoordinates(selection);
}

module.exports = {
    buildEditorCoordinates,
    buildLocationFromEditorCoordinates,
    buildSelectionLocation
};