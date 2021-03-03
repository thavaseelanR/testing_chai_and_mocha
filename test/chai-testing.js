const assert = require('chai').assert;
const app = require('../index');
const expect = require('chai').expect;

describe('app', function () {
    it('app shoud return hellow', function () {
        assert.equal(app.sayHellow(), 'hellow');
    });
    it('app shoud return perams String', function () {
        const result = app.testString('hi')
        assert.typeOf(result, 'string');
    });
});

describe('#add()', () => {
    it('2 + 2 is 4', async () => {
        const p = await app.add(2, 2)
        console.log(typeof p)
        expect(p).to.equal(4);
    });
});
