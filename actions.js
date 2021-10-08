const { groups } = require('./groups');
const { findSymbolToRename } = require('./modules/commands/rename/rename');
const { VARIABLE_DECLARATOR, BLOCK_STATEMENT, IF_STATEMENT, VARIABLE_DECLARATION, CONDITIONAL_EXPRESSION, RETURN_STATEMENT, PROGRAM, PROPERTY, FUNCTION_DECLARATION, FUNCTION_EXPRESSION, ARROW_FUNCTION_EXPRESSION, CALL_EXPRESSION, EMPTY_STATEMENT, METHOD_DEFINITION, CLASS_PROPERTY, LITERAL, BINARY_EXPRESSION, IDENTIFIER, ASSIGNMENT_EXPRESSION, CLASS_DECLARATION, IMPORT_DECLARATION } = require('./modules/constants/ast-node-types');
const { getNodeType, last, first } = require('./modules/core-utils');
const { findNodeInPath, findNodeByCheckFunction, findAncestorNodeInPath } = require('./modules/edit-utils/node-path-utils');
const { functionNodeTypes } = require('./modules/commands/extract-to-parameter/extract-to-parameter');
const { pickParentNode } = require('./modules/commands/convert-ternary-to-if-else/convert-ternary-to-if-else');
const { isConvertablePropertyNode } = require('./modules/commands/toggle-property-declaration/toggle-property-declaration');
const { findFunctionNode } = require('./modules/function-utils/function-node');
const { checkExpressionTree, findNearestExpressionToConvert } = require('./modules/commands/convert-to-template-literal/convert-to-template-literal');
const { getFunctionDeclaration } = require('./modules/commands/move-function-into-class/move-function-into-class');
const { methodDoesNotUseThis } = require('./modules/commands/move-method-out-of-class/move-method-out-of-class');
const { validateImportNode } = require('./modules/commands/convert-import-to-commonjs/convert-import-to-commonjs');

const actions = [
	{
		commandId: 'cmstead.jscodeformer.extractVariable',
		path: './modules/commands/extract-variable/extract-variable-action',
		name: 'extractVariable',
		title: 'Extract Variable',
		group: groups.REFACTORINGS,
		analyzer: ({ location }) => {
			return location.start.line !== location.end.line
				|| location.start.column !== location.end.column;
		}
	},
	{
		commandId: 'cmstead.jscodeformer.extractToParameter',
		path: './modules/commands/extract-to-parameter/extract-to-parameter-action',
		name: 'extractToParameter',
		title: 'Extract Variable To Parameter',
		group: groups.REFACTORINGS,
		analyzer: ({ selectionPath }) =>
			findNodeInPath(selectionPath, VARIABLE_DECLARATOR) !== null
			&& findNodeInPath(selectionPath, VARIABLE_DECLARATION) !== null
			&& findNodeByCheckFunction(selectionPath, node =>
				functionNodeTypes.includes(getNodeType(node))) !== null
	},
	{
		commandId: 'cmstead.jscodeformer.extractMethod',
		path: './modules/commands/extract-method/extract-method-action',
		name: 'extractMethod',
		title: 'Extract Method',
		group: groups.REFACTORINGS,
		analyzer: ({ location }) =>
			location.start.line !== location.end.line
			|| location.start.column !== location.end.column
	},
	{
		commandId: 'cmstead.jscodeformer.inlineVariable',
		path: './modules/commands/inline-variable/inline-variable-action',
		name: 'inlineVariable',
		title: 'Inline Variable',
		group: groups.REFACTORINGS,
		analyzer: ({ selectionPath }) => {
			const declaratorNode = findNodeInPath(selectionPath, VARIABLE_DECLARATOR);

			return declaratorNode !== null;
		}
	},
	{
		commandId: 'cmstead.jscodeformer.rename',
		path: './modules/commands/rename/rename-action',
		name: 'rename',
		title: 'Rename',
		group: groups.REFACTORINGS,
		analyzer: ({ selectionPath }) =>
			findSymbolToRename(selectionPath) !== null
	},
	{
		commandId: 'cmstead.jscodeformer.invertIf',
		path: './modules/commands/invert-if/invert-if-action',
		name: 'invertIf',
		title: 'Invert If Statement',
		group: groups.REFACTORINGS,
		analyzer: ({ selectionPath }) => {
			const ifNode = findNodeInPath(selectionPath, IF_STATEMENT);

			return ifNode !== null
				&& ifNode.alternate !== null
				&& getNodeType(ifNode.alternate) === BLOCK_STATEMENT
		}
	},
	{
		commandId: 'cmstead.jscodeformer.invertTernary',
		path: './modules/commands/invert-ternary/invert-ternary-action',
		name: 'invertTernary',
		title: 'Invert Ternary Expression',
		group: groups.REFACTORINGS,
		analyzer: ({ selectionPath }) => {
			const ternaryNode = findNodeInPath(selectionPath, CONDITIONAL_EXPRESSION);

			return ternaryNode !== null;
		}
	},
	{
		commandId: 'cmstead.jscodeformer.changeVariableType',
		path: './modules/commands/change-variable-type/change-variable-type-action',
		name: 'changeVariableType',
		title: 'Change Variable Type',
		group: groups.CONVERSIONS,
		analyzer: ({ selectionPath }) => {
			const declarationNode = findNodeInPath(selectionPath, VARIABLE_DECLARATION);
			const currentNode = last(selectionPath);

			return getNodeType(currentNode) === IDENTIFIER && declarationNode !== null;
		}
	},
	{
		commandId: 'cmstead.jscodeformer.convertTernaryToIfElse',
		path: './modules/commands/convert-ternary-to-if-else/convert-ternary-to-if-else-action',
		name: 'convertTernaryToIfElse',
		title: 'Convert Ternary to If/Else',
		group: groups.CONVERSIONS,
		analyzer: ({ selectionPath }) => {
			const ternaryNode = findNodeInPath(selectionPath, CONDITIONAL_EXPRESSION);
			const parentNodes = [
				findNodeInPath(selectionPath, RETURN_STATEMENT),
				findNodeByCheckFunction(selectionPath, (node) =>
					getNodeType(node) === VARIABLE_DECLARATION && node.declarations.length === 1),
				findNodeByCheckFunction(selectionPath, (node) =>
					[BLOCK_STATEMENT, PROGRAM].includes(getNodeType(node)))
			];

			return ternaryNode !== null && pickParentNode(parentNodes, ternaryNode) !== null;
		}
	},
	{
		commandId: 'cmstead.jscodeformer.convertImportToCommonjs',
		path: './modules/commands/convert-import-to-commonjs/convert-import-to-commonjs-action',
		name: 'convertImportToCommonjs',
		title: 'Convert Import Declaration to CommonJS Require',
		group: groups.CONVERSIONS,
		analyzer: (_, locationsSetup) => {
			const acceptableImports = locationsSetup
				.map((locationSetup) =>
					findNodeInPath(locationSetup.selectionPath, IMPORT_DECLARATION))
				.filter((node) => node !== null && validateImportNode(node));

			return acceptableImports.length > 0;
		}
	},
	{
		commandId: 'cmstead.jscodeformer.togglePropertyDeclaration',
		path: './modules/commands/toggle-property-declaration/toggle-property-declaration-action',
		name: 'togglePropertyDeclaration',
		title: 'Toggle Between Shorthand and Standard Property Declarations',
		group: groups.ACTIONS,
		analyzer: ({ selectionPath }) => {
			const propertyNode = findNodeInPath(selectionPath, PROPERTY);

			return propertyNode !== null && isConvertablePropertyNode(propertyNode);
		}
	},
	{
		commandId: 'cmstead.jscodeformer.toggleParametersType',
		path: './modules/commands/toggle-parameters-type/toggle-parameters-type-action',
		name: 'toggleParametersType',
		title: 'Toggle Function Parameters Declaration Type',
		group: groups.ACTIONS,
		analyzer: ({ selectionPath }) => {
			const functionTypes = [FUNCTION_DECLARATION, FUNCTION_EXPRESSION, ARROW_FUNCTION_EXPRESSION];
			const functionNode = findNodeByCheckFunction(
				selectionPath,
				node => functionTypes.includes(getNodeType(node)));

			return functionNode !== null
				&& functionNode.params.length > 0;
		}
	},
	{
		commandId: 'cmstead.jscodeformer.toggleArgumentsType',
		path: './modules/commands/toggle-arguments-type/toggle-arguments-type-action',
		name: 'toggleArgumentsType',
		title: 'Toggle Function Call Argument Passing Type',
		group: groups.ACTIONS,
		analyzer: ({ selectionPath }) => {
			const functionNode = findNodeInPath(selectionPath, CALL_EXPRESSION);

			return functionNode !== null
				&& functionNode.arguments.length > 0;
		}
	},
	{
		commandId: 'cmstead.jscodeformer.toggleArrowFunctionBraces',
		path: './modules/commands/toggle-arrow-function-braces/toggle-arrow-function-braces-action',
		name: 'toggleArrowFunctionBraces',
		title: 'Toggle braces on an arrow function',
		group: groups.ACTIONS,
		analyzer: ({ selectionPath }) => {
			function hasOnlyAReturnLine(body) {
				const exectuableBodyNodes = body.filter(node => getNodeType(node) !== EMPTY_STATEMENT)

				return exectuableBodyNodes.length === 1
					&& getNodeType(exectuableBodyNodes[0]) === RETURN_STATEMENT;
			}

			const arrowFunctionNode = findNodeInPath(selectionPath, ARROW_FUNCTION_EXPRESSION);

			return arrowFunctionNode !== null
				&& (arrowFunctionNode.expression === true
					|| (
						getNodeType(arrowFunctionNode.body) === BLOCK_STATEMENT
						&& hasOnlyAReturnLine(arrowFunctionNode.body.body)
					)
					|| (
						Array.isArray(arrowFunctionNode.body)
						&& arrowFunctionNode.body[0] === RETURN_STATEMENT
					));
		}
	},
	{
		commandId: 'cmstead.jscodeformer.convertToArrowFunction',
		path: './modules/commands/convert-to-arrow-function/convert-to-arrow-function-action',
		name: 'convertToArrowFunction',
		title: 'Convert Function to Arrow Function',
		group: groups.CONVERSIONS,
		analyzer: ({ selectionPath }) => {
			const functionNodeTypes = [
				ARROW_FUNCTION_EXPRESSION,
				FUNCTION_DECLARATION,
				FUNCTION_EXPRESSION,
				METHOD_DEFINITION
			];

			return findFunctionNode(selectionPath, functionNodeTypes) !== null;
		}
	},
	{
		commandId: 'cmstead.jscodeformer.convertToFunctionDeclaration',
		path: './modules/commands/convert-to-function-declaration/convert-to-function-declaration-action',
		name: 'convertToFunctionDeclaration',
		title: 'Convert Function Variable Declaration to Function Declaration',
		group: groups.CONVERSIONS,
		analyzer: ({ selectionPath }) => {
			const declarationNode = findNodeInPath(selectionPath, VARIABLE_DECLARATION);

			let declarationsLength = 0;
			let initType = null;

			if (declarationNode !== null) {
				declarationsLength = declarationNode.declarations.length;
				const declaration = first(declarationNode.declarations);
				initType = declaration.init !== null ? getNodeType(declaration.init) : null;
			}

			return declarationsLength === 1
				&& functionNodeTypes.includes(initType)
		}
	},
	{
		commandId: 'cmstead.jscodeformer.convertToFunctionExpression',
		path: './modules/commands/convert-to-function-expression/convert-to-function-expression-action',
		name: 'convertToFunctionExpression',
		title: 'Convert Function to Function Expression',
		group: groups.CONVERSIONS,
		analyzer: ({ selectionPath }) => {
			const functionNodeTypes = [
				ARROW_FUNCTION_EXPRESSION,
				FUNCTION_DECLARATION,
				FUNCTION_EXPRESSION,
				METHOD_DEFINITION
			];

			return findFunctionNode(selectionPath, functionNodeTypes) !== null;
		}
	},
	{
		commandId: 'cmstead.jscodeformer.convertToMethod',
		path: './modules/commands/convert-to-method/convert-to-method-action',
		name: 'convertToMethod',
		title: 'Convert Function Property to Method Definition',
		group: groups.CONVERSIONS,
		analyzer: ({ selectionPath }) => {
			const propertyNode = findNodeInPath(selectionPath, CLASS_PROPERTY);

			const valueType = propertyNode !== null && propertyNode.value !== null
				? getNodeType(propertyNode.value)
				: null;

			return getNodeType(propertyNode) === CLASS_PROPERTY
				&& functionNodeTypes.includes(valueType)
		}
	},
	{
		commandId: 'cmstead.jscodeformer.convertToTemplateLiteral',
		path: './modules/commands/convert-to-template-literal/convert-to-template-literal-action',
		name: 'convertToTemplateLiteral',
		title: 'Convert Expression to Template Literal (Interpolated String)',
		group: groups.CONVERSIONS,
		analyzer: (_, locationsSetup) => {
			const convertableNodes = locationsSetup
				.map((locationSetup) =>
					findNearestExpressionToConvert(locationSetup.selectionPath))
				.filter((node) => node !== null)
				.filter((node) => checkExpressionTree(node))

			return convertableNodes.length > 0;
		}
	},
	{
		commandId: 'cmstead.jscodeformer.convertFunctionsToClass',
		path: './modules/commands/convert-functions-to-class/convert-functions-to-class-action',
		name: 'convertFunctionsToClass',
		title: 'Convert Selected Functions To Class',
		group: groups.CONVERSIONS,
		analyzer: (_, locationsSetup) => {
			const functionTypes = [
				FUNCTION_DECLARATION,
				FUNCTION_EXPRESSION,
				ARROW_FUNCTION_EXPRESSION
			];

			const locatedFunctionNodes = locationsSetup
				.map(({ selectionPath }) => {
					const functionNode = findNodeByCheckFunction(
						selectionPath,
						(node) => functionTypes.includes(getNodeType(node)));

					return functionNode !== null
						? getFunctionDeclaration(functionNode, selectionPath)
						: null;
				})
				.filter((node) => node !== null);

			return locatedFunctionNodes.length > 0;
		}
	},
	{
		commandId: 'cmstead.jscodeformer.convertToMultipleDeclarations',
		path: './modules/commands/convert-to-multiple-declarations/convert-to-multiple-declarations-action',
		name: 'convertToMultipleDeclarations',
		title: 'Convert to Multiple Declarations',
		group: groups.CONVERSIONS,
		analyzer: ({ selectionPath }) => {
			return findNodeInPath(selectionPath, VARIABLE_DECLARATION);
		}
	},
	{
		commandId: 'cmstead.jscodeformer.moveMethodOutOfClass',
		path: './modules/commands/move-method-out-of-class/move-method-out-of-class-action',
		name: 'moveMethodOutOfClass',
		title: 'Move Method Out Of Class',
		group: groups.ACTIONS,
		analyzer: ({ selectionPath }) => {
			const methodNode = findNodeInPath(selectionPath, METHOD_DEFINITION);

			return methodNode !== null
				&& methodNode.kind === 'method'
				&& methodDoesNotUseThis(methodNode);
		}
	},
	{
		commandId: 'cmstead.jscodeformer.surroundWith',
		path: './modules/commands/surround-with/surround-with-action',
		name: 'surroundWith',
		title: 'Surround With',
		group: groups.ACTIONS,
		analyzer: ({ location }) => {
			return location.start.line !== location.end.line
				|| location.start.column !== location.end.column;
		}
	},
	{
		commandId: 'cmstead.jscodeformer.introduceVariable',
		path: './modules/commands/introduce-variable/introduce-variable-action',
		name: 'introduceVariable',
		title: 'Introduce Variable',
		group: groups.ACTIONS,
		analyzer: ({ selectionPath }) => {
			const selectedNode = last(selectionPath);

			let checkCount = 0;

			const parentNode = findAncestorNodeInPath(
				selectionPath,
				selectedNode,
				() => (++checkCount === 1));

			const acceptableAncestors = [
				PROGRAM,
				BLOCK_STATEMENT,
				ASSIGNMENT_EXPRESSION,
				CALL_EXPRESSION,
				PROPERTY
			];

			return getNodeType(selectedNode) === IDENTIFIER
				&& acceptableAncestors.includes(getNodeType(parentNode))
				&& (
					getNodeType(parentNode) !== CALL_EXPRESSION
					|| parentNode.arguments.includes(selectedNode)
				);
		}
	},
	{
		commandId: 'cmstead.jscodeformer.introduceFunction',
		path: './modules/commands/introduce-function/introduce-function-action',
		name: 'introduceFunction',
		title: 'Introduce Function',
		group: groups.ACTIONS,
		analyzer: ({ selectionPath }) => {
			const selectedNode = last(selectionPath);

			let checkCount = 0;

			const parentNode = findAncestorNodeInPath(
				selectionPath,
				selectedNode,
				() => (++checkCount === 1));

			const acceptableAncestors = [
				PROGRAM,
				BLOCK_STATEMENT,
				ASSIGNMENT_EXPRESSION,
				CALL_EXPRESSION,
				PROPERTY
			];

			return getNodeType(selectedNode) === IDENTIFIER
				&& acceptableAncestors.includes(getNodeType(parentNode));
		}
	},
	{
		commandId: 'cmstead.jscodeformer.liftAndNameFunctionExpression',
		path: './modules/commands/lift-and-name-function-expression/lift-and-name-function-expression-action',
		name: 'liftAndNameFunctionExpression',
		title: 'Lift and Name Function Expression',
		group: groups.ACTIONS,
		analyzer: ({ selectionPath }) => {
			const isAnonymousFunction = (node) =>
				[FUNCTION_EXPRESSION, ARROW_FUNCTION_EXPRESSION]
					.includes(getNodeType(node));

			const functionNode = findNodeByCheckFunction(selectionPath, isAnonymousFunction);

			return functionNode !== null;
		}
	},
	{
		commandId: 'cmstead.jscodeformer.toggleAsync',
		path: './modules/commands/toggle-async/toggle-async-action',
		name: 'toggleAsync',
		title: 'Toggle Function Async Property',
		group: groups.ACTIONS,
		analyzer: ({ selectionPath }) => {
			const functionTypes = [
				FUNCTION_DECLARATION,
				FUNCTION_EXPRESSION,
				ARROW_FUNCTION_EXPRESSION,
				METHOD_DEFINITION];

			const functionNode = findNodeByCheckFunction(
				selectionPath,
				(node) => functionTypes.includes(getNodeType(node)));

			return functionNode !== null;
		}
	},
	{
		commandId: 'cmstead.jscodeformer.moveFunctionIntoClass',
		path: './modules/commands/move-function-into-class/move-function-into-class-action',
		name: 'moveFunctionIntoClass',
		title: 'Move Independent Function Into Class',
		group: groups.ACTIONS,
		analyzer: ({ selectionPath }) => {
			let functionTypes = [
				FUNCTION_DECLARATION,
				FUNCTION_EXPRESSION,
				ARROW_FUNCTION_EXPRESSION
			];

			const functionNode = findNodeByCheckFunction(
				selectionPath,
				(node) => functionTypes.includes(getNodeType(node)))

			return getFunctionDeclaration(functionNode, selectionPath) !== null
				&& first(selectionPath).body.find((node) =>
					getNodeType(node) === CLASS_DECLARATION) !== null;
		}
	},
	{
		commandId: 'cmstead.jscodeformer.suggestAction',
		path: './modules/commands/action-suggestions/action-suggestions-action',
		name: 'actionSuggestions',
		title: 'Suggest an Action',
		group: groups.NONE
	},

];

module.exports = actions;