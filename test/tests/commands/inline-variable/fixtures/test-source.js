const c = 'program scope';

function testFunction() {
    const a = 1234;

    if(something) {
        console.log(a);
    }

    function somethingElse (b) {
        const stuff = a + b;

        let foo = {
            a: 987
        }

        foo.a = 5678;

        function whatever() {
            const a = 'a new scope';

            return a;
        }

        ((a) => { return a + b })(a)

        return ((a) => a)(a)
    }
}