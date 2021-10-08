function arePositionsReversed(start, end) {
    return start.line > end.line
        || (start.line === end.line && start.column > end.column);
}

function areLocationsEqual(location1, location2) {
    return location1.start.line === location2.start.line
        && location1.start.column === location2.start.column
        && location1.end.line === location2.end.line
        && location1.end.column === location2.end.column;
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
        sortedPartitioningLocations[0].start,
        sortedPartitioningLocations[0].end);

    let partitioningLocations = positionsAreReversed
        ? sortedPartitioningLocations
        : sortedPartitioningLocations.slice(0).reverse();

    return partitioningLocations.reduce((partitionedLocations, partitioningLocation) => {
        const locationToPartition = partitionedLocations[0];
        const newPartition = partitionOnLocation(locationToPartition, partitioningLocation);

        return newPartition.concat(partitionedLocations.slice(1));
    }, [sourceLocation]);
}

function compareLocations(location1, location2) {
    const start1 = location1.start;
    const start2 = location2.start;

    const location1IsGreater = start1.line > start2.line
        || (start1.line === start2.line
            && start1.column > start2.column);

    const locationsAreEqual = start1.line === start2.line
        && start1.column === start2.column;

    if (location1IsGreater) {
        return 1;
    } else if (locationsAreEqual) {
        return 0;
    } else {
        return -1;
    }
}

module.exports = {
    areLocationsEqual,
    buildLocation,
    compareLocations,
    partitionOnLocation,
    splitOnAllLocations
};