const { VsCodePosition } = require("./VsCodePosition");

class VsCodeSelection {
    constructor({ start = new VsCodePosition(), end = new VsCodePosition() }){
        this.start = start;
        this.end = end;
    }

    updateStart(start) {
        this.start = start;
    }

    updateEnd(end) {
        this.end = end;
    }
}

function buildNewVsCodeSelection({ startPosition, endPosition }) {
    return new VsCodeSelection({ startPosition, endPosition });
}

module.exports = {
    VsCodeSelection,
    buildNewVsCodeSelection
};