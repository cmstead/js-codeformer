class VsCodePosition{
    constructor({ line = 0, column = 0 }){
        this.line = line;
        this.column = column;
    }
}

function buildNewPosition({ line, column }) {
    return new VsCodePosition({ line, column });
}

module.exports = {
    VsCodePosition,
    buildNewPosition
}