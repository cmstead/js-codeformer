function reverse(values) {
    const reversedValues = values.slice(0);
    reversedValues.reverse();

    return reversedValues;
}

function getNodeType(node) {
    return typeof node === 'undefined' ? '' : node.type;
}

const last = values => values[values.length - 1];

module.exports = {
    reverse,
    getNodeType,
    last
};