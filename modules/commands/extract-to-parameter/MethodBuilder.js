const { FUNCTION_DECLARATION } = require("../../constants/ast-node-types");

class MethodBuilder {
    constructor(
        functionType = FUNCTION_DECLARATION,
        functionName = 'newMethod',
        functionParameters = '',
        functionBody = ''
    ) {
        this.functionType = functionType;
        this.functionName = functionName;
        this.functionParameters = functionParameters;
        this.functionBody = functionBody;
    }

    buildFunctionDeclaration() {
        return `function ${this.functionName} () {

        }`;
    }

    buildNewMethod() {
        return this.buildFunctionDeclaration()
    }
}

function getMethodBuilder({
    functionType,
    functionName,
    functionParameters,
    functionBody
}) {
    return new MethodBuilder(functionType, functionName, functionParameters, functionBody);
}

module.exports = {
    MethodBuilder,
    getMethodBuilder
}