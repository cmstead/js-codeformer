const { openSelectList } = require("../../ui-services/inputService");
const { showErrorMessage } = require("../../ui-services/messageService");
const { validateUserInput } = require("../../validatorService");
const { getActionTitles, findCommandIdByTitle } = require("./convert");

const vscode = require('../../vscodeService').getVscode()

async function test() {
    return 'foo';
}

test();

console.log(test);

const foo = test;

function convert() {
    const actionList = getActionTitles();

    return openSelectList({
        values: actionList,
        title: 'Which conversion do you want to run?'
    })
        .then((selectedTitle) => validateUserInput({
            value: selectedTitle,
            validator: (selectedTitle) => selectedTitle !== null && selectedTitle !== '',
            message: 'No conversion selected; canceling conversion'
        }))

        .then((selectedTitle) => findCommandIdByTitle(selectedTitle))
        .then((commandId) => vscode.commands.executeCommand(commandId))

        .catch(function (error) {
            showErrorMessage(error.message)
        });
}

class TestClass {
    testMethod() {
        return 'foo';
    }

    otherTestMethod() {
        return this.testMethod();
    }
}

module.exports = {
    convert
};