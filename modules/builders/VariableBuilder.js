const variableTypes = {
    CONST: 'const',
    LET: 'let',
    VAR: 'var'
};

const variableTypeList = Object.keys(variableTypes).map(key => variableTypes[key]);

class VariableBuilder{
    constructor ({
        type = variableTypes.CONST,
        name = 'newVariable',
        value = 'null'
    }) {
        this.type = type;
        this.name = name;
        this.value = value;

        this.trailingSemicolon = /.*;$/.test(value.trim()) ? '' : ';'
    }

    buildVariableDeclaration() {
        return `${this.type} ${this.name} = ${this.value}${this.trailingSemicolon}`;
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