const vscode = require('vscode');

const actions = require('./actions');

const { setConfigOptions } = require('./modules/config-service');

function activate(context) {
	const formatDocument = () =>
		vscode.commands.executeCommand("editor.action.formatDocument")

	actions
		.forEach(function (action) {
			const disposable = vscode.commands.registerCommand(
				action.commandId,
				function () {
					setConfigOptions(vscode.workspace.getConfiguration('js-codeformer'));
	
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