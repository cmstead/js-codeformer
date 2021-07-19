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

module.exports = {
    transformSelectionToLocation
};