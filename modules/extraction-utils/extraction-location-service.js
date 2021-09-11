const { buildLocation } = require("../edit-utils/location-service");

function selectExtractionLocation(nodePath, extractionBlock) {
    let extractionNode = null;

    for (let i = 0; i < nodePath.length; i++) {
        if (nodePath[i] === extractionBlock) {
            extractionNode = nodePath[i + 1];
            break;
        }
    }

    return extractionNode.loc;
}


function retrieveExtractionLocation(extractionPoint) {
    return extractionPoint.extractionScope[0];
}

function buildCopyLocation(extractionPoint, selectedLocation) {
    return buildLocation(
        extractionPoint.start,
        selectedLocation.start
    );
}

function buildInsertionLocation(extractionPoint, selectedLocation) {
    return buildLocation(
        extractionPoint.start,
        selectedLocation.end
    );
}

module.exports = {
    buildCopyLocation,
    buildInsertionLocation,
    retrieveExtractionLocation,
    selectExtractionLocation
};