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

class ExtractionPathBuilder {
    constructor(nodePath) {
        this.acceptableNodeTypes = [
            ARROW_FUNCTION_EXPRESSION,
            FUNCTION_DECLARATION,
            FUNCTION_EXPRESSION,
            IF_STATEMENT,
            METHOD_DEFINITION
        ];

        this.extractionPath = new ExtractionPath();
        this.currentNodeSet = null;

        this.reversedNodePath = nodePath.slice(0);
        this.reversedNodePath.reverse();
    }

    updateExtractionPath(nodeSet = this.currentNodeSet) {
        this.extractionPath.insertNodeSet(nodeSet);
    }

    resetCurrentNodeSet() {
        this.currentNodeSet = null;
    }

    createNodeSet(node) {
        return new NodeSet(node);
    }

    buildExtractionPath() {
        this.reversedNodePath.forEach(node => {
            const seekingParentNode = this.currentNodeSet !== null;
            const nodeTypeIsAcceptable = this.acceptableNodeTypes.includes(node.type);
            const nodeTypeNotAcceptable = !nodeTypeIsAcceptable;
    
            if (nodeTypeNotAcceptable) {
                this.updateExtractionPath();
                this.resetCurrentNodeSet();
            }
    
            if (node.type === PROGRAM || node.type === OBJECT_EXPRESSION) {
                this.updateExtractionPath(this.createNodeSet(node));
            } else if (node.type === BLOCK_STATEMENT) {
                this.currentNodeSet = this.createNodeSet(node);
            } else if (seekingParentNode && nodeTypeIsAcceptable) {
                this.currentNodeSet.addNode(node);
            }
        });
    
        return this.extractionPath;
    }
}

function buildExtractionPath(nodePath) {
    return new ExtractionPathBuilder(nodePath)
        .buildExtractionPath()
        .toArray()
}

module.exports = {
    ExtractionPathBuilder,
    buildExtractionPath
};
