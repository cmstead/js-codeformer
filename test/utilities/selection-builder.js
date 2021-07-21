function buildEditorCoordinates({ line, column }) {
    return {
        line: line,
        column: column
    };
}

function buildSelectionFromEditorCoordinates({ start, end }) {
    return {
        start: {
            line: start.line,
            column: start.column - 1
        },
        end: {
            line: end.line,
            column: end.column - 1
        }
    };
}

module.exports = {
    buildEditorCoordinates,
    buildSelectionFromEditorCoordinates
};