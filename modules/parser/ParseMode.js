class ParseMode{
    constructor(verify, prepare) {
        this.verify = verify;
        this.transform = prepare;
    }
}

function buildParseMode({ verify, transform }) {
    return new ParseMode(verify, transform);
}

module.exports = {
    ParseMode,
    buildParseMode
};