require('../../utilities/approvals').configure();

const { readFileSource } = require('../../utilities/file-reader');
const { loadModule } = require('../../utilities/module-loader');

const { parse } = loadModule('parser/parser');
const { buildNodePath } = loadModule('node-path');

describe('node path builder', function () {
    it('builds an array of parent nodes to selection', function () {
        const fileSource = readFileSource(__dirname, 'fixtures/nested-nodes.js');

        const parsedSource = parse(fileSource);

        const selection = {
            "end": {
                "column": 21,
                "line": 7
            },
            "start": {
                "column": 20,
                "line": 7
            }
        };

        const nodePath = buildNodePath(parsedSource, selection);

        this.verifyAsJSON(nodePath.map(node => node.type));
    });
});