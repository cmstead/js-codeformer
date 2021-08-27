const jsonc = require('jsonc-parser');

const { getTemplateList, getLanguageSnippetName, getSnippetText } = require("../../../../modules/commands/surround-with/surround-with");
const { readFileSource } = require("../../../utilities/file-reader");

require('../../../utilities/approvals').configure();

describe('surround with behavior support functions', function () {
    describe('get template list', function () {
        it('returns the template list correctly', function () {
            const fixtureText = readFileSource(__dirname, 'fixtures/test-fixture.json');
            const testSnippets = jsonc.parse(fixtureText);
            const templateList = getTemplateList(testSnippets);

            this.verifyAsJSON(templateList);
        });
    });

    describe('get language snippet name', function () {
        it('returns javascript for language ids: javascript, javascriptreact, jsx', function () {
            let document  = {
                languageId: 'javascript'
            };

            let snippetNames = [];

            snippetNames.push(getLanguageSnippetName(document));
            
            document.languageId = 'javascriptreact';
            snippetNames.push(getLanguageSnippetName(document));
            
            document.languageId = 'jsx';
            snippetNames.push(getLanguageSnippetName(document));
            
            this.verifyAsJSON(snippetNames);
        });

        it('returns typescript for language ids: typescript, typescriptreact, tsx', function () {
            let document  = {
                languageId: 'typescript'
            };

            let snippetNames = [];

            snippetNames.push(getLanguageSnippetName(document));
            
            document.languageId = 'typescriptreact';
            snippetNames.push(getLanguageSnippetName(document));
            
            document.languageId = 'tsx';
            snippetNames.push(getLanguageSnippetName(document));
            
            this.verifyAsJSON(snippetNames);
        });
    });

    describe('get snippet body text', function () {
        it('returns a single-string snippet body', function () {
            const fixtureText = readFileSource(__dirname, 'fixtures/test-fixture.json');
            const testSnippets = jsonc.parse(fixtureText);

            const snippetBodyText = getSnippetText('Function', testSnippets);

            this.verify(snippetBodyText);
        });
    });
});