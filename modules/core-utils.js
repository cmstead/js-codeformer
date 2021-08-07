function reverse(values) {
    const reversedValues = values.slice(0);
    reversedValues.reverse();

    return reversedValues;
}

function getNodeType(node) {
    return node !== null && typeof node !== 'undefined' ? node.type : '';
}

const last = values => values[values.length - 1];
const first = values => values[0];


module.exports = {
    reverse,
    first,
    getNodeType,
    last
};