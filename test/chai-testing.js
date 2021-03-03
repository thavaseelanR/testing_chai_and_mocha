const assert = require('chai').assert;
const app = require('../index');

describe('app', function () {
    it('app shoud return hellow', function () {
        assert.equal(app.sayHellow(), 'hellow');
    });
    it('app shoud return perams String', function () {
        const result = app.testString('hi')
        assert.typeOf(result, 'string');
    })
})