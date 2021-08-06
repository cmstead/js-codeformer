require('../../../utilities/approvals').configure();

const { MethodBuilder } = require("../../../../modules/commands/extract-to-parameter/MethodBuilder");

describe('Method Builder', function () {
    it('builds a function declaration by default', function () {
        const methodBuilder = new MethodBuilder();

        const methodText = methodBuilder.buildNewMethod();

        this.verify(methodText);
    });
});