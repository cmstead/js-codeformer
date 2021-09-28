class RequireBuilder {
    constructor({ filePath, imports }) {
        this.filePath = filePath;
        this.imports = imports;
    }

    getImports() {
        return this.imports.map((importValue) =>
            importValue.name === importValue.alias
                ? importValue.name
                : `${importValue.name}: ${importValue.alias}`)
                .join(', ');
    }

    buildRequire() {
        return `const { ${this.getImports()} } = require(${this.filePath})`;
    }
}

function getRequireBuilder({ filePath, imports }) {
    return new RequireBuilder({ filePath, imports });
}

module.exports = {
    getRequireBuilder
};