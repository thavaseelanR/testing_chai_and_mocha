const myClass = require('./my-class');

module.exports = {
    sayHellow() {
        return 'hellow'
    },
    testString(value) {
        return value
    },
    add: async function add(a, b) {
        return Promise.resolve(a + b);
    }
}



