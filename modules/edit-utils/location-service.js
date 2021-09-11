function buildLocation(start, end) {
    const reverseOrder = start.line > end.line
        || (start.line === end.line && start.column > end.column)

    return {
        start: reverseOrder ? end : start,
        end: reverseOrder ? start : end
    }
}

function partitionOnLocation(sourceLocation, partitioningLocation) {
    return [
        buildLocation(sourceLocation.start, partitioningLocation.start),
        buildLocation(partitioningLocation.end, sourceLocation.end)
    ]
}

module.exports = {
    partitionOnLocation
};