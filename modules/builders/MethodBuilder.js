const {
    FUNCTION_DECLARATION,
    FUNCTION_EXPRESSION,
    METHOD_DEFINITION,
    ARROW_FUNCTION_EXPRESSION,
    RETURN_STATEMENT,
    OBJECT_EXPRESSION,
    EMPTY_STATEMENT
} = require("../constants/ast-node-types");
const { getNodeType, first } = require("../core-utils");
const { parse } = require("../parser/parser");
const { getSourceSelection } = require("../source-utilities");

const methodTypes = {
    FUNCTION_DECLARATION: FUNCTION_DECLARATION,
    FUNCTION_EXPRESSION: FUNCTION_EXPRESSION,
    METHOD_DEFINITION: METHOD_DEFINITION,
    OBJECT_METHOD: 'ObjectMethod',
    ARROW_FUNCTION_EXPRESSION: ARROW_FUNCTION_EXPRESSION
};

const arrowFunctionBuildTypes = {
    AS_MULTILINE: 'multiline',
    AS_STANDARD: 'standard'
}

class MethodBuilder {
    constructor({
        functionBody = '',
        functionName = 'newMethod',
        functionParameters = '',
        functionType = FUNCTION_DECLARATION,
        async = false,
        generator = false
    }) {
        this.functionType = functionType;
        this.functionName = functionName;
        this.functionParameters = functionParameters;
        this.functionBody = functionBody;
        this.asyncPrefix = async ? 'async ' : '';
        this.generatorInfix = generator ? '*' : '';
    }

    buildFunctionDeclaration() {
        return [
            `${this.asyncPrefix}function${this.generatorInfix} ${this.functionName} (${this.functionParameters}) {`,
            `\t${this.functionBody}`,
            `}`
        ].join('\n');
    }

    buildFunctionExpression() {
        return [
            `${this.asyncPrefix}function${this.generatorInfix} (${this.functionParameters}) {`,
            `\t${this.functionBody}`,
            `}`
        ].join('\n');
    }

    buildClassMethod() {
        return [
            `${this.asyncPrefix}${this.functionName}${this.generatorInfix} (${this.functionParameters}) {`,
            `\t${this.functionBody}`,
            `}`
        ].join('\n');
    }

    buildObjectMethod() {
        return [
            `${this.asyncPrefix}${this.functionName}: function${this.generatorInfix} (${this.functionParameters}) {`,
            `\t${this.functionBody}`,
            `},`
        ].join('\n');
    }

    isReturnStatement(bodyLines) {
        const bodyNode = first(bodyLines);

        return typeof bodyNode !== 'undefined'
            && getNodeType(bodyNode) === RETURN_STATEMENT;
    }

    isNotEmpty(functionBody) {
        return functionBody.trim() !== '';
    }

    isSingleLine(bodyLines) {
        return bodyLines.length === 1;
    }

    getSingleLineArrowBody(bodyLines) {
        const argument = first(bodyLines).argument;
        const argumentLocation = argument.loc;
        const arrowSource = getSourceSelection(this.functionBody, argumentLocation);
        return getNodeType(argument) === OBJECT_EXPRESSION
            ? `(${arrowSource})`
            : arrowSource;
    }

    getMultilineArrowBody(bodyLines, buildAsMultiline) {
        return this.isSingleLine(bodyLines)
            && !this.isReturnStatement(bodyLines)
            && buildAsMultiline
            ? `return ${this.functionBody}`
            : this.functionBody;
    }

    buildArrowFunction(arrowFunctionType = arrowFunctionBuildTypes.AS_STANDARD) {
        const sanitizedBodyLines = parse(this.functionBody).body
            .filter(node => getNodeType(node) !== EMPTY_STATEMENT);
        const buildAsMultiline = arrowFunctionType === arrowFunctionBuildTypes.AS_MULTILINE;

        if (this.isSingleLine(sanitizedBodyLines)
            && this.isNotEmpty(this.functionBody)
            && this.isReturnStatement(sanitizedBodyLines)
            && !buildAsMultiline) {

            return `${this.asyncPrefix}(${this.functionParameters}) => ${this.getSingleLineArrowBody(sanitizedBodyLines)}`;
        } else {
            return `${this.asyncPrefix}(${this.functionParameters}) => {
                ${this.getMultilineArrowBody(sanitizedBodyLines, buildAsMultiline)}
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
    async,
    generator
}) {
    return new MethodBuilder({
        functionType,
        functionName,
        functionParameters,
        functionBody,
        async,
        generator
    });
}

module.exports = {
    getMethodBuilder,
    MethodBuilder,
    methodTypes,
    arrowFunctionBuildTypes
}