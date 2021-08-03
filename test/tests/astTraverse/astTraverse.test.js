const { assert } = require('chai');

require('../../utilities/approvals').configure();

const { loadModule } = require('../../utilities/module-loader')
const { readFileSource } = require('../../utilities/file-reader');

const { parse } = loadModule('parser/parser');
const { traverse } = loadModule('astTraverse');

describe('ast traversal', function () {
    it('doesn\'t crash on TypeScript specific nodes', function () {
        const sourceText = readFileSource(__dirname, 'fixtures/simplets.ts');

        const parsedSource = parse(sourceText, { loc: true });

        assert.doesNotThrow(() => traverse(parsedSource, {}));
    });
});