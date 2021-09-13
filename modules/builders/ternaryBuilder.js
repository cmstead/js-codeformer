class TernaryBuilder {
    constructor({
        test,
        consequent,
        alternate
    }) {
        this.test = test;
        this.consequent = consequent;
        this.alternative = alternate;
    }

    buildTernary() {
        return `${this.test} ? ${this.consequent} : ${this.alternative}`;
    }
}

function getNewTernaryBuilder({
    test,
    consequent,
    alternate
}) {
    return new TernaryBuilder({ test, consequent, alternate });
}

module.exports = {
    getNewTernaryBuilder,
    TernaryBuilder
}