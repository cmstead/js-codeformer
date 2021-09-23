class ClassBuilder {
    constructor({
        classBody,
        className,
        constructorBody,
        constructorParameters,
        superclassName = null
    }) {
        this.classBody = classBody;
        this.className = className;
        this.constructorParameters = constructorParameters;
        this.constructorBody = constructorBody;
        this.superclassName = superclassName;
    }

    buildExtensionString() {
        return this.superclassName !== null
            ? `extends ${this.superclassName} `
            : '';
    }

    buildClass() {
        return `class ${this.className} ${this.buildExtensionString()}{
    constructor(${this.constructorParameters}) {
        ${this.constructorBody}
    }

    ${this.classBody}
}`;
    }
}

function getNewClassBuilder({
    classBody,
    className,
    constructorBody,
    constructorParameters,
    superclassName = null
}) {
    return new ClassBuilder({
        classBody,
        className,
        constructorBody,
        constructorParameters,
        superclassName
    });
}

module.exports = {
    getNewClassBuilder
};