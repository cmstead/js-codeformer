const { FUNCTION_DECLARATION, FUNCTION_EXPRESSION } = require("../../constants/ast-node-types");

class MethodBuilder {
    constructor({
        functionBody = '',
        functionName = 'newMethod',
        functionParameters = '',
        functionType = FUNCTION_DECLARATION,
    }) {
        this.functionType = functionType;
        this.functionName = functionName;
        this.functionParameters = functionParameters;
        this.functionBody = functionBody;
    }

    buildFunctionDeclaration() {
        return `function ${this.functionName} (${this.functionParameters}) {
            ${this.functionBody}
        }`;
    }

    buildFunctionExpression() {
        return `function (${this.functionParameters}) {
            ${this.functionBody}
        }`;
    }

    buildNewMethod() {
        if(this.functionType === FUNCTION_EXPRESSION) {
            return this.buildFunctionExpression();
        }
        return this.buildFunctionDeclaration()
    }
}

function getMethodBuilder({
    functionType,
    functionName,
    functionParameters,
    functionBody
}) {
    return new MethodBuilder({ functionType, functionName, functionParameters, functionBody });
}

module.exports = {
    MethodBuilder,
    getMethodBuilder
}