const {
    FUNCTION_DECLARATION,
    FUNCTION_EXPRESSION,
    METHOD_DEFINITION,
    ARROW_FUNCTION_EXPRESSION,
    RETURN_STATEMENT
} = require("../constants/ast-node-types");
const { parse } = require("../parser/parser");

const methodTypes = {
    FUNCTION_DECLARATION: FUNCTION_DECLARATION,
    FUNCTION_EXPRESSION: FUNCTION_EXPRESSION,
    METHOD_DEFINITION: METHOD_DEFINITION,
    OBJECT_METHOD: 'ObjectMethod',
    ARROW_FUNCTION_EXPRESSION: ARROW_FUNCTION_EXPRESSION
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
        }`;
    }

    buildObjectMethod() {
        return `${this.functionName}: function (${this.functionParameters}) {
            ${this.functionBody}
        }`;
    }

    isReturnStatement(parsedBody) {
        const bodyNode = parsedBody.body[0];

        return typeof bodyNode !== 'undefined'
            && bodyNode.type === RETURN_STATEMENT;
    }

    isNotEmpty(functionBody) {
        return functionBody.trim() !== '';
    }

    isSingleLine(parsedBody) {
        return parsedBody.body.length === 1;
    }

    buildArrowFunction() {
        const parsedBody = parse(this.functionBody);

        if (this.isSingleLine(parsedBody) 
            && this.isNotEmpty(this.functionBody)
            && this.isReturnStatement(parsedBody)) {
            return `(${this.functionParameters}) => ${this.functionBody}`;
        } else {
            return `(${this.functionParameters}) => {
                ${this.functionBody}
            }`;
        }
    }

    buildNewMethod() {
        if (this.functionType === methodTypes.FUNCTION_EXPRESSION) {
            return this.buildFunctionExpression();
        } else if (this.functionType === methodTypes.METHOD_DEFINITION) {
            return this.buildClassMethod();
        } else if (this.functionType === methodTypes.OBJECT_METHOD) {
            return this.buildObjectMethod();
        } else if (this.functionType === methodTypes.ARROW_FUNCTION_EXPRESSION) {
            return this.buildArrowFunction();
        } else {
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