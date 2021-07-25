const vscode = require('vscode');

const { extractVariable } = require('./modules/commands/extract-variable/extract-variable-action');

function activate(context) {

	let disposable = vscode.commands.registerCommand(
		'cmstead.js-codeformer.extractVariable',
		function () {
			extractVariable(vscode);
		});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
function deactivate() { }

module.exports = {
	activate,
	deactivate
}
