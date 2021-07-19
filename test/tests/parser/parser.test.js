require('../../utilities/approvals').configure();

const { loadModule } = require('../../utilities/module-loader')
const { readFileSource } = require('../../utilities/file-reader');

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

    it('parses javascript embedded in HTML', function () {
        const testSource = readFileSource(__dirname, 'fixtures/js-in-html.html');

        const parsedSource = parse(testSource);

        this.verifyAsJSON(parsedSource);
    });

    it('parses javascript with a node shebang', function () {
        const testSource = readFileSource(__dirname, 'fixtures/shebang-js.js');

        const parsedSource = parse(testSource);

        this.verifyAsJSON(parsedSource);
    });
});