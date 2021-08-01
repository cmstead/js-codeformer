const vscode = require('vscode');

const { extractVariable } = require('./modules/commands/extract-variable/extract-variable-action');
const { extractMethod } = require('./modules/commands/extract-method/extract-method-action');
const { inlineVariable } = require('./modules/commands/inline-variable/inline-variable-action');

function activate(context) {
	const formatDocument = () =>
		vscode.commands.executeCommand("editor.action.formatDocument")

	let extractVarDisposable = vscode.commands.registerCommand(
		'cmstead.jscodeformer.extractVariable',
		function () {
			extractVariable()
			.then(formatDocument);
		});

	context.subscriptions.push(extractVarDisposable);

	let extractMethodDisposable = vscode.commands.registerCommand(
		'cmstead.jscodeformer.extractMethod',
		function () {
			extractMethod()
			.then(formatDocument);
		});

	context.subscriptions.push(extractMethodDisposable);

	let inlineVariableDisposable = vscode.commands.registerCommand(
		'cmstead.jscodeformer.inlineVariable',
		function () {
			inlineVariable()
			.then(formatDocument);
		});

	context.subscriptions.push(inlineVariableDisposable);
}

// this method is called when your extension is deactivated
function deactivate() { }

module.exports = {
	activate,
	deactivate
}
