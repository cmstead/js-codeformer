class IfBuilder {
    constructor({
        test,
        consequent,
        alternate = null
    }) {
        this.test = test;
        this.consequent = consequent;
        this.alternate = alternate;
    }

    buildElse() {
        if (this.alternate !== null) {
            return [` else {`,
                `\t${this.alternate}`,
                `}`].join('\n');
        }

        return '';
    }

    buildIf() {
        return [`if (${this.test}) {`,
        `\t${this.consequent}`,
        `}${this.buildElse()}`].join('\n');
    }
}

function getNewIfBuilder({
    test,
    consequent,
    alternate
}) {
    return new IfBuilder({
        test,
        consequent,
        alternate
    });
}

module.exports = {
    getNewIfBuilder,
    IfBuilder
}