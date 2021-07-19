const vscode = require('vscode');

const { prepareActionSetup } = require('./modules/action-setup');

function activate(context) {

	let disposable = vscode.commands.registerCommand('cmstead.js-codeformer.extractVariable', function () {
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
