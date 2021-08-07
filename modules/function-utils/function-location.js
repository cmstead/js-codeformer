const { first, last } = require("../core-utils");

function buildBodyCoordinates({ body }) {
    const firstNode = first(body);
    const lastNode = last(body);

    return {
        start: {
            line: firstNode.loc.start.line,
            column: firstNode.loc.start.column
        },
        end: {
            line: lastNode.loc.end.line,
            column: lastNode.loc.end.column
        }
    };
}

function getBodyCoordinates(bodyNode) {
    if(bodyNode.body.length > 0) {
        return buildBodyCoordinates(bodyNode);
    } else {
        return {
            start: {
                line: bodyNode.loc.start.line,
                column: bodyNode.loc.start.column + 1
            },
            end: {
                line: bodyNode.loc.end.line,
                column: bodyNode.loc.end.column - 1
            }
        }
    }
}

module.exports = {
    getBodyCoordinates
};