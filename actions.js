const { groups } = require('./groups');

const actions = [
	{
		commandId: 'cmstead.jscodeformer.extractVariable',
		path: './modules/commands/extract-variable/extract-variable-action',
		name: 'extractVariable',
		title: 'Extract Variable',
		group: groups.REFACTORINGS
	},
	{
		commandId: 'cmstead.jscodeformer.extractToParameter',
		path: './modules/commands/extract-to-parameter/extract-to-parameter-action',
		name: 'extractToParameter',
		title: 'Extract To Parameter',
		group: groups.REFACTORINGS
	},
	{
		commandId: 'cmstead.jscodeformer.extractMethod',
		path: './modules/commands/extract-method/extract-method-action',
		name: 'extractMethod',
		title: 'Extract Method',
		group: groups.REFACTORINGS
	},
	{
		commandId: 'cmstead.jscodeformer.inlineVariable',
		path: './modules/commands/inline-variable/inline-variable-action',
		name: 'inlineVariable',
		title: 'Inline Variable',
		group: groups.REFACTORINGS
	},
	{
		commandId: 'cmstead.jscodeformer.surroundWith',
		path: './modules/commands/surround-with/surround-with-action',
		name: 'surroundWith',
		title: 'Surround With',
		group: groups.ACTIONS
	},
	{
		commandId: 'cmstead.jscodeformer.pickBehavior',
		path: './modules/commands/pick-behavior/pick-behavior-action',
		name: 'pickBehavior',
		title: 'Pick Action',
		group: groups.NONE
	},
	{
		commandId: 'cmstead.jscodeformer.convertToArrowFunction',
		path: './modules/commands/convert-to-arrow-function/convert-to-arrow-function-action',
		name: 'convertToArrowFunction',
		title: 'Convert Function to Arrow Function',
		group: groups.CONVERSIONS
	},

];

module.exports = actions;