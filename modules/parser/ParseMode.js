class ParseMode{
    constructor(verify, prepare) {
        this.verify = verify;
        this.prepare = prepare;
    }
}

function buildParseMode({ verify, prepare }) {
    return new ParseMode(verify, prepare);
}

module.exports = {
    ParseMode,
    buildParseMode
};