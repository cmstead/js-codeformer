require('../../utilities/approvals').configure();

const methodBuilderModule = require("../../../modules/builders/MethodBuilder");
const {
    FUNCTION_EXPRESSION,
    METHOD_DEFINITION,
    OBJECT_METHOD,
    ARROW_FUNCTION_EXPRESSION
} = methodBuilderModule.methodTypes;
const { MethodBuilder } = methodBuilderModule;

describe('Method Builder', function () {
    it('builds a function declaration by default', function () {
        const methodBuilder = new MethodBuilder({});

        const methodText = methodBuilder.buildNewMethod();

        this.verify(methodText);
    });

    it('builds a complete function declaration',  function () {
        const methodBuilder = new MethodBuilder({
            functionName: 'testFunction',
            functionParameters: 'a, b',
            functionBody: 'return a + b;'
        });

        const methodText = methodBuilder.buildNewMethod();

        this.verify(methodText);
    });

    it('builds a function expression when type is function expression',  function () {
        const methodBuilder = new MethodBuilder({
            functionParameters: 'a, b, c',
            functionBody: 'return a * b * c;',
            functionType: FUNCTION_EXPRESSION
        });

        const methodText = methodBuilder.buildNewMethod();

        this.verify(methodText);
    });

    it('builds a class method when type is method',  function () {
        const methodBuilder = new MethodBuilder({
            functionParameters: 'a',
            functionBody: 'return a;',
            functionType: METHOD_DEFINITION
        });

        const methodText = methodBuilder.buildNewMethod();

        this.verify(methodText);
    });

    it('builds an object method when type is ObjectMethod',  function () {
        const methodBuilder = new MethodBuilder({
            functionParameters: 'a',
            functionBody: 'return a;',
            functionType: OBJECT_METHOD
        });

        const methodText = methodBuilder.buildNewMethod();

        this.verify(methodText);
    });

    it('builds a single-line arrow function when type is arrow function expression, and body is a single expression', function () {
        const methodBuilder = new MethodBuilder({
            functionParameters: 'a',
            functionBody: 'return a;',
            functionType: ARROW_FUNCTION_EXPRESSION
        });

        const methodText = methodBuilder.buildNewMethod();

        this.verify(methodText);
    });

    it('builds an arrow function with block body when type is arrow function expression, and body is a single non-return expression', function () {
        const methodBuilder = new MethodBuilder({
            functionParameters: 'a',
            functionBody: 'console.log(a);',
            functionType: ARROW_FUNCTION_EXPRESSION
        });

        const methodText = methodBuilder.buildNewMethod();

        this.verify(methodText);
    });

    it('Arrow function adds paretheses when body is a returned object literal', function () {
        const methodBuilder = new MethodBuilder({
            functionParameters: 'a',
            functionBody: 'return { foo: a };',
            functionType: ARROW_FUNCTION_EXPRESSION
        });

        const methodText = methodBuilder.buildNewMethod();

        this.verify(methodText);
    });

    it('builds a multiline arrow function when type is arrow function expression and body is multi-expression',  function () {
        const methodBuilder = new MethodBuilder({
            functionParameters: 'a',
            functionBody: 'const b = a * 3; return b;',
            functionType: ARROW_FUNCTION_EXPRESSION
        });

        const methodText = methodBuilder.buildNewMethod();

        this.verify(methodText);
    });
});