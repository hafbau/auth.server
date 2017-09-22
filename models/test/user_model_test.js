require('tap').mochaGlobals();
const should = require('should');

describe('Array.indexOf', function () {
    const array = [1, 2, 3]
    context('when item is not found', function () {
        it('does not throw an error', function () {
            array.indexOf(4)
        })
        it('returns -1', function () {
            array.indexOf(4).should.equal(-1)
        })
    })
})