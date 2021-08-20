function locationToSourceSelection({ start, end }) {
    return {
        startLine: start.line - 1,
        endLine: end.line - 1,
        startColumn: start.column,
        endColumn: end.column
    };
}

function getSourceSelection(sourceCode, location) {
    const {
        startLine,
        endLine,
        startColumn,
        endColumn
    } = locationToSourceSelection(location);

    const selectedLines = sourceCode.split('\n').slice(startLine, endLine + 1);

    if(selectedLines.length === 0) {
        return '';
    } else if (selectedLines.length === 1) {
        return selectedLines[0].slice(startColumn, endColumn)
    } else {
        const lastIndex = selectedLines.length - 1;

        selectedLines[0] = selectedLines[0].slice(startColumn);
        selectedLines[lastIndex] = selectedLines[lastIndex].slice(0, endColumn);

        return selectedLines.join('\n');
    }

}

module.exports = {
    getSourceSelection,
    locationToSourceSelection
};