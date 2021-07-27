const vscodeService = require('../../vscodeService');

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

module.exports = {
    transformLocationPartToPosition,
    transformLocationToRange
};