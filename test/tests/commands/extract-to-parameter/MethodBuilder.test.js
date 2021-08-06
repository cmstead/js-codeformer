require('../../../utilities/approvals').configure();

const { MethodBuilder } = require("../../../../modules/commands/extract-to-parameter/MethodBuilder");
const { FUNCTION_EXPRESSION } = require('../../../../modules/constants/ast-node-types');

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

    it('builds a function expression on matching function type',  function () {
        const methodBuilder = new MethodBuilder({
            functionParameters: 'a, b, c',
            functionBody: 'return a * b * c;',
            functionType: FUNCTION_EXPRESSION
        });

        const methodText = methodBuilder.buildNewMethod();

        this.verify(methodText);
    });
});