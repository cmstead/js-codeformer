const vscode = require('vscode');
const parser = require('./modules/parser/parser');
const nodePath = require('./modules/node-path');

function activate(context) {

	let disposable = vscode.commands.registerCommand('cmstead.js-codeformer.helloWorld', function () {
		const activeTextEditor = vscode.window.activeTextEditor;

		const selection = activeTextEditor.selection;
		const source = activeTextEditor.document.getText()
		const ast = parser.parse(source);
		const selectionPath = nodePath.buildNodePath(ast, selection);

		const actionSetup = {
			activeTextEditor,
			selection,
			source,
			ast,
			selectionPath
		};

		console.log(actionSetup);
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
