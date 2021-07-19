const vscode = require('vscode');
const parser = require('./modules/parser/parser');
const nodePath = require('./modules/node-path');
const { transformSelectionToLocation } = require('./modules/code-range-transforms');

function activate(context) {

	function prepareActionSetup(vscode) {
		const activeTextEditor = vscode.window.activeTextEditor;

		const location = transformSelectionToLocation(activeTextEditor.selection);
		const source = activeTextEditor.document.getText()
		const ast = parser.parse(source);
		const selectionPath = nodePath.buildNodePath(ast, location);

		return {
			activeTextEditor,
			source,
			
			location,
			ast,
			selectionPath
		};
	}

	let disposable = vscode.commands.registerCommand('cmstead.js-codeformer.helloWorld', function () {
		const actionSetup = prepareActionSetup(vscode);

		console.log(actionSetup);
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
function deactivate() { }

module.exports = {
	activate,
	deactivate
}
