const { getRequireBuilder } = require("../../builders/RequireBuilder");

function convertToRequire(importNode) {
    return getRequireBuilder({
        filePath: importNode.source.raw,
        imports: [
            {
                name: importNode.specifiers[0].imported.name,
                alias: importNode.specifiers[0].local.name
            },
            {
                name: importNode.specifiers[1].imported.name,
                alias: importNode.specifiers[1].local.name
            }
        ]
    }).buildRequire();
}

module.exports = {
    convertToRequire
};