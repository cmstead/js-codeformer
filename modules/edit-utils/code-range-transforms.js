function transformSelectionToLocation(selection) {
    return {
        start: {
            line: selection.start.line + 1,
            column: selection.start.character
        },
        end: {
            line: selection.end.line + 1,
            column: selection.end.character
        }
    };
}

function transformLocationToSelection(location) {
    return {
        start: {
            line: location.start.line - 1,
            character: location.start.column
        },
        end: {
            line: location.end.line - 1,
            character: location.end.column
        }
    };
}

module.exports = {
    transformLocationToSelection,
    transformSelectionToLocation
};