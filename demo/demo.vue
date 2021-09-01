<script>
function findNodeWithMatchingType(node) {
    const nodeType = "desired-node-type";

    if (node.type === nodeType) {
        return node;
    }

    for (let index in node.children) {
        const currentNode = node.children[index];
        const matchResult = findNodeWithMatchingType(currentNode);

        if (matchResult !== null) {
            return matchResult;
        }
    }

    return null;
}
</script>
