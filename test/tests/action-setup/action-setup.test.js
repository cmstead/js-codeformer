require('../../utilities/approvals').configure();

const { loadModule } = require('../../utilities/module-loader');
const { readFileSource } = require('../../utilities/file-reader');

const { prepareActionSetup } = loadModule('action-setup');

const { getVsCodeFake } = require('./fixtures/vscode-fake');

describe('Code action setup behavior', function () {

    it('prepares code action object from vs code module values', function () {
        const source = readFileSource(__dirname, 'fixtures/source-fake.js');
        const fakeVsCode = getVsCodeFake(source);

        const actionSetup = prepareActionSetup(fakeVsCode);

        this.verifyAsJSON(actionSetup);
    });

});