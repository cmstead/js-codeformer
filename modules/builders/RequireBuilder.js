const requireTypes = {
    NAMESPACE: 'namespace',
    PROPERTY: 'property'
};

class RequireBuilder {
    constructor({ filePath, imports }) {
        this.filePath = filePath;
        this.imports = imports;
        this.importType = imports[0].type;
    }

    getImports() {
        return this.imports.map((importValue) =>
            importValue.name === importValue.alias
                ? importValue.name
                : `${importValue.name}: ${importValue.alias}`)
                .join(', ');
    }

    buildRequire() {
        const variableString = this.importType === requireTypes.NAMESPACE
            ? this.imports[0].name
            : `{ ${this.getImports()} }`;

        return `const ${variableString} = require(${this.filePath})`;
    }
}

function getRequireBuilder({ filePath, imports }) {
    return new RequireBuilder({ filePath, imports });
}

module.exports = {
    getRequireBuilder,
    requireTypes
};