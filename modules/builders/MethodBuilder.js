const {
    FUNCTION_DECLARATION,
    FUNCTION_EXPRESSION,
    METHOD_DEFINITION,
    ARROW_FUNCTION_EXPRESSION,
    RETURN_STATEMENT,
    OBJECT_EXPRESSION
} = require("../constants/ast-node-types");
const { parse } = require("../parser/parser");
const { getSourceSelection } = require("../source-utilities");

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
        async = false
    }) {
        this.functionType = functionType;
        this.functionName = functionName;
        this.functionParameters = functionParameters;
        this.functionBody = functionBody;
        this.asyncPrefix = async ? 'async ' : '';
    }

    buildFunctionDeclaration() {
        return `${this.asyncPrefix}function ${this.functionName} (${this.functionParameters}) {
            ${this.functionBody}
        }`;
    }

    buildFunctionExpression() {
        return `${this.asyncPrefix}function (${this.functionParameters}) {
            ${this.functionBody}
        }`;
    }

    buildClassMethod() {
        return `${this.asyncPrefix}${this.functionName} (${this.functionParameters}) {
            ${this.functionBody}
        }`;
    }

    buildObjectMethod() {
        return `${this.asyncPrefix}${this.functionName}: function (${this.functionParameters}) {
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

    getSingleLineArrowBody(parsedBody) {
        const argument = parsedBody.body[0].argument;
        const argumentLocation = argument.loc;
        const arrowSource = getSourceSelection(this.functionBody, argumentLocation);
        return argument.type === OBJECT_EXPRESSION
                ? `(${arrowSource})`
                : arrowSource;
    }
    buildArrowFunction() {
        const parsedBody = parse(this.functionBody);

        if (this.isSingleLine(parsedBody)
            && this.isNotEmpty(this.functionBody)
            && this.isReturnStatement(parsedBody)) {

            return `${this.asyncPrefix}(${this.functionParameters}) => ${this.getSingleLineArrowBody(parsedBody)}`;
        } else {
            return `${this.asyncPrefix}(${this.functionParameters}) => {
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
    functionBody,
    async
}) {
    return new MethodBuilder({ functionType, functionName, functionParameters, functionBody, async });
}

module.exports = {
    getMethodBuilder,
    MethodBuilder,
    methodTypes
}