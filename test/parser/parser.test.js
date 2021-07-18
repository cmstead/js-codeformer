require('../utilities/approvals').configure();

const { loadModule } = require('../utilities/module-loader')
const { readFileSource } = require('../utilities/file-reader');

const { parse } = loadModule('parser');

describe('source parser', function () {
    it('parses plain old javascript source', function () {
        const testSource = readFileSource(__dirname, 'fixtures/simplejs.js');

        const parsedSource = parse(testSource);

        this.verifyAsJSON(parsedSource);
    });

    it('parses plain old typescript source', function () {
        const testSource = readFileSource(__dirname, 'fixtures/simplets.ts');

        const parsedSource = parse(testSource);

        this.verifyAsJSON(parsedSource);
    });
});