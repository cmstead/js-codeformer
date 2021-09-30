// This top one is a default import and cannot be supported
import foo from '.whatever';

// These represent cases which can be converted
import { test, test2 as anotherTest } from './some-test';
import * as bar from './some-other-test';

// Unacceptable with no imports
import { } from './some-other-test';

const { openSelectList } = require("../../ui-services/inputService");
const { showErrorMessage } = require("../../ui-services/messageService");
const { validateUserInput } = require("../../validatorService");
const { getActionTitles, findCommandIdByTitle } = require("./convert");

const vscode = require('../../vscodeService').getVscode();

let foo1 = 'bar', baz = 'quux', something;

async function test() {
    return 'foo' + abc;
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

woo();

class TestClass {
    testMethod() {
        return 'foo';
    }

    otherTestMethod() {
        return this.testMethod();
    }
}

const something = () => null

function test1234() {
    const something = 'foo';
    const somethingElse = `${something} else`;
}

function doStuff() {
    test1234()
}

a ? b : c;

if (true === true) {
    console.log('okay');
} else {
    console.log('okay, but else');
}

module.exports = {
    convert: convert
};