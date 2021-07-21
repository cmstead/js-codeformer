
// Stuff to do to extract a variable:

// Acceptable scopes:
// - Program
// - Function
// - FunctionExpression
// - ArrowFunctionExpression (only with FunctionBody)

// 1. get the scope for extraction (window.showQuickPick)
// 2. get the variable name (window.showInputBox)
// 3. create variable declaration code
// 4. create variable name replacement
// 5. select location for variable declaration insertion
// 6. create array of edits: [value replacement + location, variable declaration + location]

const {
    ARROW_FUNCTION_EXPRESSION,
    BLOCK_STATEMENT,
    FUNCTION_DECLARATION,
    FUNCTION_EXPRESSION,
    IF_STATEMENT,
    METHOD_DEFINITION,
    OBJECT_EXPRESSION,
    PROGRAM
} = require('../../ast-node-types');

class ExtractionPath {
    constructor() {
        this.path = [];
    }

    toArray() {
        return this.path.slice(0);
    }

    insertNodeSet(nodeSet) {
        if (nodeSet !== null) {
            this.path.push(nodeSet.toArray());
        }
    }
}

class NodeSet {
    constructor(node) {
        this.nodeSet = [node];
    }

    toArray() {
        return this.nodeSet.slice(0);
    }

    addNode(node) {
        this.nodeSet.push(node);
    }
}

class ExtractionPathBuilder{
    constructor(){
        this.acceptableNodeTypes = [
            ARROW_FUNCTION_EXPRESSION,
            FUNCTION_DECLARATION,
            FUNCTION_EXPRESSION,
            IF_STATEMENT,
            METHOD_DEFINITION
        ];

        this.extractionPath = new ExtractionPath();
        this.currentNodeSet = null;
    }
}

function buildExtractionPath(nodePath) {
    let extractionPath = new ExtractionPath();
    let currentNodeSet = null;

    let acceptableNodeTypes = [
        ARROW_FUNCTION_EXPRESSION,
        FUNCTION_DECLARATION,
        FUNCTION_EXPRESSION,
        IF_STATEMENT,
        METHOD_DEFINITION
    ];

    const copiedNodePath = nodePath.slice();
    copiedNodePath.reverse();

    const updateExtractionPath = (nodeSet) =>
        extractionPath.insertNodeSet(nodeSet);

    const resetCurrentNodeSet = () => currentNodeSet = null;

    copiedNodePath.forEach(node => {
        const seekingParentNode = currentNodeSet !== null;
        const nodeTypeIsAcceptable = acceptableNodeTypes.includes(node.type);
        const nodeTypeNotAcceptable = !nodeTypeIsAcceptable;

        if (nodeTypeNotAcceptable) {
            updateExtractionPath(currentNodeSet);
            resetCurrentNodeSet();
        }

        if (node.type === PROGRAM || node.type === OBJECT_EXPRESSION) {
            updateExtractionPath(new NodeSet(node));
        } else if (node.type === BLOCK_STATEMENT) {
            currentNodeSet = new NodeSet(node);
        } else if (seekingParentNode && nodeTypeIsAcceptable) {
            currentNodeSet.addNode(node);
        }
    });

    return extractionPath.toArray();
}

module.exports = {
    buildExtractionPath
};