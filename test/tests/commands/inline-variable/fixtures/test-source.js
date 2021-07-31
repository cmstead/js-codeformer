const c = 'program scope';

function testFunction() {
    const a = 1234;

    if(something) {
        console.log(a);
    }

    function somethingElse (b) {
        const stuff = a + b;

        function whatever() {
            const a = 'a new scope';

            return a;
        }

        return ((a) => a * b)(a)
    }
}