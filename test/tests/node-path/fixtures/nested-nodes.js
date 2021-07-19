class Nesting{
    testMethod() {
        return {
            foo: function (a, b) {
                return [
                    a,
                    b
                ];
            }
        }
    }

    otherMethod() {}
}