const { getRequireBuilder, requireTypes } = require("../../builders/RequireBuilder");
const { IMPORT_NAMESPACE_SPECIFIER, IMPORT_DEFAULT_SPECIFIER } = require("../../constants/ast-node-types");

function createSpecifierRecord(specifier) {
    console.log(specifier);

    const importIsNamespace = specifier.type === IMPORT_NAMESPACE_SPECIFIER;

    const importName = importIsNamespace
        ? specifier.local.name
        : specifier.imported.name;

    const requireType = importIsNamespace
        ? requireTypes.NAMESPACE
        : requireTypes.PROPERTY;

    return {
        type: requireType,
        name: importName,
        alias: specifier.local.name
    };
}

function convertToRequire(importNode) {
    return getRequireBuilder({
        filePath: importNode.source.raw,
        imports: importNode.specifiers.map(createSpecifierRecord)
    }).buildRequire();
}

function validateImportNode(importNode) {
    return importNode.specifiers.find((node) => node.type === IMPORT_DEFAULT_SPECIFIER) === null;
}

module.exports = {
    convertToRequire,
    validateImportNode
};