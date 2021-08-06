const { FUNCTION_DECLARATION, FUNCTION_EXPRESSION, METHOD_DEFINITION } = require("../../constants/ast-node-types");

const methodTypes = {
    FUNCTION_DECLARATION: FUNCTION_DECLARATION,
    FUNCTION_EXPRESSION: FUNCTION_EXPRESSION,
    METHOD_DEFINITION: METHOD_DEFINITION,
    OBJECT_METHOD: 'ObjectMethod'
};

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

    buildClassMethod() {
        return `${this.functionName} (${this.functionParameters}) {
            ${this.functionBody}
        }`
    }

    buildObjectMethod() {
        return `${this.functionName}: function (${this.functionParameters}) {
            ${this.functionBody}
        }`
    }

    buildNewMethod() {
        if(this.functionType === methodTypes.FUNCTION_EXPRESSION) {
            return this.buildFunctionExpression();
        } else if (this.functionType === methodTypes.METHOD_DEFINITION) {
            return this.buildClassMethod();
        } else if(this.functionType === methodTypes.OBJECT_METHOD) {
            return this.buildObjectMethod();
        }else {
            return this.buildFunctionDeclaration()
        }
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
    getMethodBuilder,
    MethodBuilder,
    methodTypes
}