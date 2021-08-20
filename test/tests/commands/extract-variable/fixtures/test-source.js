class Nesting {
    testMethod() {
        const container = {
            foo: function (a, b) {
                function testing() {
                    if (a === b) {
                        return []
                    } else if (a < b) {
                        return [
                            a,
                            () => { return b; }
                        ];
                    } else {
                        return null
                    }

                }
            }
        }

        return container;
    }

    otherMethod() { }
}