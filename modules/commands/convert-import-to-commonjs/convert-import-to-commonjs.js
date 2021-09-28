const { getRequireBuilder } = require("../../builders/RequireBuilder");

function createSpecifierRecord(specifier) {
    return {
        name: specifier.imported.name,
        alias: specifier.local.name
    };
}

function convertToRequire(importNode) {
    return getRequireBuilder({
        filePath: importNode.source.raw,
        imports: importNode.specifiers.map(createSpecifierRecord)
    }).buildRequire();
}

module.exports = {
    convertToRequire
};