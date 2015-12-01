var test = require('tape');

test('test', (t)=> {
    t.plan(1);

    t.equal(typeof Date.now, 'function');
    var start = Date.now();

});