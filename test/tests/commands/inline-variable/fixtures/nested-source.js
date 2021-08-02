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
                        const d = 1234;

                        const addSomething = (a) => a + b;

                        function multiplySomething(c, d) {
                            return c * d;
                        }

                        foo.bar.baz('test');

                        return addSomething(a) * d;
                    }

                }
            }
        }

        return container;
    }

    otherMethod() { }
}