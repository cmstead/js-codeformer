const vscodeService = require('../vscodeService');

const {
    Position,
    Range,
} = vscodeService.getVscode();


function transformLocationPartToPosition({ line, column }) {
    return new Position(line - 1, column);
}


function transformLocationToRange({ start, end }) {
    return new Range(
        transformLocationPartToPosition(start),
        transformLocationPartToPosition(end)
    );
}


function buildEditLocations({
    actionSetup: { location: selectionLocation },
    extractionLocation
}) {
    const extractionLocationStart = extractionLocation.start;

    return {
        extractionPosition: transformLocationPartToPosition(extractionLocationStart),
        replacementRange: transformLocationToRange(selectionLocation)
    }

}


module.exports = {
    buildEditLocations,
    transformLocationPartToPosition,
    transformLocationToRange
};