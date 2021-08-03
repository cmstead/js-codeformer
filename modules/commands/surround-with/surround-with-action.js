const { promisify } = require('util');
const path = require('path');

const fs = require('fs');

const { asyncPrepareActionSetup } = require('../../action-setup');
const { openSelectList } = require('../../ui-services/inputService');
const { getLanguageSnippetName, getTemplateList, getSnippetText } = require('./surround-with');
const { showErrorMessage } = require('../../ui-services/messageService');
const { validateUserInput } = require('../../validatorService');
const { transformLocationToRange } = require('../../edit-utils/textEditTransforms');

const vscode = require('../../vscodeService').getVscode();

const snippetBasePath = '../../../';

function surroundWith() {
    let actionSetup = null;
    let snippetJson = null;

    return asyncPrepareActionSetup()
        .then(function (renderedSetup) {
            actionSetup = renderedSetup;
        })

        .then(function () {
            const snippetName = getLanguageSnippetName(actionSetup.activeTextEditor.document);
            const snippetFileName = `${snippetName}.code-snippets`;
            const snippetFilePath = path.join(__dirname, snippetBasePath, snippetFileName);

            return promisify(fs.readFile)(snippetFilePath, { encoding: 'utf8' });
        })

        .then(function (snippetJsonText) {
            snippetJson = JSON.parse(snippetJsonText);

            return getTemplateList(snippetJson);
        })

        .then((templateList) =>
            openSelectList({
                values: templateList,
                message: 'Surround with which?'
            }))

        .then((selectedOption) => validateUserInput({
            value: selectedOption,
            validator: (selectedOption) => selectedOption !== '',
            message: 'No surround option selected; cannot surround selection'
        }))

        .then(function (selectedOption) {
            const snippetText = getSnippetText(selectedOption, snippetJson);
            const snippetString = new vscode.SnippetString(snippetText);
            const selectionRange = transformLocationToRange(actionSetup.location);

            return actionSetup.activeTextEditor.insertSnippet(snippetString, selectionRange);
        })

        .then(() => showErrorMessage('Done'))

        .catch(function (error) {
            showErrorMessage(error.message);
        });
}

module.exports = {
    surroundWith
};