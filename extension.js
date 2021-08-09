const vscode = require('vscode');

const actions = require('./actions');
const { showErrorMessage } = require('./modules/ui-services/messageService');

function activate(context) {
	const formatDocument = () =>
		vscode.commands.executeCommand("editor.action.formatDocument")

	actions
		.forEach(function (action) {
			const disposable = vscode.commands.registerCommand(
				action.commandId,
				function () {
					showErrorMessage(`Running command: ${action.commandId}`);
					
					try {
						const codeAction = require(action.path);

						codeAction[action.name]()
							.then(formatDocument);
					} catch (error) {
						console.log(error)
					}
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
