function test1() {
    const a = 1234

    return function (b) {
        return a + b;
    }
}