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
		commandId: 'cmstead.jscodeformer.rename',
		path: './modules/commands/rename/rename-action',
		name: 'rename',
		title: 'Rename',
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
		commandId: 'cmstead.jscodeformer.changeVariableType',
		path: './modules/commands/change-variable-type/change-variable-type-action',
		name: 'changeVariableType',
		title: 'Change Variable Type',
		group: groups.CONVERSIONS
	},
	{
		commandId: 'cmstead.jscodeformer.togglePropertyDeclaration',
		path: './modules/commands/toggle-property-declaration/toggle-property-declaration-action',
		name: 'togglePropertyDeclaration',
		title: 'Toggle Between Shorthand and Standard Property Declarations',
		group: groups.CONVERSIONS
	},
	{
		commandId: 'cmstead.jscodeformer.introduceVariable',
		path: './modules/commands/introduce-variable/introduce-variable-action',
		name: 'introduceVariable',
		title: 'Introduce Variable',
		group: groups.ACTIONS
	},
	{
		commandId: 'cmstead.jscodeformer.introduceFunction',
		path: './modules/commands/introduce-function/introduce-function-action',
		name: 'introduceFunction',
		title: 'Introduce Function',
		group: groups.ACTIONS
	},
	{
		commandId: 'cmstead.jscodeformer.liftAndNameFunctionExpression',
		path: './modules/commands/lift-and-name-function-expression/lift-and-name-function-expression-action',
		name: 'liftAndNameFunctionExpression',
		title: 'Lift and Name Function Expression',
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
		commandId: 'cmstead.jscodeformer.convert',
		path: './modules/commands/convert/convert-action',
		name: 'convert',
		title: 'Pick a conversion',
		group: groups.NONE
	},
	{
		commandId: 'cmstead.jscodeformer.convertToArrowFunction',
		path: './modules/commands/convert-to-arrow-function/convert-to-arrow-function-action',
		name: 'convertToArrowFunction',
		title: 'Convert Function to Arrow Function',
		group: groups.CONVERSIONS
	},
	{
		commandId: 'cmstead.jscodeformer.convertToFunctionDeclaration',
		path: './modules/commands/convert-to-function-declaration/convert-to-function-declaration-action',
		name: 'convertToFunctionDeclaration',
		title: 'Convert Function Variable Declaration to Function Declaration',
		group: groups.CONVERSIONS
	},
	{
		commandId: 'cmstead.jscodeformer.convertToFunctionExpression',
		path: './modules/commands/convert-to-function-expression/convert-to-function-expression-action',
		name: 'convertToFunctionExpression',
		title: 'Convert Function to Function Expression',
		group: groups.CONVERSIONS
	},
	{
		commandId: 'cmstead.jscodeformer.convertToMethod',
		path: './modules/commands/convert-to-method/convert-to-method-action',
		name: 'convertToMethod',
		title: 'Convert Function Property to Method Definition',
		group: groups.CONVERSIONS
	},
	{
		commandId: 'cmstead.jscodeformer.convertToTemplateLiteral',
		path: './modules/commands/convert-to-template-literal/convert-to-template-literal-action',
		name: 'convertToTemplateLiteral',
		title: 'Convert Expression to Template Literal (Interpolated String)',
		group: groups.CONVERSIONS
	},

];

module.exports = actions;