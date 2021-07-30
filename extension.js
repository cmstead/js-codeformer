const vscode = require('vscode');

const { extractVariable } = require('./modules/commands/extract-variable/extract-variable-action');
const { extractMethod } = require('./modules/commands/extract-method/extract-method-action');

function activate(context) {

	let extractVarDisposable = vscode.commands.registerCommand(
		'cmstead.jscodeformer.extractVariable',
		function () {
			extractVariable();
		});

	context.subscriptions.push(extractVarDisposable);

	let extractMethodDisposable = vscode.commands.registerCommand(
		'cmstead.jscodeformer.extractMethod',
		function () {
			extractMethod();
		});

	context.subscriptions.push(extractMethodDisposable);
}

// this method is called when your extension is deactivated
function deactivate() { }

module.exports = {
	activate,
	deactivate
}
