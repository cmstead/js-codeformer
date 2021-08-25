const variableTypes = {
    CONST: 'const',
    LET: 'let',
    VAR: 'var',
    PROPERTY: 'property'
};

const variableTypeList = Object.keys(variableTypes).map(key => variableTypes[key]);

class VariableBuilder {
    constructor({
        type = variableTypes.CONST,
        name = 'newVariable',
        value = 'null'
    }) {
        this.type = type;
        this.name = name;
        this.value = value;

        this.trailingSemicolon = /.*;$/.test(value.trim())
            || type === variableTypes.PROPERTY
            ? ''
            : ';'
    }

    buildVariableDeclaration() {
        const type = this.type === variableTypes.PROPERTY
            ? ''
            : `${this.type} `;

        return `${type}${this.name} = ${this.value}${this.trailingSemicolon}`;
    }
}

function getNewVariableBuilder({ type, name, value }) {
    return new VariableBuilder({ type, name, value });
}

module.exports = {
    variableTypes,
    variableTypeList,
    VariableBuilder,
    getNewVariableBuilder
};