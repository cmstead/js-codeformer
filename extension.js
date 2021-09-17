const vscode = require('vscode');

const actions = require('./actions');

const { setConfigOptions } = require('./modules/config-service');
const { showInfoMessage } = require('./modules/ui-services/messageService');

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
							.then(function (message) {
								if(typeof message === 'string' && message.trim() !== '') {
									showInfoMessage(message.trim());
								}
							})
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