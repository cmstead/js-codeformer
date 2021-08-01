const vscode = require('vscode');

const actions = require('./actions');

function activate(context) {
	const formatDocument = () =>
		vscode.commands.executeCommand("editor.action.formatDocument")

	actions
		.forEach(function (action) {
			const disposable = vscode.commands.registerCommand(
				action.commandId,
				function () {
					const codeAction = require(action.path);

					codeAction[action.name]()
						.then(formatDocument);
				}
			);

			context.subscriptions.push(disposable);
		});

}

function deactivate() { }

module.exports = {
	activate,
	deactivate
}
