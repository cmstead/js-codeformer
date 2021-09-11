function arePositionsReversed(start, end) {
    return start.line > end.line
        || (start.line === end.line && start.column > end.column);
}

function buildLocation(start, end) {
    const reverseOrder = arePositionsReversed(start, end);

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

function splitOnAllLocations(sourceLocation, sortedPartitioningLocations) {
    const positionsAreReversed = arePositionsReversed(
        partitioningLocations[0].start,
        partitioningLocations[0].end);

    let partitioningLocations = positionsAreReversed
        ? sortedPartitioningLocations
        : sortedPartitioningLocations.slice(0).reverse();

    return partitioningLocations.reduce((partitionedLocations, partitioningLocation) => {
        const locationToPartition = partitionedLocations[0];
        const newPartition = partitionOnLocation(locationToPartition, partitioningLocation);

        return newPartition.concat(partitionedLocations.slice(1));
    }, [sourceLocation]);
}

module.exports = {
    buildLocation,
    partitionOnLocation,
    splitOnAllLocations
};