class Nesting{
    testMethod() {
        return {
            foo: function (a, b) {
                if(a === b) {
                    return []
                } else {
                    return [
                        a,
                        () => { return b; }
                    ];    
                }
            }
        }
    }

    otherMethod() {}
}