function buildEditorCoordinates({ line, column }) {
    return {
        line: line,
        column: column
    };
}

function buildLocationFromEditorCoordinates({
    start: { line: startLine, column: startColumn },
    end: { line: endLine, column: endColumn }
}) {
    return {
        start: {
            line: startLine,
            column: startColumn - 1
        },
        end: {
            line: endLine,
            column: endColumn - 1
        }
    };
}

function buildSelectionLocation({ start, end }) {
    return buildLocationFromEditorCoordinates({ start, end });
}

module.exports = {
    buildEditorCoordinates,
    buildLocationFromEditorCoordinates,
    buildSelectionLocation
};