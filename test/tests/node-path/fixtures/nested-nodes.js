class Nesting{
    testMethod() {
        return {
            foo: function (a, b) {
                return [
                    a,
                    () => { return b; }
                ];
            }
        }
    }

    otherMethod() {}
}